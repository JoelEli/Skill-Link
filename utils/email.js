const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: (process.env.SMTP_PORT || '587') === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  return transporter;
}

function getBaseUrl() {
  return process.env.BASE_URL || ('http://localhost:' + (process.env.PORT || 5000));
}

async function sendVerificationEmail(user, token) {
  var t = getTransporter();
  if (!t) {
    console.log('SMTP not configured — verification email skipped for', user.email);
    return false;
  }
  var link = getBaseUrl() + '?verify=' + token;
  await t.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: user.email,
    subject: 'Verify your SkillLink account',
    html:
      '<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0D0805;color:#F5E6C8;border-radius:12px">' +
        '<h1 style="font-size:1.5rem;margin:0 0 8px;color:#C8956C">Welcome to SkillLink</h1>' +
        '<p style="color:#B8956C;margin:0 0 24px;font-size:.9rem">Hi ' + user.name + ', verify your email to get started.</p>' +
        '<a href="' + link + '" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#8B4A1A,#C8956C);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:.9rem">Verify Email</a>' +
        '<p style="color:#8A6A4A;font-size:.75rem;margin-top:24px">If you didn\'t create this account, ignore this email.</p>' +
      '</div>'
  });
  return true;
}

async function sendPasswordResetEmail(user, token) {
  var t = getTransporter();
  if (!t) {
    console.log('SMTP not configured — reset email skipped for', user.email);
    return false;
  }
  var link = getBaseUrl() + '?reset=' + token;
  await t.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: user.email,
    subject: 'Reset your SkillLink password',
    html:
      '<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0D0805;color:#F5E6C8;border-radius:12px">' +
        '<h1 style="font-size:1.5rem;margin:0 0 8px;color:#C8956C">Password Reset</h1>' +
        '<p style="color:#B8956C;margin:0 0 24px;font-size:.9rem">Hi ' + user.name + ', click below to reset your password. This link expires in 1 hour.</p>' +
        '<a href="' + link + '" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#8B4A1A,#C8956C);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:.9rem">Reset Password</a>' +
        '<p style="color:#8A6A4A;font-size:.75rem;margin-top:24px">If you didn\'t request this, ignore this email. Your password won\'t change.</p>' +
      '</div>'
  });
  return true;
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
