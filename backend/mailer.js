require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    console.log("Attempting to send email to:", to);
    const info = await transporter.sendMail({
      from: `"Wickbund Dashboard" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email to", to, ":", error.message);
    return { success: false, error: error.message };
  }
};

async function sendApprovalEmail(to, fullName, username) {
  const subject = "Your Account Has Been Approved";

  const text = `
Hello ${fullName},

Your onboarding request has been approved.
Your username: ${username}

You can now log in to the  Dashboard with the email and password you submitted.

Regards,
  `;

  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;
            border: 1px solid #e0e0e0; border-radius: 8px;">
  <h2 style="color: #16a34a;">Account Approved ✅</h2>
  <p>Hello <strong>${fullName}</strong>,</p>
  <p>Your onboarding request has been <strong>approved</strong>.</p>
  <p>Your username: <strong>${username}</strong></p>
  <p>You can now log in to the  Dashboard with the email and password you submitted.</p>
  <hr style="margin: 20px 0;" />
  
</div>
  `;

  return await sendEmail(to, subject, text, html);
}

async function sendRejectionEmail(to, fullName) {
  const subject = "Update on Your Account Request";

  const text = `
Hello ${fullName},

We're writing to inform you that your onboarding request was not approved at this time.

If you believe this is a mistake, please contact the admin team.

Regards,

  `;

  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;
            border: 1px solid #e0e0e0; border-radius: 8px;">
  <h2 style="color: #dc2626;">Request Not Approved</h2>
  <p>Hello <strong>${fullName}</strong>,</p>
  <p>We're writing to inform you that your onboarding request was <strong>not approved</strong> at this time.</p>
  <p style="font-size: 14px; color: #555;">
    If you believe this is a mistake, please contact the admin team.
  </p>
  <hr style="margin: 20px 0;" />
  
</div>
  `;

  return await sendEmail(to, subject, text, html);
}

module.exports = {
  sendApprovalEmail,
  sendRejectionEmail,
};
