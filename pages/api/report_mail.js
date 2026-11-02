import { verifyUser, escapeHtml, createTransporter } from "../../utils/mailer";

export default async function (req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const user = await verifyUser(req);
    if (!user) return res.status(401).end();

    const { message } = req.body || {};
    if (!message) return res.status(400).end();

    const sender = user.email || user.phoneNumber || user.localId;
    const mailData = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        replyTo: user.email,
        subject: `Report`,
        text: message + " | Sent from: " + sender,
        html: `<div>${escapeHtml(message)}</div><p>Sent from: ${escapeHtml(sender)}</p>`,
    }

    // the report page treats 202 as sent and 201 as failed
    try {
        await createTransporter().sendMail(mailData);
        return res.status(202).end();
    } catch (err) {
        console.log(err);
        return res.status(201).end();
    }
}
