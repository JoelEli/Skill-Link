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

function emailWrap(content) {
  return '<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0A0A0A;color:#E2E8F0;border:1px solid #1a1a1a;border-radius:12px">' + content + '</div>';
}

function emailBtn(text, link) {
  return '<a href="' + link + '" style="display:inline-block;padding:12px 28px;background:#C6FF34;color:#0A0A0A;text-decoration:none;border-radius:8px;font-weight:700;font-size:.9rem">' + text + '</a>';
}

async function sendVerificationEmail(user, token) {
  var client = getClient();
  if (!client) { console.log('RESEND_API_KEY not set — verification email skipped for', user.email); return false; }
  var link = getBaseUrl() + '?verify=' + token;
  await client.emails.send({
    from: process.env.RESEND_FROM || FROM,
    to: user.email,
    subject: 'Verify your SkillLink account',
    html: emailWrap(
      '<h1 style="font-size:1.5rem;margin:0 0 8px;color:#C6FF34">Welcome to SkillLink</h1>' +
      '<p style="color:#94A3B8;margin:0 0 24px;font-size:.9rem">Hi ' + user.name + ', verify your email to get started.</p>' +
      emailBtn('Verify Email', link) +
      '<p style="color:#64748B;font-size:.75rem;margin-top:24px">If you didn\'t create this account, ignore this email.</p>'
    )
  });
  return true;
}

async function sendPasswordResetEmail(user, token) {
  var client = getClient();
  if (!client) { console.log('RESEND_API_KEY not set — reset email skipped for', user.email); return false; }
  var link = getBaseUrl() + '?reset=' + token;
  await client.emails.send({
    from: process.env.RESEND_FROM || FROM,
    to: user.email,
    subject: 'Reset your SkillLink password',
    html: emailWrap(
      '<h1 style="font-size:1.5rem;margin:0 0 8px;color:#C6FF34">Password Reset</h1>' +
      '<p style="color:#94A3B8;margin:0 0 24px;font-size:.9rem">Hi ' + user.name + ', click below to reset your password. This link expires in 1 hour.</p>' +
      emailBtn('Reset Password', link) +
      '<p style="color:#64748B;font-size:.75rem;margin-top:24px">If you didn\'t request this, ignore this email.</p>'
    )
  });
  return true;
}

async function sendWelcomeEmail(user) {
  var client = getClient();
  if (!client) { console.log('RESEND_API_KEY not set — welcome email skipped for', user.email); return false; }
  await client.emails.send({
    from: process.env.RESEND_FROM || FROM,
    to: user.email,
    subject: 'Welcome to SkillLink!',
    html: emailWrap(
      '<div style="text-align:center;margin-bottom:20px;font-size:2.5rem">🎉</div>' +
      '<h1 style="font-size:1.5rem;margin:0 0 8px;color:#C6FF34;text-align:center">Welcome aboard, ' + user.name.split(' ')[0] + '!</h1>' +
      '<p style="color:#94A3B8;margin:0 0 24px;font-size:.9rem;text-align:center;line-height:1.6">Your SkillLink account has been created successfully. You\'re now part of a growing community of students sharing knowledge.</p>' +
      '<div style="background:#171717;border:1px solid #222;border-radius:10px;padding:16px 20px;margin-bottom:24px">' +
        '<p style="color:#C6FF34;font-size:.85rem;font-weight:700;margin:0 0 10px">Here\'s what you can do:</p>' +
        '<p style="color:#94A3B8;font-size:.82rem;margin:0 0 6px">📚 Upload and share study materials</p>' +
        '<p style="color:#94A3B8;font-size:.82rem;margin:0 0 6px">🔍 Discover resources from other students</p>' +
        '<p style="color:#94A3B8;font-size:.82rem;margin:0 0 6px">💬 Join study channels and discuss topics</p>' +
        '<p style="color:#94A3B8;font-size:.82rem;margin:0">👥 Connect with peers in your field</p>' +
      '</div>' +
      '<div style="text-align:center">' + emailBtn('Get Started', getBaseUrl()) + '</div>' +
      '<p style="color:#64748B;font-size:.72rem;margin-top:28px;text-align:center">You\'re receiving this because you signed up at SkillLink.</p>'
    )
  });
  return true;
}

async function sendFollowEmail(targetUser, followerName) {
  var client = getClient();
  if (!client) { console.log('RESEND_API_KEY not set — follow email skipped for', targetUser.email); return false; }
  await client.emails.send({
    from: process.env.RESEND_FROM || FROM,
    to: targetUser.email,
    subject: followerName + ' started following you on SkillLink',
    html: emailWrap(
      '<div style="text-align:center;margin-bottom:16px;font-size:2rem">👤</div>' +
      '<h1 style="font-size:1.3rem;margin:0 0 8px;color:#C6FF34;text-align:center">New Follower!</h1>' +
      '<p style="color:#94A3B8;margin:0 0 24px;font-size:.9rem;text-align:center;line-height:1.6"><strong style="color:#E2E8F0">' + followerName + '</strong> started following you on SkillLink. Check out their profile and connect!</p>' +
      '<div style="text-align:center">' + emailBtn('View Profile', getBaseUrl()) + '</div>' +
      '<p style="color:#64748B;font-size:.72rem;margin-top:28px;text-align:center">You\'re receiving this because someone followed you on SkillLink.</p>'
    )
  });
  return true;
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail, sendFollowEmail };
