require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Use Resend's test sender if you haven't verified your own domain yet.
const FROM_ADDRESS = process.env.EMAIL_FROM || 'Wickbund Dashboard <onboarding@resend.dev>';

const sendEmail = async (to, subject, text, html) => {
  try {
    console.log('Attempting to send email to:', to);
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      text,
      html,
    });
    if (error) {
      console.error('Error sending email to', to, ':', error.message);
      return { success: false, error: error.message };
    }
    console.log('Message sent successfully:', data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Error sending email to', to, ':', error.message);
    return { success: false, error: error.message };
  }
};

async function sendApprovalEmail(to, fullName, username) {
  const subject = 'Your Account Has Been Approved';

  const text = `
Hello ${fullName},

Your onboarding request has been approved.
Your username: ${username}

You can now log in to the Wickbund Dashboard with the email and password you submitted.

Regards,
Wickbund Team
  `;

  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;
            border: 1px solid #e0e0e0; border-radius: 8px;">
  <h2 style="color: #16a34a;">Account Approved ✅</h2>
  <p>Hello <strong>${fullName}</strong>,</p>
  <p>Your onboarding request has been <strong>approved</strong>.</p>
  <p>Your username: <strong>${username}</strong></p>
  <p>You can now log in to the Wickbund Dashboard with the email and password you submitted.</p>
  <hr style="margin: 20px 0;" />
  <p style="font-size: 12px; color: #888;">
    © ${new Date().getFullYear()} Wickbund Dashboard. All rights reserved.
  </p>
</div>
  `;

  return await sendEmail(to, subject, text, html);
}

async function sendRejectionEmail(to, fullName) {
  const subject = 'Update on Your Account Request';

  const text = `
Hello ${fullName},

We're writing to inform you that your onboarding request was not approved at this time.

If you believe this is a mistake, please contact the admin team.

Regards,
Wickbund Team
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
  <p style="font-size: 12px; color: #888;">
    © ${new Date().getFullYear()} Wickbund Dashboard. All rights reserved.
  </p>
</div>
  `;

  return await sendEmail(to, subject, text, html);
}

module.exports = {
  sendApprovalEmail,
  sendRejectionEmail,
};