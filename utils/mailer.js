import { firebaseConfig } from "../firebase-config";

// Checks the Firebase ID token sent by the client. Returns the user or null.
export const verifyUser = async (req) => {
  const header = req.headers.authorization || "";
  const idToken = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!idToken) return null;

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.users?.[0] || null;
};

export const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const createTransporter = () => {
  const nodemailer = require("nodemailer");
  return nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};
