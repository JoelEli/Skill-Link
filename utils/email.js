const { Resend } = require('resend');

let resend = null;

function getClient() {
  if (resend) return resend;
  if (!process.env.RESEND_API_KEY) return null;
  resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

function getBaseUrl() {
  return process.env.BASE_URL || ('http://localhost:' + (process.env.PORT || 5000));
}

var FROM = 'SkillLink <onboarding@resend.dev>';

async function sendVerificationEmail(user, token) {
  var client = getClient();
  if (!client) {
    console.log('RESEND_API_KEY not set — verification email skipped for', user.email);
    return false;
  }
  var link = getBaseUrl() + '?verify=' + token;
  await client.emails.send({
    from: process.env.RESEND_FROM || FROM,
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
  var client = getClient();
  if (!client) {
    console.log('RESEND_API_KEY not set — reset email skipped for', user.email);
    return false;
  }
  var link = getBaseUrl() + '?reset=' + token;
  await client.emails.send({
    from: process.env.RESEND_FROM || FROM,
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

async function sendWelcomeEmail(user) {
  var client = getClient();
  if (!client) {
    console.log('RESEND_API_KEY not set — welcome email skipped for', user.email);
    return false;
  }
  var link = getBaseUrl();
  await client.emails.send({
    from: process.env.RESEND_FROM || FROM,
    to: user.email,
    subject: 'Welcome to SkillLink!',
    html:
      '<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0D0805;color:#F5E6C8;border-radius:12px">' +
        '<div style="text-align:center;margin-bottom:20px;font-size:2.5rem">🎉</div>' +
        '<h1 style="font-size:1.5rem;margin:0 0 8px;color:#C8956C;text-align:center">Welcome aboard, ' + user.name.split(' ')[0] + '!</h1>' +
        '<p style="color:#B8956C;margin:0 0 24px;font-size:.9rem;text-align:center;line-height:1.6">Your SkillLink account has been created successfully. You\'re now part of a growing community of students sharing knowledge.</p>' +
        '<div style="background:rgba(200,149,108,.1);border:1px solid rgba(200,149,108,.2);border-radius:10px;padding:16px 20px;margin-bottom:24px">' +
          '<p style="color:#C8956C;font-size:.85rem;font-weight:700;margin:0 0 10px">Here\'s what you can do:</p>' +
          '<p style="color:#B8956C;font-size:.82rem;margin:0 0 6px">📚 Upload and share study materials</p>' +
          '<p style="color:#B8956C;font-size:.82rem;margin:0 0 6px">🔍 Discover resources from other students</p>' +
          '<p style="color:#B8956C;font-size:.82rem;margin:0 0 6px">💬 Join study channels and discuss topics</p>' +
          '<p style="color:#B8956C;font-size:.82rem;margin:0">👥 Connect with peers in your field</p>' +
        '</div>' +
        '<div style="text-align:center">' +
          '<a href="' + link + '" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#8B4A1A,#C8956C);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:.9rem">Get Started</a>' +
        '</div>' +
        '<p style="color:#8A6A4A;font-size:.72rem;margin-top:28px;text-align:center">You\'re receiving this because you signed up at SkillLink.</p>' +
      '</div>'
  });
  return true;
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail };
