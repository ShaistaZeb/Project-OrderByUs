import { verifyUser, bearerToken, escapeHtml, createTransporter } from "../../utils/mailer";
import { firebaseConfig } from "../../firebase-config";

// Tells a customer their order has been taken up. The caller only names the order; the route
// reads it from Firestore with the caller's own ID token (so the security rules still apply),
// checks the caller is the agent who claimed it, and emails the address stored on the order.
// The recipient and the message both come from the server, never from the request.

const ID = /^[A-Za-z0-9_-]{1,128}$/;

const readOrder = async (ownerUid, orderId, idToken) => {
  const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${ownerUid}/${orderId}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${idToken}` } });
  if (!res.ok) return null;
  const { fields = {} } = await res.json();
  const value = (f) => f && (f.stringValue ?? f.integerValue ?? f.doubleValue ?? null);
  return { agentId: value(fields.agent_id), email: value(fields.email), cost: value(fields.cost) };
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const user = await verifyUser(req);
  if (!user) return res.status(401).end();

  const { ownerUid, orderId } = req.body || {};
  if (!ID.test(ownerUid || "") || !ID.test(orderId || "")) return res.status(400).end();

  const order = await readOrder(ownerUid, orderId, bearerToken(req));
  if (!order) return res.status(404).end();
  // Only the agent who took the order can trigger its notification.
  if (order.agentId !== user.localId) return res.status(403).end();
  if (!order.email) return res.status(409).end();

  const link = `https://${req.headers.host}/ongoingOrders`;
  const message = `Your order ${orderId} of cost ₹${order.cost} has been taken up.\nOpen ${link} to see your delivery agent's details.\n\nThank you.`;

  try {
    await createTransporter().sendMail({
      from: process.env.GMAIL_USER,
      to: order.email,
      subject: `Your order ${orderId} has been taken up`,
      text: message,
      html: `<div>${escapeHtml(message).replace(/\n/g, "<br>")}</div>`,
    });
    return res.status(200).end();
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
}
