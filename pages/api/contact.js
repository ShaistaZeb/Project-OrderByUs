import { verifyUser, escapeHtml, createTransporter } from "../../utils/mailer";

export default async function (req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const user = await verifyUser(req);
    if (!user) return res.status(401).end();

    const { name, email, message } = req.body || {};
    if (!email || !message) return res.status(400).end();

    const mailData = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: `Your Order ${name} has been takenUp`,
        text: message,
        html: `<div>${escapeHtml(message).replace(/\n/g, "<br>")}</div>`,
    }

    try {
        await createTransporter().sendMail(mailData);
        return res.status(200).end();
    } catch (err) {
        console.log(err);
        return res.status(500).end();
    }
}
