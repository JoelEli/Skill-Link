// ─── MD5 (for Gravatar) ──────────────────────────────────────────────────────
var md5 = (function() {
  function md5cycle(x, k) {
    var a = x[0], b = x[1], c = x[2], d = x[3];
    a=ff(a,b,c,d,k[0],7,-680876936);d=ff(d,a,b,c,k[1],12,-389564586);c=ff(c,d,a,b,k[2],17,606105819);b=ff(b,c,d,a,k[3],22,-1044525330);
    a=ff(a,b,c,d,k[4],7,-176418897);d=ff(d,a,b,c,k[5],12,1200080426);c=ff(c,d,a,b,k[6],17,-1473231341);b=ff(b,c,d,a,k[7],22,-45705983);
    a=ff(a,b,c,d,k[8],7,1770035416);d=ff(d,a,b,c,k[9],12,-1958414417);c=ff(c,d,a,b,k[10],17,-42063);b=ff(b,c,d,a,k[11],22,-1990404162);
    a=ff(a,b,c,d,k[12],7,1804603682);d=ff(d,a,b,c,k[13],12,-40341101);c=ff(c,d,a,b,k[14],17,-1502002290);b=ff(b,c,d,a,k[15],22,1236535329);
    a=gg(a,b,c,d,k[1],5,-165796510);d=gg(d,a,b,c,k[6],9,-1069501632);c=gg(c,d,a,b,k[11],14,643717713);b=gg(b,c,d,a,k[0],20,-373897302);
    a=gg(a,b,c,d,k[5],5,-701558691);d=gg(d,a,b,c,k[10],9,38016083);c=gg(c,d,a,b,k[15],14,-660478335);b=gg(b,c,d,a,k[4],20,-405537848);
    a=gg(a,b,c,d,k[9],5,568446438);d=gg(d,a,b,c,k[14],9,-1019803690);c=gg(c,d,a,b,k[3],14,-187363961);b=gg(b,c,d,a,k[8],20,1163531501);
    a=gg(a,b,c,d,k[13],5,-1444681467);d=gg(d,a,b,c,k[2],9,-51403784);c=gg(c,d,a,b,k[7],14,1735328473);b=gg(b,c,d,a,k[12],20,-1926607734);
    a=hh(a,b,c,d,k[5],4,-378558);d=hh(d,a,b,c,k[8],11,-2022574463);c=hh(c,d,a,b,k[11],16,1839030562);b=hh(b,c,d,a,k[14],23,-35309556);
    a=hh(a,b,c,d,k[1],4,-1530992060);d=hh(d,a,b,c,k[4],11,1272893353);c=hh(c,d,a,b,k[7],16,-155497632);b=hh(b,c,d,a,k[10],23,-1094730640);
    a=hh(a,b,c,d,k[13],4,681279174);d=hh(d,a,b,c,k[0],11,-358537222);c=hh(c,d,a,b,k[3],16,-722521979);b=hh(b,c,d,a,k[6],23,76029189);
    a=hh(a,b,c,d,k[9],4,-640364487);d=hh(d,a,b,c,k[12],11,-421815835);c=hh(c,d,a,b,k[15],16,530742520);b=hh(b,c,d,a,k[2],23,-995338651);
    a=ii(a,b,c,d,k[0],6,-198630844);d=ii(d,a,b,c,k[7],10,1126891415);c=ii(c,d,a,b,k[14],15,-1416354905);b=ii(b,c,d,a,k[5],21,-57434055);
    a=ii(a,b,c,d,k[12],6,1700485571);d=ii(d,a,b,c,k[3],10,-1894986606);c=ii(c,d,a,b,k[10],15,-1051523);b=ii(b,c,d,a,k[1],21,-2054922799);
    a=ii(a,b,c,d,k[8],6,1873313359);d=ii(d,a,b,c,k[15],10,-30611744);c=ii(c,d,a,b,k[6],15,-1560198380);b=ii(b,c,d,a,k[13],21,1309151649);
    a=ii(a,b,c,d,k[4],6,-145523070);d=ii(d,a,b,c,k[11],10,-1120210379);c=ii(c,d,a,b,k[2],15,718787259);b=ii(b,c,d,a,k[9],21,-343485551);
    x[0]=add32(a,x[0]);x[1]=add32(b,x[1]);x[2]=add32(c,x[2]);x[3]=add32(d,x[3]);
  }
  function cmn(q,a,b,x,s,t){a=add32(add32(a,q),add32(x,t));return add32((a<<s)|(a>>>(32-s)),b);}
  function ff(a,b,c,d,x,s,t){return cmn((b&c)|((~b)&d),a,b,x,s,t);}
  function gg(a,b,c,d,x,s,t){return cmn((b&d)|(c&(~d)),a,b,x,s,t);}
  function hh(a,b,c,d,x,s,t){return cmn(b^c^d,a,b,x,s,t);}
  function ii(a,b,c,d,x,s,t){return cmn(c^(b|(~d)),a,b,x,s,t);}
  function md51(s){var n=s.length,state=[1732584193,-271733879,-1732584194,271733878],i;
    for(i=64;i<=n;i+=64){md5cycle(state,md5blk(s.substring(i-64,i)));}
    s=s.substring(i-64);var tail=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for(i=0;i<s.length;i++)tail[i>>2]|=s.charCodeAt(i)<<((i%4)<<3);
    tail[i>>2]|=0x80<<((i%4)<<3);if(i>55){md5cycle(state,tail);tail=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];}
    tail[14]=n*8;md5cycle(state,tail);return state;}
  function md5blk(s){var md5blks=[],i;for(i=0;i<64;i+=4){md5blks[i>>2]=s.charCodeAt(i)+(s.charCodeAt(i+1)<<8)+(s.charCodeAt(i+2)<<16)+(s.charCodeAt(i+3)<<24);}return md5blks;}
  var hex_chr='0123456789abcdef'.split('');
  function rhex(n){var s='',j=0;for(;j<4;j++)s+=hex_chr[(n>>(j*8+4))&0x0F]+hex_chr[(n>>(j*8))&0x0F];return s;}
  function hex(x){for(var i=0;i<x.length;i++)x[i]=rhex(x[i]);return x.join('');}
  function add32(a,b){return(a+b)&0xFFFFFFFF;}
  return function(s){return hex(md51(s));};
})();

// ─── GRAVATAR ────────────────────────────────────────────────────────────────
function gravatarUrl(email, size) {
  if (!email) return null;
  return 'https://www.gravatar.com/avatar/' + md5(email.trim().toLowerCase()) + '?s=' + (size || 80) + '&d=404';
}
function mkAvatar(name, email, sizeClass, attrs) {
  sizeClass = sizeClass || 'av-sm';
  attrs = attrs || '';
  var ini = initials(name);
  var gUrl = gravatarUrl(email);
  if (gUrl) {
    return '<div class="av ' + sizeClass + '" ' + attrs + '>' +
      '<img src="' + esc(gUrl) + '" alt="" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'\'">' +
      '<span style="display:none">' + esc(ini) + '</span></div>';
  }
  return '<div class="av ' + sizeClass + '" ' + attrs + '>' + esc(ini) + '</div>';
}

// ─── STATE ─────────────────────────────────────────────────────────────────
var me = null;
var token = null;
var scopeMode = 'university';
var discoverState = { page: 1, subject: '', search: '', fileType: '', sort: 'newest' };
var discViewMode = 'grid';
var channelState = { activeChannelId: null, myChannels: [] };
var discSearchTimer = null;
var chSearchTimer = null;
var stuSearchTimer = null;
var uploadFile = null;
var attachedResource = null;
var selectedIcon = '📚';

var SUBJECTS = ['Academic','Story Books','Journals','Academic Research','Other'];

var ROUTE_PANELS = { home:'home', discover:'discover', feed:'upload', channels:'channels', students:'students', profile:'profile' };
var PANEL_ROUTES = { home:'home', discover:'discover', upload:'feed', channels:'channels', students:'students', profile:'profile' };
var _navLock = false;

var FILE_TYPE_MAP = {
  pdf:  { color:'#EF4444', label:'PDF',   ico:'📕' },
  ppt:  { color:'#F97316', label:'PPT',   ico:'📊' },
  doc:  { color:'#3B82F6', label:'DOC',   ico:'📄' },
  xls:  { color:'#10B981', label:'XLS',   ico:'📗' },
  zip:  { color:'#6B7280', label:'ZIP',   ico:'📦' },
  img:  { color:'#8B5CF6', label:'IMAGE', ico:'🖼️' },
  txt:  { color:'#14B8A6', label:'TXT',   ico:'📝' },
  csv:  { color:'#059669', label:'CSV',   ico:'📗' },
  md:   { color:'#7C3AED', label:'MD',    ico:'📝' },
  text: { color:'#C6FF34', label:'POST',  ico:'💬' },
  other:{ color:'#94A3B8', label:'FILE',  ico:'📎' }
};

// ─── SVG ICON SYSTEM ──────────────────────────────────────────────────────────
var _P = {
  home:    '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  upload:  '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  chat:    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  users:   '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  user:    '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  book:    '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  check:   '<polyline points="20 6 9 17 4 12"/>',
  menu:    '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  close:   '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  heart:   '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  bookmark:'<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  trash:   '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  clip:    '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  file:    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  search:  '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  warn:    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  inbox:   '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  arrowR:  '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  send:    '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  cloud:   '<polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>',
  save:    '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  dots:    '<circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/>',
  eye:     '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  edit:    '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>'
};
function _ico(name, size, sw, filled) {
  size = size || 16; sw = sw || 2;
  var f = filled ? 'fill="currentColor" stroke="currentColor"' : 'fill="none" stroke="currentColor"';
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" '+f+' stroke-width="'+sw+'" stroke-linecap="round" stroke-linejoin="round">'+(_P[name]||'')+'</svg>';
}

// ─── AUTH HELPERS ────────────────────────────────────────────────────────────
function loadAuth() {
  try {
    var t = localStorage.getItem('sl_token');
    var u = localStorage.getItem('sl_user');
    if (t && u) { token = t; me = JSON.parse(u); }
    scopeMode = localStorage.getItem('sl_scope') || 'university';
  } catch(e) { clearAuth(); }
}
function saveAuth(user, tok) {
  me = user; token = tok;
  localStorage.setItem('sl_token', tok);
  localStorage.setItem('sl_user', JSON.stringify(user));
}
function clearAuth() {
  me = null; token = null;
  localStorage.removeItem('sl_token');
  localStorage.removeItem('sl_user');
}

// ─── API ──────────────────────────────────────────────────────────────────────
var API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? '' : 'https://energetic-analysis-production-6afe.up.railway.app';

function api(method, path, body, isForm) {
  var opts = { method: method, headers: {} };
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  if (body && !isForm) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  } else if (body && isForm) {
    opts.body = body;
  }
  var url = API_BASE + '/api' + path;
  return fetch(url, opts).then(function(r) {
    if (r.status === 401) { clearAuth(); showAuthOverlay(); return Promise.reject(new Error('Session expired')); }
    return r.json().then(function(data) {
      if (!r.ok) {
        var msg = data.error || data.message || 'Request failed';
        if (data.details && data.details.length) msg = data.details[0].msg;
        return Promise.reject(new Error(msg));
      }
      return data;
    }, function() {
      console.error('[API] Non-JSON response:', r.status, url);
      return Promise.reject(new Error(r.ok ? 'Invalid server response' : 'Request failed (' + r.status + ') — ' + method + ' ' + url));
    });
  }).catch(function(err) {
    if (err.message !== 'Session expired') console.error('[API] Error:', method, url, err.message);
    return Promise.reject(err);
  });
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function toast(msg, type) {
  type = type || 'info';
  var c = document.getElementById('toast-container');
  var t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  c.appendChild(t);
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ t.classList.add('show'); }); });
  setTimeout(function(){
    t.classList.remove('show');
    setTimeout(function(){ if (t.parentNode) t.parentNode.removeChild(t); }, 300);
  }, 3500);
}

// ─── AUTH OVERLAY ─────────────────────────────────────────────────────────────
function showAuthOverlay() {
  document.getElementById('auth-overlay').style.display = 'flex';
}
function hideAuthOverlay() {
  document.getElementById('auth-overlay').style.display = 'none';
}
function openAuth(tab) {
  var allTabs = ['signin','signup','forgot','reset'];
  allTabs.forEach(function(t) {
    var el = document.getElementById('form-' + t);
    if (!el) return;
    if (t === tab) {
      el.style.display = 'block';
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      requestAnimationFrame(function() {
        el.style.transition = 'opacity .35s ease, transform .35s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    } else {
      el.style.display = 'none';
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
    }
  });
  document.getElementById('tab-signin').classList.toggle('active', tab === 'signin' || tab === 'forgot' || tab === 'reset');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('signin-err').classList.remove('show');
  document.getElementById('signup-err').classList.remove('show');
  if (tab === 'signup') {
    document.getElementById('su-step1').style.display = '';
    document.getElementById('su-step2').style.display = 'none';
    document.getElementById('su-dot-1').className = 'su-step-dot active';
    document.getElementById('su-dot-2').className = 'su-step-dot';
    document.getElementById('su-connector').className = 'su-connector';
  }
}

function suNextStep() {
  var name = document.getElementById('su-name').value.trim();
  var email = document.getElementById('su-email').value.trim();
  var pass = document.getElementById('su-pass').value;
  var pass2 = document.getElementById('su-pass2').value;
  var errEl = document.getElementById('signup-err');
  errEl.classList.remove('show');
  if (name.length < 2) { errEl.textContent = 'Name must be at least 2 characters'; errEl.classList.add('show'); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errEl.textContent = 'Please enter a valid email address'; errEl.classList.add('show'); return; }
  if (pass.length < 6) { errEl.textContent = 'Password must be at least 6 characters'; errEl.classList.add('show'); return; }
  if (pass !== pass2) { errEl.textContent = 'Passwords do not match'; errEl.classList.add('show'); return; }
  document.getElementById('su-step1').style.display = 'none';
  document.getElementById('su-step2').style.display = '';
  document.getElementById('su-dot-1').className = 'su-step-dot done';
  document.getElementById('su-dot-2').className = 'su-step-dot active';
  document.getElementById('su-connector').className = 'su-connector done';
  document.getElementById('su-university').focus();
}

function suPrevStep() {
  document.getElementById('su-step2').style.display = 'none';
  document.getElementById('su-step1').style.display = '';
  document.getElementById('su-dot-1').className = 'su-step-dot active';
  document.getElementById('su-dot-2').className = 'su-step-dot';
  document.getElementById('su-connector').className = 'su-connector';
}

function togglePw(inputId, btn) {
  var inp = document.getElementById(inputId);
  var show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  btn.classList.toggle('shown', show);
}

function doSignin(e) {
  e.preventDefault();
  var btn = document.getElementById('btn-signin');
  var errEl = document.getElementById('signin-err');
  errEl.classList.remove('show');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Signing in...';
  api('POST', '/auth/login', {
    email: document.getElementById('si-email').value,
    password: document.getElementById('si-pass').value
  }).then(function(d) {
    saveAuth(d.user, d.token);
    hideAuthOverlay();
    updUI();
    nav('home');
    toast('Welcome back, ' + d.user.name.split(' ')[0] + '!', 'success');
  }).catch(function(err) {
    errEl.textContent = err.message;
    errEl.classList.add('show');
  }).finally(function() {
    btn.disabled = false; btn.textContent = 'Sign In';
  });
}

function doSignup(e) {
  e.preventDefault();
  var btn = document.getElementById('btn-signup');
  var errEl = document.getElementById('signup-err');
  errEl.classList.remove('show');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Creating account...';
  api('POST', '/auth/signup', {
    name: document.getElementById('su-name').value.trim(),
    email: document.getElementById('su-email').value.trim(),
    password: document.getElementById('su-pass').value,
    university: document.getElementById('su-university').value.trim(),
    year: document.getElementById('su-year').value,
    subject: document.getElementById('su-subject').value.trim()
  }).then(function(d) {
    saveAuth(d.user, d.token);
    hideAuthOverlay();
    updUI();
    nav('home');
    toast('Account created! Welcome, ' + d.user.name.split(' ')[0] + '!', 'success');
  }).catch(function(err) {
    var msg = err.message || 'Something went wrong';
    if (msg.toLowerCase().indexOf('already exists') !== -1) {
      errEl.innerHTML = msg + ' &mdash; <a href="#" onclick="openAuth(\'signin\');return false" style="color:var(--primary)">Sign in instead</a>';
    } else {
      errEl.textContent = msg;
    }
    errEl.classList.add('show');
    suPrevStep();
  }).finally(function() {
    btn.disabled = false; btn.textContent = 'Create Account';
  });
}

function doSignout() {
  clearAuth();
  history.replaceState(null, '', window.location.pathname);
  showAuthOverlay();
  openAuth('signin');
  if (notifInterval) { clearInterval(notifInterval); notifInterval = null; }
  toast('Signed out successfully', 'info');
}

function doForgotPassword(e) {
  e.preventDefault();
  var btn = document.getElementById('btn-forgot');
  var errEl = document.getElementById('forgot-err');
  var succEl = document.getElementById('forgot-success');
  errEl.classList.remove('show'); succEl.style.display = 'none';
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Sending...';
  api('POST', '/auth/forgot-password', {
    email: document.getElementById('fp-email').value.trim()
  }).then(function(d) {
    succEl.textContent = d.message; succEl.style.display = 'block';
  }).catch(function(err) {
    errEl.textContent = err.message; errEl.classList.add('show');
  }).finally(function() {
    btn.disabled = false; btn.textContent = 'Send Reset Link';
  });
}

function doResetPassword(e) {
  e.preventDefault();
  var btn = document.getElementById('btn-reset');
  var errEl = document.getElementById('reset-err');
  var succEl = document.getElementById('reset-success');
  errEl.classList.remove('show'); succEl.style.display = 'none';
  var pass = document.getElementById('rp-pass').value;
  var pass2 = document.getElementById('rp-pass2').value;
  if (pass.length < 6) { errEl.textContent = 'Password must be at least 6 characters'; errEl.classList.add('show'); return; }
  if (pass !== pass2) { errEl.textContent = 'Passwords do not match'; errEl.classList.add('show'); return; }
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Resetting...';
  api('POST', '/auth/reset-password/' + window._resetToken, { password: pass }).then(function(d) {
    succEl.innerHTML = d.message + ' <a onclick="openAuth(\'signin\')" style="color:#C6FF34;cursor:pointer;font-weight:600">Sign in now →</a>';
    succEl.style.display = 'block';
  }).catch(function(err) {
    errEl.textContent = err.message; errEl.classList.add('show');
  }).finally(function() {
    btn.disabled = false; btn.textContent = 'Reset Password';
  });
}

function resendVerification() {
  api('POST', '/auth/resend-verification', {}).then(function(d) {
    toast(d.message, 'success');
  }).catch(function(err) {
    toast(err.message || 'Failed to send email', 'error');
  });
}

function checkVerifyBanner() {
  document.getElementById('verify-banner').style.display = 'none';
  document.getElementById('app').style.paddingTop = '';
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
var notifInterval = null;
var NOTIF_ICONS = { follow: '👤', like: '❤️', download: '⬇️', channel_post: '💬' };

function initNotifications() {
  if (!token) return;
  document.getElementById('notif-bell-wrap').style.display = '';
  loadNotifCount();
  if (notifInterval) clearInterval(notifInterval);
  notifInterval = setInterval(loadNotifCount, 30000);
}

function loadNotifCount() {
  if (!token) return;
  api('GET', '/notifications/unread-count').then(function(d) {
    var badge = document.getElementById('notif-badge');
    if (d.unreadCount > 0) {
      badge.textContent = d.unreadCount > 99 ? '99+' : d.unreadCount;
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  }).catch(function() {});
}

function toggleNotifPanel() {
  var panel = document.getElementById('notif-panel');
  var isOpen = panel.classList.contains('open');
  if (isOpen) { panel.classList.remove('open'); return; }
  panel.classList.add('open');
  loadNotifications();
  document.addEventListener('click', closeNotifOnOutside, true);
}

function closeNotifOnOutside(e) {
  var wrap = document.getElementById('notif-bell-wrap');
  if (!wrap.contains(e.target)) {
    document.getElementById('notif-panel').classList.remove('open');
    document.removeEventListener('click', closeNotifOnOutside, true);
  }
}

function loadNotifications() {
  api('GET', '/notifications?limit=20').then(function(d) {
    var body = document.getElementById('notif-panel-body');
    if (!d.notifications.length) {
      body.innerHTML = '<div class="empty-state" style="padding:24px"><p style="font-size:.82rem;color:var(--text3)">No notifications yet</p></div>';
      return;
    }
    body.innerHTML = d.notifications.map(function(n) {
      var fromName = n.from ? n.from.name : 'Someone';
      var ico = NOTIF_ICONS[n.type] || '🔔';
      var html = '<div class="notif-item' + (n.read ? '' : ' unread') + '" onclick="handleNotifClick(\'' + n._id + '\',\'' + n.type + '\',' + (n.resource ? '\'' + n.resource._id + '\'' : 'null') + ',' + (n.from ? '\'' + n.from._id + '\'' : 'null') + ')">';
      html += '<div class="notif-ico ' + n.type + '">' + ico + '</div>';
      html += '<div class="notif-body">';
      html += '<div class="notif-text"><strong>' + esc(fromName) + '</strong> ' + esc(n.message) + '</div>';
      html += '<div class="notif-time">' + timeAgo(n.createdAt) + '</div>';
      html += '</div></div>';
      return html;
    }).join('');
  }).catch(function() {});
}

function handleNotifClick(notifId, type, resourceId, fromId) {
  api('PUT', '/notifications/' + notifId + '/read').then(function() { loadNotifCount(); }).catch(function() {});
  document.getElementById('notif-panel').classList.remove('open');
  if (type === 'like' || type === 'download') {
    if (resourceId) viewResDetail(resourceId);
  } else if (type === 'follow') {
    if (fromId) loadProfile(fromId);
  }
}

function markAllNotifsRead() {
  api('PUT', '/notifications/read-all').then(function() {
    loadNotifCount();
    loadNotifications();
    toast('All notifications marked as read', 'info');
  }).catch(function() {});
}

// ─── EDIT RESOURCE ────────────────────────────────────────────────────────────
function openEditResource(resourceId) {
  api('GET', '/resources/' + resourceId).then(function(d) {
    var r = d.resource;
    document.getElementById('edit-res-id').value = r._id;
    document.getElementById('edit-res-title').value = r.title;
    document.getElementById('edit-res-subject').value = r.subject || 'Other';
    document.getElementById('edit-res-tags').value = (r.tags || []).join(', ');
    document.getElementById('edit-res-desc').value = r.description || '';
    openMod('mod-edit-res');
  }).catch(function(err) { toast(err.message || 'Failed to load resource', 'error'); });
}

function submitEditResource(e) {
  e.preventDefault();
  var btn = document.getElementById('btn-edit-res');
  var id = document.getElementById('edit-res-id').value;
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Saving...';
  api('PUT', '/resources/' + id, {
    title: document.getElementById('edit-res-title').value,
    subject: document.getElementById('edit-res-subject').value,
    tags: document.getElementById('edit-res-tags').value,
    description: document.getElementById('edit-res-desc').value
  }).then(function(d) {
    toast('Resource updated!', 'success');
    closeMod('mod-edit-res');
    closeMod('mod-res-detail');
    if (currentPanel === 'discover') loadDiscover();
    else if (currentPanel === 'home') loadHome();
    else if (currentPanel === 'profile') loadProfile(null);
  }).catch(function(err) {
    toast(err.message || 'Failed to update', 'error');
  }).finally(function() {
    btn.disabled = false; btn.textContent = 'Save Changes';
  });
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
var currentPanel = 'home';
function nav(panel, opts) {
  opts = opts || {};
  currentPanel = panel;
  var panels = ['home','discover','upload','channels','students','profile'];
  panels.forEach(function(p) {
    document.getElementById('panel-' + p).classList.toggle('active', p === panel);
    document.getElementById('nav-' + p).classList.toggle('active', p === panel);
  });
  if (!opts._fromHash) {
    _navLock = true;
    var route = PANEL_ROUTES[panel] || panel;
    var hashStr = '#' + route;
    if (opts.userId) hashStr += '/' + opts.userId;
    if (window.location.hash !== hashStr) window.location.hash = hashStr;
    _navLock = false;
  }
  var activePanel = document.getElementById('panel-' + panel);
  activePanel.classList.add('anim-fade-in');
  activePanel.addEventListener('animationend', function handler() {
    activePanel.classList.remove('anim-fade-in');
    activePanel.removeEventListener('animationend', handler);
  }, { once: true });
  var mainEl = document.querySelector('.main');
  if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
  if (panel === 'home') loadHome();
  else if (panel === 'discover') loadDiscover(1);
  else if (panel === 'upload') initUpload();
  else if (panel === 'channels') loadChannels();
  else if (panel === 'students') loadStudents(1);
  else if (panel === 'profile') loadProfile(opts.userId || null);
  closeSidebar();
}

function parseHash() {
  var hash = window.location.hash.replace(/^#/, '');
  if (!hash) return { route: 'home' };
  var qIdx = hash.indexOf('?');
  var route = qIdx >= 0 ? hash.substring(0, qIdx) : hash;
  var params = {};
  if (qIdx >= 0) {
    hash.substring(qIdx + 1).split('&').forEach(function(pair) {
      var parts = pair.split('=');
      if (parts[0]) params[parts[0]] = decodeURIComponent(parts[1] || '');
    });
  }
  var slashIdx = route.indexOf('/');
  var subPath = null;
  if (slashIdx >= 0) { subPath = route.substring(slashIdx + 1); route = route.substring(0, slashIdx); }
  return { route: route, subPath: subPath, params: params };
}

function handleHashRoute() {
  if (_navLock) return;
  var parsed = parseHash();
  var route = parsed.route;
  if (route === 'verify' && parsed.params.token) {
    history.replaceState(null, '', window.location.pathname);
    api('GET', '/auth/verify-email/' + parsed.params.token).then(function(d) {
      toast(d.message || 'Email verified!', 'success');
      if (me) { me.verified = true; localStorage.setItem('sl_user', JSON.stringify(me)); checkVerifyBanner(); }
    }).catch(function(err) { toast(err.message || 'Verification failed', 'error'); });
    return;
  }
  if (route === 'reset' && parsed.params.token) {
    history.replaceState(null, '', window.location.pathname + '#reset');
    window._resetToken = parsed.params.token;
    showAuthOverlay();
    openAuth('reset');
    return;
  }
  var panel = ROUTE_PANELS[route];
  if (!panel) { nav('home'); return; }
  if (panel === 'profile' && parsed.subPath) {
    nav('profile', { userId: parsed.subPath, _fromHash: true });
  } else {
    nav(panel, { _fromHash: true });
  }
}

window.addEventListener('hashchange', handleHashRoute);

function toggleSidebar() {
  var sb = document.getElementById('sidebar');
  var ov = document.getElementById('sidebar-overlay');
  var btn = document.getElementById('topbar-ham');
  sb.classList.toggle('open');
  ov.classList.toggle('show');
  if (btn) btn.classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');
  var btn = document.getElementById('topbar-ham');
  if (btn) btn.classList.remove('open');
}

// ─── ANIMATION HELPERS ───────────────────────────────────────────────────────
function staggerChildren(containerSel) {
  var el = typeof containerSel === 'string' ? document.querySelector(containerSel) : containerSel;
  if (!el) return;
  var children = el.children;
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    child.style.setProperty('animation-delay', Math.min(i * 30, 300) + 'ms');
    child.classList.add('anim-fade-in-up');
  }
  el.addEventListener('animationend', function handler(e) {
    if (e.target && e.target.parentNode === el) {
      e.target.classList.remove('anim-fade-in-up');
      e.target.style.removeProperty('animation-delay');
    }
  });
}

function animateCountUp(el, target) {
  var duration = 1200;
  var start = performance.now();
  function tick(now) {
    var p = Math.min((now - start) / duration, 1);
    var ease = p * (2 - p);
    var val = Math.floor(ease * target);
    el.textContent = target >= 1000 ? (val / 1000).toFixed(1) + 'k' : val;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target >= 1000 ? (target / 1000).toFixed(1) + 'k' : target;
  }
  requestAnimationFrame(tick);
}

function popIcon(btn) {
  btn.classList.add('anim-pop');
  btn.addEventListener('animationend', function handler() {
    btn.classList.remove('anim-pop');
    btn.removeEventListener('animationend', handler);
  }, { once: true });
}

function initTabIndicator(barSelector) {
  var bar = document.querySelector(barSelector);
  if (!bar) return;
  var indicator = bar.querySelector('.tab-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'tab-indicator';
    bar.appendChild(indicator);
  }
  var tabs = bar.querySelectorAll('.ptab');
  function update(tab) {
    indicator.style.width = tab.offsetWidth + 'px';
    indicator.style.left = tab.offsetLeft + 'px';
  }
  var active = bar.querySelector('.ptab.active');
  if (active) update(active);
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() { update(tab); });
  });
  window.addEventListener('resize', function() {
    var a = bar.querySelector('.ptab.active');
    if (a) update(a);
  });
}

(function initScrollShadow() {
  var main = document.querySelector('.main');
  var topbar = document.querySelector('.topbar');
  if (main && topbar) {
    window.addEventListener('scroll', function() {
      topbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }
})();

// ─── UPDATE UI ────────────────────────────────────────────────────────────────
function updUI() {
  if (!me) return;
  var ini = me.name.split(' ').map(function(w){ return w[0]; }).join('').slice(0,2).toUpperCase();
  var sidebarAv = document.getElementById('sidebar-av');
  var gUrl = gravatarUrl(me.email);
  if (gUrl) {
    sidebarAv.innerHTML = '<img src="' + esc(gUrl) + '" alt="" onerror="this.style.display=\'none\';this.parentNode.textContent=\'' + esc(ini) + '\'">';
  } else {
    sidebarAv.textContent = ini;
  }
  document.getElementById('sidebar-name').textContent = me.name;
  document.getElementById('sidebar-sub').textContent = me.university || me.subject || 'Student';
  var hr = new Date().getHours();
  var greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('home-greeting').textContent = greet + ', ' + me.name.split(' ')[0] + '!';
  checkVerifyBanner();
  initNotifications();
}

function esc(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
function fmtSize(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/1048576).toFixed(1) + ' MB';
}
function timeAgo(d) {
  var s = (Date.now() - new Date(d)) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s/60) + 'm ago';
  if (s < 86400) return Math.floor(s/3600) + 'h ago';
  if (s < 604800) return Math.floor(s/86400) + 'd ago';
  return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric'});
}
// ─── MULTI-TENANCY SCOPE ──────────────────────────────────────────────────
function getTenant() { return (me && me.tenant) ? me.tenant : ''; }
function getScopeParams() {
  if (scopeMode === 'global' || !getTenant()) return '&scope=global';
  return '&tenant=' + encodeURIComponent(getTenant());
}
function setScope(mode) {
  scopeMode = mode;
  localStorage.setItem('sl_scope', mode);
  document.querySelectorAll('.scope-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.scope === mode);
  });
  if (currentPanel === 'home') loadHome();
  else if (currentPanel === 'discover') loadDiscover(1);
  else if (currentPanel === 'channels') loadChannels();
  else if (currentPanel === 'students') loadStudents(1);
}
function mkScopeToggle() {
  var uni = (me && me.university) ? me.university : '';
  if (!getTenant()) return '';
  return '<div class="scope-toggle">' +
    '<button class="scope-btn' + (scopeMode === 'university' ? ' active' : '') + '" data-scope="university" onclick="setScope(\'university\')">🏫 ' + esc(uni) + '</button>' +
    '<button class="scope-btn' + (scopeMode === 'global' ? ' active' : '') + '" data-scope="global" onclick="setScope(\'global\')">🌐 Global</button>' +
  '</div>';
}

function initials(name) {
  if (!name) return '?';
  return name.split(' ').map(function(w){ return w[0]; }).join('').slice(0,2).toUpperCase();
}

// ─── RESOURCE CARD ────────────────────────────────────────────────────────────
function mkResCard(r, opts) {
  opts = opts || {};
  var ft = FILE_TYPE_MAP[r.fileType] || FILE_TYPE_MAP.other;
  var isLiked = me && r.likes && r.likes.some(function(id){ return id === me._id || (id && id._id === me._id); });
  var isSaved = me && me.savedResources && me.savedResources.some(function(id){ return id === r._id || (id && (id._id || id) === r._id); });
  var likesCount = r.likesCount !== undefined ? r.likesCount : (r.likes ? r.likes.length : 0);
  var authorName = r.user ? (r.user.name || 'Unknown') : 'Unknown';
  var authorEmail = r.user ? (r.user.email || '') : '';
  var authorId = r.user ? (r.user._id || r.user) : null;
  var isOwner = me && authorId && (authorId === me._id || (authorId._id || authorId).toString() === me._id);
  var html = '<div class="res-card" onclick="viewResDetail(\'' + esc(r._id) + '\')">';
  html += '<div class="res-card-top" style="background:linear-gradient(135deg,'+ft.color+'22 0%,'+ft.color+'08 100%);border-bottom:1px solid '+ft.color+'25">';
  html += '<span class="res-card-type-txt" style="color:'+ft.color+'">'+ft.label+'</span>';
  html += '<div class="res-subj-badge">'+esc(r.subject)+'</div>';
  html += '</div>';
  html += '<div class="res-card-body">';
  html += '<div class="res-card-title">' + esc(r.title) + '</div>';
  html += '<div class="res-card-author">';
  html += mkAvatar(authorName, authorEmail, 'av-sm', 'style="cursor:pointer" onclick="event.stopPropagation();viewStudentProfile(\'' + esc(String(authorId)) + '\')"');
  html += '<span class="res-card-author-name" style="cursor:pointer" onclick="event.stopPropagation();viewStudentProfile(\'' + esc(String(authorId)) + '\')">' + esc(authorName) + '</span>';
  html += '<span class="res-card-author-date">' + timeAgo(r.createdAt) + '</span></div>';
  html += '<div class="res-card-stats"><span>'+_ico('download',13,2.5)+' '+(r.downloads||0)+'</span><span>'+_ico('heart',13,2.5)+' '+likesCount+'</span><span>'+esc(fmtSize(r.fileSize))+'</span></div>';
  html += '<div class="res-card-actions">';
  html += '<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();previewResource(\''+esc(r._id)+'\')">'+_ico('eye',13,2.5)+' Preview</button>';
  html += '<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();downloadResource(\''+esc(r._id)+'\',\''+esc(r.fileName)+'\')">'+_ico('download',13,2.5)+' Download</button>';
  html += '<button class="btn btn-sm '+(isLiked?'btn-danger':'btn-ghost')+'" onclick="event.stopPropagation();toggleLike(\''+esc(r._id)+'\',this)">'+_ico('heart',13,2.5)+' '+likesCount+'</button>';
  if (!opts.hideSave) {
    html += '<button class="btn btn-sm '+(isSaved?'btn-green':'btn-ghost')+'" title="'+(isSaved?'Saved':'Save')+'" onclick="event.stopPropagation();toggleSave(\''+esc(r._id)+'\',this)">'+_ico('bookmark',13,2.5,isSaved)+'</button>';
  }
  html += '</div></div></div>';
  return html;
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function loadHome() {
  if (!me) return;

  // Trending
  document.getElementById('home-trending').innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:20px"><div class="spinner"></div></div>';
  // Scope toggle
  var heroEl = document.querySelector('#panel-home .home-hero');
  var scopeEl = document.getElementById('home-scope-toggle');
  if (!scopeEl && heroEl) {
    heroEl.insertAdjacentHTML('afterend', '<div id="home-scope-toggle">' + mkScopeToggle() + '</div>');
  } else if (scopeEl) {
    scopeEl.innerHTML = mkScopeToggle();
  }

  api('GET', '/resources?sort=downloads&limit=6' + getScopeParams()).then(function(d) {
    if (!d.resources || !d.resources.length) {
      document.getElementById('home-trending').innerHTML = '<div style="grid-column:1/-1" class="empty-state"><div class="empty-state-ico">'+_ico('inbox',44,1.2)+'</div><h3>No resources yet</h3><p>Be the first to upload!</p></div>';
      return;
    }
    document.getElementById('home-trending').innerHTML = d.resources.map(function(r){ return mkResCard(r); }).join('');
    staggerChildren('#home-trending');
  }).catch(function() {});
}

function showUsersModal(title, users) {
  document.getElementById('mod-users-title').textContent = title;
  var el = document.getElementById('mod-users-list');
  if (!users || !users.length) {
    el.innerHTML = '<div class="empty-state" style="padding:24px 0"><div class="empty-state-ico">'+_ico('users',40,1.2)+'</div><h3>No ' + esc(title.toLowerCase()) + ' yet</h3></div>';
  } else {
    el.innerHTML = users.map(function(u) {
      var uid = u._id || u;
      var name = u.name || 'Unknown';
      var isMe = me && uid === me._id;
      var isFollowing = me && window._homeFollowing && window._homeFollowing.some(function(f){ return (f._id || f) === uid; });
      return '<div style="display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--border)">' +
        mkAvatar(name, u.email || '', 'av-md', 'style="flex-shrink:0"') +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(name) + '</div>' +
          '<div style="font-size:.78rem;color:var(--text3)">' + (u.university ? esc(u.university) : 'Student') + (u.year ? ' · ' + esc(u.year) : '') + '</div>' +
        '</div>' +
        (!isMe ? '<button class="btn btn-sm ' + (isFollowing ? 'btn-ghost' : 'btn-primary') + '" onclick="toggleFollowModal(\'' + esc(uid) + '\',this)">' + (isFollowing ? 'Unfollow' : 'Follow') + '</button>' : '<span style="font-size:.75rem;color:var(--text4)">You</span>') +
      '</div>';
    }).join('');
  }
  openMod('mod-users');
}

function toggleFollowModal(uid, btn) {
  var isFollowing = btn.textContent.trim() === 'Unfollow';
  api('POST', '/users/' + uid + (isFollowing ? '/unfollow' : '/follow')).then(function() {
    btn.textContent = isFollowing ? 'Follow' : 'Unfollow';
    btn.className = 'btn btn-sm ' + (isFollowing ? 'btn-primary' : 'btn-ghost');
    if (window._homeFollowing) {
      if (isFollowing) {
        window._homeFollowing = window._homeFollowing.filter(function(f){ return (f._id || f) !== uid; });
      } else {
        window._homeFollowing.push({ _id: uid });
      }
    }
  }).catch(function(err) { toast(err.message, 'error'); });
}

// ─── DISCOVER ─────────────────────────────────────────────────────────────────
function initSubjectChips() {
  var el = document.getElementById('subj-chips');
  if (el.children.length) return;
  var subjects = ['All'].concat(SUBJECTS);
  el.innerHTML = subjects.map(function(s) {
    return '<button class="chip' + (s === 'All' ? ' active' : '') + '" onclick="setSubjectFilter(\'' + esc(s) + '\',this)">' + esc(s) + '</button>';
  }).join('');
}

function setSubjectFilter(s, el) {
  discoverState.subject = s === 'All' ? '' : s;
  document.querySelectorAll('#subj-chips .chip').forEach(function(c){ c.classList.remove('active'); });
  el.classList.add('active');
  loadDiscover(1);
}

function setDiscType(type, el) {
  discoverState.fileType = type;
  document.querySelectorAll('#disc-type-pills .disc-pill').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  loadDiscover(1);
}

function setDiscView(mode, el) {
  discViewMode = mode;
  document.querySelectorAll('.disc-vbtn').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  var grid = document.getElementById('disc-grid');
  if (mode === 'list') grid.classList.add('disc-list-mode');
  else grid.classList.remove('disc-list-mode');
  loadDiscover(discoverState.page);
}

function clearDiscSearch() {
  document.getElementById('disc-search').value = '';
  var clr = document.getElementById('disc-search-clear');
  if (clr) clr.style.display = 'none';
  loadDiscover(1);
}

function discSearchDebounce() {
  var v = document.getElementById('disc-search').value;
  var clr = document.getElementById('disc-search-clear');
  if (clr) clr.style.display = v ? '' : 'none';
  clearTimeout(discSearchTimer);
  discSearchTimer = setTimeout(function(){ loadDiscover(1); }, 350);
}

function mkSkelCard() {
  if (discViewMode === 'list') {
    return '<div class="res-card res-list-card" style="pointer-events:none">'
      + '<div class="rlc-badge skel" style="border-radius:16px 0 0 16px;width:56px;align-self:stretch"></div>'
      + '<div class="rlc-content" style="gap:8px">'
      + '<div class="skel" style="height:13px;width:60%;border-radius:5px"></div>'
      + '<div style="display:flex;gap:8px"><div class="skel" style="height:10px;width:80px;border-radius:4px"></div><div class="skel" style="height:10px;width:50px;border-radius:4px"></div></div>'
      + '</div><div class="rlc-actions"><div class="skel" style="height:34px;width:90px;border-radius:999px"></div></div></div>';
  }
  return '<div class="res-card" style="pointer-events:none">'
    + '<div class="res-card-top skel" style="height:120px;border-radius:0;flex-shrink:0"></div>'
    + '<div class="res-card-body" style="gap:10px">'
    + '<div class="skel" style="height:13px;width:75%;margin-bottom:2px"></div>'
    + '<div class="skel" style="height:11px;width:40%"></div>'
    + '<div class="skel" style="height:11px;width:85%;margin-top:6px"></div>'
    + '<div style="display:flex;gap:6px;margin-top:12px">'
    + '<div class="skel" style="height:28px;flex:1;border-radius:8px"></div>'
    + '<div class="skel" style="height:28px;flex:1;border-radius:8px"></div>'
    + '</div></div></div>';
}

function mkResCardList(r, opts) {
  opts = opts || {};
  var ft = FILE_TYPE_MAP[r.fileType] || FILE_TYPE_MAP.other;
  var isLiked = me && r.likes && r.likes.some(function(id){ return id === me._id || (id && id._id === me._id); });
  var isSaved = me && me.savedResources && me.savedResources.some(function(id){ return id === r._id || (id && (id._id || id) === r._id); });
  var likesCount = r.likesCount !== undefined ? r.likesCount : (r.likes ? r.likes.length : 0);
  var authorName = r.user ? (r.user.name || 'Unknown') : 'Unknown';
  var authorId = r.user ? (r.user._id || r.user) : null;

  var html = '<div class="res-card res-list-card" onclick="viewResDetail(\'' + esc(r._id) + '\')">';

  // Colored type badge on the left
  html += '<div class="rlc-badge" style="background:' + ft.color + '1a;border-right:1px solid ' + ft.color + '28;color:' + ft.color + '">' + ft.label + '</div>';

  // Main content
  html += '<div class="rlc-content">';
  html += '<div class="rlc-title">' + esc(r.title) + '</div>';
  html += '<div class="rlc-meta">';
  html += '<span class="rlc-subj">' + esc(r.subject) + '</span>';
  html += '<span class="rlc-sep">·</span>';
  html += '<span style="cursor:pointer;color:var(--text3)" onclick="event.stopPropagation();viewStudentProfile(\'' + esc(String(authorId)) + '\')">' + esc(authorName) + '</span>';
  html += '<span class="rlc-sep">·</span>';
  html += '<span>' + _ico('download', 11, 2.5) + ' ' + (r.downloads || 0) + '</span>';
  html += '<span>' + _ico('heart', 11, 2.5) + ' ' + likesCount + '</span>';
  html += '<span>' + esc(fmtSize(r.fileSize)) + '</span>';
  html += '<span class="rlc-time">' + timeAgo(r.createdAt) + '</span>';
  html += '</div></div>';

  // Actions
  html += '<div class="rlc-actions" onclick="event.stopPropagation()">';
  html += '<button class="rlc-btn-prev" onclick="previewResource(\'' + esc(r._id) + '\')">' + _ico('eye', 14, 2.5) + ' Preview</button>';
  html += '<button class="rlc-btn-icon" title="Download" onclick="downloadResource(\'' + esc(r._id) + '\',\'' + esc(r.fileName) + '\')">' + _ico('download', 15, 2.5) + '</button>';
  if (!opts.hideSave) html += '<button class="rlc-btn-icon ' + (isSaved ? 'rlc-saved' : '') + '" title="' + (isSaved ? 'Saved' : 'Save') + '" onclick="toggleSave(\'' + esc(r._id) + '\',this)">' + _ico('bookmark', 15, 2.5, isSaved) + '</button>';
  html += '</div></div>';
  return html;
}

function loadDiscover(page) {
  initSubjectChips();
  var search = document.getElementById('disc-search').value.trim();
  var sort = document.getElementById('disc-sort').value;
  discoverState = { page: page || 1, subject: discoverState.subject, search: search, sort: sort, fileType: discoverState.fileType || '' };

  var q = '?page=' + discoverState.page + '&limit=12&sort=' + sort;
  if (discoverState.subject) q += '&subject=' + encodeURIComponent(discoverState.subject);
  if (search) q += '&search=' + encodeURIComponent(search);
  if (discoverState.fileType) q += '&fileType=' + encodeURIComponent(discoverState.fileType);
  q += getScopeParams();

  // Scope toggle
  var scopeEl = document.getElementById('disc-scope-toggle');
  if (!scopeEl) {
    var filterRow = document.querySelector('#panel-discover .disc-filter-row');
    if (filterRow) filterRow.insertAdjacentHTML('beforebegin', '<div id="disc-scope-toggle">' + mkScopeToggle() + '</div>');
  } else {
    scopeEl.innerHTML = mkScopeToggle();
  }

  var grid = document.getElementById('disc-grid');
  grid.innerHTML = [1,2,3,4,5,6].map(mkSkelCard).join('');
  document.getElementById('disc-meta').innerHTML = '';

  api('GET', '/resources' + q).then(function(d) {
    if (!d.resources || !d.resources.length) {
      grid.innerHTML = '<div style="grid-column:1/-1" class="empty-state">'
        + '<div class="empty-state-ico">' + _ico('search', 44, 1.2) + '</div>'
        + '<h3>' + (search ? 'No results for &ldquo;' + esc(search) + '&rdquo;' : 'No resources found') + '</h3>'
        + '<p>' + (search ? 'Try a different keyword or clear your search.' : 'Be the first to share a resource!') + '</p>'
        + (search ? '<button class="btn btn-ghost btn-sm" style="margin-top:10px" onclick="clearDiscSearch()">Clear search</button>' : '')
        + '</div>';
      document.getElementById('disc-pagination').innerHTML = '';
      document.getElementById('disc-meta').innerHTML = '';
      return;
    }
    grid.innerHTML = d.resources.map(function(r) {
      return discViewMode === 'list' ? mkResCardList(r) : mkResCard(r);
    }).join('');
    staggerChildren(grid);
    var meta = document.getElementById('disc-meta');
    var info = 'Showing <strong>' + d.count + '</strong> of <strong>' + d.total + '</strong> resource' + (d.total !== 1 ? 's' : '');
    if (search) info += ' for &ldquo;<strong>' + esc(search) + '</strong>&rdquo;';
    if (discoverState.subject) info += ' in <strong>' + esc(discoverState.subject) + '</strong>';
    meta.innerHTML = info;
    renderPagination('disc-pagination', d.page, d.pages, 'browsePage');
  }).catch(function(err) {
    grid.innerHTML = '<div style="grid-column:1/-1" class="empty-state"><div class="empty-state-ico">' + _ico('warn', 44, 1.2) + '</div><h3>Failed to load resources</h3><p>' + esc(err.message) + '</p></div>';
    document.getElementById('disc-meta').innerHTML = '';
  });
}
window.browsePage = function(p) { loadDiscover(p); };

// ─── UPLOAD ───────────────────────────────────────────────────────────────────
function selectCategory(cat, el) {
  document.querySelectorAll('#cat-picker .cat-card').forEach(function(c){ c.classList.remove('active'); });
  el.classList.add('active');
  document.getElementById('up-subject').value = cat;
}

function initUpload() {
  document.getElementById('up-subject').value = '';
  if (me) {
    var feedAv = document.getElementById('feed-av');
    var gUrl = gravatarUrl(me.email);
    if (gUrl) {
      feedAv.innerHTML = '<img src="' + esc(gUrl) + '" alt="" onerror="this.style.display=\'none\';this.parentNode.textContent=\'' + esc(initials(me.name)) + '\'">';
    } else {
      feedAv.textContent = initials(me.name);
    }
  }
  collapseFeedCreate();
  loadFeed(1);
}

function expandFeedCreate() {
  var expanded = document.getElementById('feed-create-expanded');
  expanded.style.display = '';
  expanded.classList.add('anim-fade-in');
  expanded.addEventListener('animationend', function handler() {
    expanded.classList.remove('anim-fade-in');
    expanded.removeEventListener('animationend', handler);
  }, { once: true });
  document.getElementById('feed-create-placeholder').style.display = 'none';
  document.getElementById('up-title').focus();
}

function collapseFeedCreate() {
  document.getElementById('feed-create-expanded').style.display = 'none';
  document.getElementById('feed-create-placeholder').style.display = '';
  var form = document.getElementById('upload-form');
  if (form) form.reset();
  dzClear();
  uploadFile = null;
}

function loadFeed(page) {
  var q = '?page=' + (page || 1) + '&limit=10&sort=newest' + getScopeParams();
  var stream = document.getElementById('feed-stream');
  stream.innerHTML = '<div class="empty-state" style="padding:40px 0"><div class="spinner" style="margin:0 auto 12px"></div><p class="shimmer-text">Loading feed...</p></div>';

  var scopeEl = document.getElementById('feed-scope-toggle');
  if (scopeEl) scopeEl.innerHTML = mkScopeToggle();

  api('GET', '/resources' + q).then(function(d) {
    if (!d.resources || !d.resources.length) {
      stream.innerHTML = '<div class="empty-state"><div class="empty-state-ico">' + _ico('inbox',44,1.2) + '</div><h3>No posts yet</h3><p>Be the first to share a resource!</p></div>';
      document.getElementById('feed-pagination').innerHTML = '';
      return;
    }
    stream.innerHTML = d.resources.map(mkFeedPost).join('');
    staggerChildren(stream);
    renderPagination('feed-pagination', d.page, d.pages, 'loadFeed');
  }).catch(function() {
    stream.innerHTML = '<div class="empty-state"><div class="empty-state-ico">' + _ico('warn',44,1.2) + '</div><h3>Could not load feed</h3></div>';
  });
}

function mkFeedPost(r) {
  var ft = FILE_TYPE_MAP[r.fileType] || FILE_TYPE_MAP.other;
  var authorName = r.user ? (r.user.name || 'Unknown') : 'Unknown';
  var authorEmail = r.user ? (r.user.email || '') : '';
  var authorId = r.user ? (r.user._id || r.user) : null;
  var authorUni = r.user && r.user.university ? r.user.university : '';
  var isLiked = me && r.likes && r.likes.some(function(id){ return id === me._id || (id && id._id === me._id); });
  var isSaved = me && me.savedResources && me.savedResources.some(function(id){ return id === r._id || (id && (id._id || id) === r._id); });
  var likesCount = r.likesCount !== undefined ? r.likesCount : (r.likes ? r.likes.length : 0);
  var isViewOnly = r.accessMode === 'view-only';

  var html = '<div class="feed-post">';
  // Header
  html += '<div class="feed-post-hd">';
  html += mkAvatar(authorName, authorEmail, 'av-md', 'onclick="viewStudentProfile(\'' + esc(String(authorId)) + '\')" style="cursor:pointer"');
  html += '<div class="feed-post-author">';
  html += '<div class="feed-post-name" onclick="viewStudentProfile(\'' + esc(String(authorId)) + '\')">' + esc(authorName) + '</div>';
  html += '<div class="feed-post-meta">' + (authorUni ? esc(authorUni) + ' · ' : '') + timeAgo(r.createdAt) + (r.visibility === 'global' ? ' · 🌐' : '') + '</div>';
  html += '</div></div>';
  // Body
  html += '<div class="feed-post-body">';
  if (r.description) html += '<div class="feed-post-desc">' + esc(r.description) + '</div>';
  // File card
  if (r.fileUrl && r.fileType !== 'text') {
    html += '<div class="feed-post-file" onclick="viewResDetail(\'' + esc(r._id) + '\')">';
    html += '<div class="feed-post-file-ico" style="background:' + ft.color + '1a;color:' + ft.color + '">' + ft.label + '</div>';
    html += '<div class="feed-post-file-info">';
    html += '<div class="feed-post-file-title">' + esc(r.title) + '</div>';
    html += '<div class="feed-post-file-meta"><span>' + fmtSize(r.fileSize) + '</span><span>' + esc(r.subject) + '</span></div>';
    html += '</div>';
    if (isViewOnly) {
      html += '<span class="feed-post-access vo">View only</span>';
    } else {
      html += '<button class="feed-post-access dl" onclick="event.stopPropagation();downloadResource(\'' + esc(r._id) + '\',\'' + esc(r.fileName || r.title) + '\')" style="cursor:pointer;border:none;font-family:inherit">Download</button>';
    }
  }
  html += '</div></div>';
  // Actions
  html += '<div class="feed-post-actions">';
  html += '<button class="feed-act-btn' + (isLiked ? ' liked' : '') + '" onclick="toggleLike(\'' + esc(r._id) + '\',this)">' + _ico('heart',15,2,isLiked) + ' ' + likesCount + '</button>';
  html += '<button class="feed-act-btn' + (isSaved ? ' saved' : '') + '" onclick="toggleSave(\'' + esc(r._id) + '\',this)">' + _ico('bookmark',15,2,isSaved) + ' ' + (isSaved ? 'Saved' : 'Save') + '</button>';
  html += '<button class="feed-act-btn" onclick="viewResDetail(\'' + esc(r._id) + '\')">' + _ico('eye',15,2) + ' View</button>';
  html += '</div></div>';
  return html;
}


function dzSelect(input) {
  if (input.files && input.files[0]) setUploadFile(input.files[0]);
}
function setUploadFile(file) {
  uploadFile = file;
  var ext = file.name.split('.').pop().toLowerCase();
  var ftKey = getFileTypeFromExt(ext);
  var ft = FILE_TYPE_MAP[ftKey] || FILE_TYPE_MAP.other;
  document.getElementById('dz-prev-ico').textContent = ft.label || '📎';
  document.getElementById('dz-prev-name').textContent = file.name;
  document.getElementById('dz-prev-size').textContent = fmtSize(file.size);
  document.getElementById('feed-file-attached').style.display = '';
}
function dzClear(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  uploadFile = null;
  document.getElementById('upload-file').value = '';
  document.getElementById('feed-file-attached').style.display = 'none';
}
function getFileTypeFromExt(ext) {
  var m = {pdf:'pdf',ppt:'ppt',pptx:'ppt',doc:'doc',docx:'doc',xls:'xls',xlsx:'xls',zip:'zip',rar:'zip','7z':'zip',png:'img',jpg:'img',jpeg:'img',gif:'img',txt:'txt',csv:'csv',md:'md'};
  return m[ext] || 'other';
}
function submitResource(e) {
  e.preventDefault();
  var title = document.getElementById('up-title').value.trim();
  if (!title) { toast('Please add a title', 'error'); return; }
  var btn = document.getElementById('btn-upload');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
  var fd = new FormData();
  if (uploadFile) fd.append('file', uploadFile);
  fd.append('title', title);
  fd.append('description', document.getElementById('up-desc').value);
  fd.append('subject', document.getElementById('up-subject').value || 'Other');
  fd.append('accessMode', document.getElementById('up-view-only').checked ? 'view-only' : 'download');
  fd.append('visibility', document.getElementById('up-visibility').value);
  api('POST', '/resources', fd, true).then(function(d) {
    toast('Posted!', 'success');
    collapseFeedCreate();
    loadFeed(1);
  }).catch(function(err) {
    toast(err.message, 'error');
  }).finally(function() {
    btn.disabled = false; btn.textContent = 'Post';
  });
}

// ─── CHANNELS ─────────────────────────────────────────────────────────────────
function chSearchDebounce() {
  clearTimeout(chSearchTimer);
  chSearchTimer = setTimeout(function(){ loadChannels(); }, 350);
}

function loadChannels() {
  var scopeEl = document.getElementById('ch-scope-toggle');
  if (scopeEl) scopeEl.innerHTML = mkScopeToggle();
  var search = document.getElementById('ch-search').value.trim();
  var q = '?limit=50' + (search ? '&search=' + encodeURIComponent(search) : '') + getScopeParams();
  api('GET', '/channels' + q).then(function(d) {
    channelState.myChannels = (d.channels || []).filter(function(c) {
      return me && c.members && c.members.some(function(mid){ return (mid._id || mid) === me._id; });
    });
    renderChannelList(d.channels || []);
  }).catch(function() {
    document.getElementById('ch-list-body').innerHTML = '<div class="empty-state" style="padding:16px"><p>Error loading channels</p></div>';
  });
}

function renderChannelList(channels) {
  var el = document.getElementById('ch-list-body');
  if (!channels.length) {
    el.innerHTML = '<div class="empty-state" style="padding:20px"><div class="empty-state-ico">'+_ico('chat',44,1.2)+'</div><h3>No channels</h3><p>Create one!</p></div>';
    return;
  }
  // Sort: joined first
  channels.sort(function(a,b) {
    var am = me && a.members && a.members.some(function(id){ return (id._id||id) === me._id; });
    var bm = me && b.members && b.members.some(function(id){ return (id._id||id) === me._id; });
    if (am && !bm) return -1; if (!am && bm) return 1; return 0;
  });
  el.innerHTML = channels.map(function(c) {
    var isMember = me && c.members && c.members.some(function(id){ return (id._id||id) === me._id; });
    var isCreator = me && c.creator && (c.creator._id || c.creator) === me._id;
    var isActive = channelState.activeChannelId === c._id;
    var icon = (c.icon && c.icon !== '??') ? c.icon : '📚';
    var count = c.memberCount || (c.members ? c.members.length : 0);
    return '<div class="ch-item' + (isActive ? ' active' : '') + '" onclick="selectChannel(\'' + esc(c._id) + '\')">' +
      '<div class="ch-item-ico">' + icon + '</div>' +
      '<div class="ch-item-info">' +
        '<div class="ch-item-name">' + esc(c.name) + '</div>' +
        '<div class="ch-item-meta">' + count + ' member' + (count !== 1 ? 's' : '') +
          (isMember ? ' <span class="ch-member-badge">Joined</span>' : '') +
        '</div>' +
      '</div>' +
      (isCreator ? '<button class="ch-item-del" onclick="deleteChannel(event,\''+esc(c._id)+'\')" title="Delete channel">'+_ico('trash',13,2)+'</button>' : '') +
    '</div>';
  }).join('');
  staggerChildren(el);
}

function selectChannel(id) {
  channelState.activeChannelId = id;
  // Refresh list to mark active
  loadChannels();
  // Load channel content
  var content = document.getElementById('ch-content');
  content.innerHTML = '<div style="flex:1;display:flex;align-items:center;justify-content:center"><div class="spinner"></div></div>';
  Promise.all([
    api('GET', '/channels/' + id),
    api('GET', '/channels/' + id + '/posts?limit=30')
  ]).then(function(results) {
    var ch = results[0].channel;
    var posts = results[1].posts || [];
    var isMember = me && ch.members && ch.members.some(function(mid){ return (mid._id||mid) === me._id; });
    var isCreator = me && ch.creator && (ch.creator._id || ch.creator) === me._id;
    channelState.creatorId = ch.creator ? (ch.creator._id || ch.creator) : null;
    var icon = (ch.icon && ch.icon !== '??') ? ch.icon : '📚';
    var memberCount = ch.memberCount || (ch.members ? ch.members.length : 0);
    var html = '';
    // Header
    html += '<div class="ch-header">';
    html += '<div class="ch-header-ico">' + icon + '</div>';
    html += '<div class="ch-header-info">';
    html += '<div class="ch-header-name">' + esc(ch.name) + '</div>';
    html += '<div class="ch-header-meta">' + memberCount + ' member' + (memberCount !== 1 ? 's' : '') + (ch.description ? ' · ' + esc(ch.description) : '') + '</div>';
    html += '</div>';
    html += '<div class="ch-header-actions">';
    if (isCreator) {
      html += '<button class="btn btn-sm btn-danger" onclick="deleteChannel(null,\''+esc(ch._id)+'\')" title="Delete channel">'+_ico('trash',14,2)+' Delete</button>';
    } else {
      html += '<button class="btn btn-sm ' + (isMember ? 'btn-ghost' : 'btn-primary') + '" onclick="toggleJoinChannel(\'' + esc(ch._id) + '\',' + isMember + ')">' + (isMember ? 'Leave' : 'Join Channel') + '</button>';
    }
    html += '</div></div>';
    // Posts
    html += '<div class="ch-posts" id="ch-posts-list">';
    if (!posts.length) {
      html += '<div class="ch-empty"><div class="ch-empty-ico">'+_ico('chat',44,1.2)+'</div><div class="ch-empty-title">No posts yet</div><div class="ch-empty-desc">Be the first to share something in this channel</div></div>';
    } else {
      posts.slice().reverse().forEach(function(p) { html += renderPost(p); });
    }
    html += '</div>';
    // Input (members only)
    if (isMember) {
      html += '<div class="ch-input-area">';
      if (attachedResource) {
        html += '<div class="ch-attach-bar">'+_ico('clip',13,2)+' <strong>'+esc(attachedResource.title)+'</strong><button class="btn btn-xs btn-ghost" onclick="attachedResource=null;selectChannel(\''+esc(ch._id)+'\')">Remove</button></div>';
      }
      html += '<div class="ch-input-box">';
      html += '<textarea id="post-input" placeholder="Message #' + esc(ch.name) + '…" rows="1" onkeydown="postKeydown(event,\'' + esc(ch._id) + '\')"></textarea>';
      html += '<div class="ch-input-actions">';
      html += '<button class="ch-attach-btn" onclick="openAttachRes()" title="Attach a resource">'+_ico('clip',16,2)+'</button>';
      html += '<button class="ch-send-btn" onclick="sendPost(\''+esc(ch._id)+'\')">'+_ico('send',13,2)+' Send</button>';
      html += '</div></div></div>';
    }
    content.innerHTML = html;
  }).catch(function(err) {
    content.innerHTML = '<div class="empty-state"><div class="empty-state-ico">'+_ico('warn',44,1.2)+'</div><h3>Error loading channel</h3><p>' + esc(err.message) + '</p></div>';
  });
}

function renderPost(p) {
  var authorName = p.user ? p.user.name : 'Unknown';
  var authorEmail = p.user ? (p.user.email || '') : '';
  var authorId = p.user ? (p.user._id || p.user) : null;
  var isLiked = me && p.likes && p.likes.some(function(id){ return (id._id||id) === me._id; });
  var uni = p.user && p.user.university ? p.user.university : '';
  var isAuthor = me && authorId === me._id;
  var isChCreator = me && channelState.creatorId && channelState.creatorId === me._id;
  var canDelete = isAuthor || isChCreator;
  var chId = esc(channelState.activeChannelId);
  var pId = esc(p._id);
  var html = '<div class="ch-post" id="post-' + pId + '">';
  html += mkAvatar(authorName, authorEmail, 'av-sm', 'style="cursor:pointer;flex-shrink:0;margin-top:1px" onclick="viewStudentProfile(\'' + esc(String(authorId)) + '\')"');
  html += '<div class="ch-post-body">';
  html += '<div class="ch-post-hd">';
  html += '<span class="ch-post-name" onclick="viewStudentProfile(\'' + esc(String(authorId)) + '\')">' + esc(authorName) + '</span>';
  if (uni) html += '<span class="ch-post-time">' + esc(uni) + '</span>';
  html += '<span class="ch-post-time">' + timeAgo(p.createdAt) + '</span>';
  if (canDelete) {
    html += '<div class="ch-post-menu">';
    html += '<button class="ch-post-menu-btn" onclick="togglePostMenu(event,\''+pId+'\')" title="More options">'+_ico('dots',15,2)+'</button>';
    html += '<div class="ch-post-dd" id="pmenu-'+pId+'">';
    html += '<button class="ch-post-dd-row danger" onclick="deletePost(\''+chId+'\',\''+pId+'\')">'+_ico('trash',14,2)+' Delete message</button>';
    html += '</div></div>';
  }
  html += '</div>';
  html += '<div class="ch-post-content">' + esc(p.content) + '</div>';
  if (p.resource) {
    var rId = p.resource._id || p.resource;
    var rTitle = p.resource.title || 'Resource';
    html += '<div class="ch-post-res" onclick="viewResDetail(\''+esc(String(rId))+'\')">'+_ico('clip',13,2)+' '+esc(rTitle)+'</div>';
  }
  html += '<div class="ch-post-footer">';
  html += '<button class="ch-post-like'+(isLiked?' liked':'')+'" onclick="togglePostLike(\''+chId+'\',\''+pId+'\',this)">'+_ico('heart',13,2.5,isLiked)+' '+(p.likesCount||0)+'</button>';
  html += '</div></div></div>';
  return html;
}

function postKeydown(e, chId) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendPost(chId); }
}

function sendPost(chId) {
  var input = document.getElementById('post-input');
  if (!input) return;
  var content = input.value.trim();
  if (!content) { toast('Write something first', 'error'); return; }
  input.value = '';
  var body = { content: content };
  if (attachedResource) body.resourceId = attachedResource._id;
  api('POST', '/channels/' + chId + '/posts', body).then(function(d) {
    attachedResource = null;
    selectChannel(chId);
  }).catch(function(err) {
    input.value = content;
    toast(err.message, 'error');
  });
}

function toggleJoinChannel(id, isMember) {
  var action = isMember ? 'leave' : 'join';
  api('POST', '/channels/' + id + '/' + action).then(function() {
    toast(isMember ? 'Left channel' : 'Joined channel!', 'success');
    selectChannel(id);
  }).catch(function(err) { toast(err.message, 'error'); });
}

function deleteChannel(e, id) {
  if (e) e.stopPropagation();
  if (!confirm('Delete this channel? All posts will be permanently removed.')) return;
  api('DELETE', '/channels/' + id).then(function() {
    toast('Channel deleted', 'success');
    channelState.activeChannelId = null;
    channelState.creatorId = null;
    var content = document.getElementById('ch-content');
    if (content) content.innerHTML = '<div class="ch-empty"><div class="ch-empty-ico">'+_ico('chat',44,1.2)+'</div><div class="ch-empty-title">Select a channel</div><div class="ch-empty-desc">Choose a channel from the list to get started</div></div>';
    loadChannels();
  }).catch(function(err) { toast(err.message, 'error'); });
}

function togglePostMenu(e, postId) {
  e.stopPropagation();
  var menu = document.getElementById('pmenu-' + postId);
  if (!menu) return;
  var isOpen = menu.classList.contains('open');
  document.querySelectorAll('.ch-post-dd.open').forEach(function(m) { m.classList.remove('open'); });
  if (!isOpen) menu.classList.add('open');
}

function deletePost(chId, postId) {
  document.querySelectorAll('.ch-post-dd.open').forEach(function(m) { m.classList.remove('open'); });
  if (!confirm('Delete this message?')) return;
  api('DELETE', '/channels/' + chId + '/posts/' + postId).then(function() {
    var el = document.getElementById('post-' + postId);
    if (el) el.remove();
    toast('Message deleted', 'success');
  }).catch(function(err) { toast(err.message, 'error'); });
}

document.addEventListener('click', function() {
  document.querySelectorAll('.ch-post-dd.open').forEach(function(m) { m.classList.remove('open'); });
});

function togglePostLike(chId, postId, btn) {
  api('POST', '/channels/' + chId + '/posts/' + postId + '/like').then(function(d) {
    btn.classList.toggle('liked', d.liked);
    btn.innerHTML = _ico('heart',13,2.5)+' '+d.likesCount;
    popIcon(btn);
  }).catch(function(err) { toast(err.message, 'error'); });
}

function openCreateChannel() {
  document.getElementById('ch-err').classList.remove('show');
  document.getElementById('ch-name').value = '';
  document.getElementById('ch-desc').value = '';
  document.getElementById('ch-subject').value = '';
  selectedIcon = '📚';
  document.querySelectorAll('#icon-select .icon-opt').forEach(function(el){ el.classList.remove('selected'); });
  var first = document.querySelector('#icon-select .icon-opt');
  if (first) first.classList.add('selected');
  openMod('mod-create-ch');
}
function selectIcon(el) {
  selectedIcon = el.dataset.icon;
  document.querySelectorAll('#icon-select .icon-opt').forEach(function(e){ e.classList.remove('selected'); });
  el.classList.add('selected');
}
function createChannel(e) {
  e.preventDefault();
  var btn = document.getElementById('btn-create-ch');
  var errEl = document.getElementById('ch-err');
  errEl.classList.remove('show');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
  api('POST', '/channels', {
    name: document.getElementById('ch-name').value,
    description: document.getElementById('ch-desc').value,
    subject: document.getElementById('ch-subject').value || 'General',
    icon: selectedIcon
  }).then(function(d) {
    closeMod('mod-create-ch');
    toast('Channel created!', 'success');
    selectChannel(d.channel._id);
  }).catch(function(err) {
    errEl.textContent = err.message; errEl.classList.add('show');
  }).finally(function() {
    btn.disabled = false; btn.textContent = 'Create Channel';
  });
}

function openAttachRes() {
  loadAttachList();
  openMod('mod-attach-res');
}
function loadAttachList() {
  var search = document.getElementById('attach-search').value.trim();
  var listEl = document.getElementById('attach-list');
  listEl.innerHTML = '<div class="spinner"></div>';
  var q = '?userId=' + me._id + '&limit=20' + (search ? '&search=' + encodeURIComponent(search) : '');
  api('GET', '/resources' + q).then(function(d) {
    if (!d.resources || !d.resources.length) {
      listEl.innerHTML = '<div class="empty-state" style="padding:16px"><p>No resources found</p></div>';
      return;
    }
    listEl.innerHTML = d.resources.map(function(r) {
      var ft = FILE_TYPE_MAP[r.fileType] || FILE_TYPE_MAP.other;
      return '<div style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:var(--rs);cursor:pointer;border:1px solid var(--border);margin-bottom:6px" onclick="attachRes(\'' + esc(r._id) + '\',\'' + esc(r.title) + '\')">' +
        '<span style="font-size:1.4rem">' + ft.ico + '</span>' +
        '<div><div style="font-size:.875rem;font-weight:600;color:var(--text)">' + esc(r.title) + '</div>' +
        '<div style="font-size:.75rem;color:var(--text4)">' + esc(r.subject) + ' · ' + fmtSize(r.fileSize) + '</div></div>' +
      '</div>';
    }).join('');
  }).catch(function() { listEl.innerHTML = '<p class="text3 text-sm">Error loading</p>'; });
}
function attachRes(id, title) {
  attachedResource = { _id: id, title: title };
  closeMod('mod-attach-res');
  toast('Resource attached: ' + title, 'info');
  if (channelState.activeChannelId) selectChannel(channelState.activeChannelId);
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
var profileTab = 'resources';
var profileUserId = null;

function loadProfile(userId) {
  profileUserId = userId || (me && me._id) || null;
  if (!profileUserId) return;
  var content = document.getElementById('profile-content');
  content.innerHTML = '<div class="empty-state" style="padding:40px 0"><div class="spinner" style="margin:0 auto 12px"></div><p class="shimmer-text">Loading profile...</p></div>';
  var isOwn = !userId || userId === me._id;
  var endpoint = isOwn ? '/users/me/profile' : '/users/' + userId;
  api('GET', endpoint).then(function(d) {
    var u = d.user;
    if (isOwn) {
      me = Object.assign({}, me, { followers: u.followers, following: u.following, savedResources: u.savedResources });
      localStorage.setItem('sl_user', JSON.stringify(me));
    }
    renderProfile(u, isOwn);
    var autoTab = window._profileAutoTab;
    window._profileAutoTab = null;
    profileTab = autoTab || 'resources';
    showProfileTab(profileTab, u, isOwn);
  }).catch(function(err) {
    content.innerHTML = '<div class="empty-state"><div class="empty-state-ico">'+_ico('warn',44,1.2)+'</div><h3>Error loading profile</h3><p>' + esc(err.message) + '</p></div>';
  });
}

function mkIgPost(r) {
  var ft = FILE_TYPE_MAP[r.fileType] || FILE_TYPE_MAP.other;
  var html = '<div class="ig-post" onclick="viewResDetail(\'' + esc(r._id) + '\')" title="' + esc(r.title) + '">';
  html += '<div class="ig-post-bg" style="background:' + ft.color + '1a">';
  html += '<span class="ig-post-type" style="color:' + ft.color + '">' + ft.label + '</span>';
  html += '</div>';
  html += '<div class="ig-post-title">' + esc(r.title) + '</div>';
  html += '<div class="ig-post-hover">';
  html += '<div class="ig-post-stat">' + _ico('heart',15,2.5) + ' ' + (r.likesCount || 0) + '</div>';
  html += '<div class="ig-post-stat">' + _ico('download',15,2.5) + ' ' + (r.downloads || 0) + '</div>';
  html += '</div></div>';
  return html;
}

function renderProfile(u, isOwn) {
  var ini = initials(u.name);
  var followerCount = u.followerCount !== undefined ? u.followerCount : (u.followers ? u.followers.length : 0);
  var followingCount = u.followingCount !== undefined ? u.followingCount : (u.following ? u.following.length : 0);
  var uploadCount = u.uploadCount || (u.resources ? u.resources.length : 0);
  var isFollowing = me && u.followers && u.followers.some(function(id){ return (id._id||id) === me._id; });
  var html = '<div class="ig-profile">';

  // ── Header ────────────────────────────────────────────────────────────────
  html += '<div class="ig-header">';
  var profileGUrl = gravatarUrl(u.email, 150);
  html += '<div style="position:relative;flex-shrink:0">';
  if (profileGUrl) {
    html += '<div class="ig-av-ring"><div class="ig-av"><img src="' + esc(profileGUrl) + '" alt="" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'\'"><span style="display:none">' + esc(ini) + '</span></div></div>';
  } else {
    html += '<div class="ig-av-ring"><div class="ig-av">' + esc(ini) + '</div></div>';
  }
  if (u.verified) html += '<div class="verified-badge" title="Verified">✓</div>';
  html += '</div>';
  html += '<div class="ig-info">';

  // Username + action button below
  html += '<div class="ig-name-block">';
  html += '<h2 class="ig-username">' + esc(u.name) + '</h2>';
  if (isOwn) {
    html += '<button class="ig-edit-btn" onclick="toggleEditProfile(this)">Edit profile</button>';
  } else if (me) {
    html += '<button class="ig-follow-btn ' + (isFollowing ? 'following' : '') + '" onclick="toggleFollow(\'' + esc(u._id) + '\',this)">' + (isFollowing ? 'Following' : 'Follow') + '</button>';
  }
  html += '</div>';

  // Stats row
  html += '<div class="ig-stats-row">';
  html += '<div class="ig-stat-item"><span class="ig-stat-num" data-count="' + uploadCount + '">0</span><span class="ig-stat-lbl">resources</span></div>';
  html += '<div class="ig-stat-item"><span class="ig-stat-num" data-count="' + followerCount + '">0</span><span class="ig-stat-lbl">followers</span></div>';
  html += '<div class="ig-stat-item"><span class="ig-stat-num" data-count="' + followingCount + '">0</span><span class="ig-stat-lbl">following</span></div>';
  html += '</div>';

  // Bio section
  html += '<div class="ig-bio-wrap">';
  if (u.subject || u.year) {
    html += '<div class="ig-real-name">' + (u.subject ? esc(u.subject) : '') + (u.subject && u.year ? ' · ' : '') + (u.year ? esc(u.year) : '') + '</div>';
  }
  if (u.bio) html += '<div class="ig-bio-text">' + esc(u.bio) + '</div>';
  if (u.university) html += '<div class="ig-uni-line">🏛 ' + esc(u.university) + '</div>';
  html += '</div>';

  html += '</div></div>'; // close ig-info + ig-header

  // ── Tabs ──────────────────────────────────────────────────────────────────
  html += '<div class="ig-tabs-bar">';
  html += '<button class="ptab active" id="ptab-resources" onclick="showProfileTab(\'resources\',null,' + isOwn + ')">';
  html += '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> Resources</button>';
  if (isOwn) {
    html += '<button class="ptab" id="ptab-saved" onclick="showProfileTab(\'saved\',null,true)">';
    html += '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Saved</button>';
  }
  html += '</div>';

  html += '<div id="profile-tab-content"></div>';
  html += '</div>'; // close ig-profile
  document.getElementById('profile-content').innerHTML = html;
  document.querySelectorAll('.ig-stat-num[data-count]').forEach(function(el) {
    animateCountUp(el, parseInt(el.getAttribute('data-count')) || 0);
  });
  initTabIndicator('.ig-tabs-bar');
  window._profileUser = u;
  window._profileIsOwn = isOwn;
}

function toggleEditProfile(btn) {
  if (profileTab === 'settings') {
    showProfileTab('resources', null, true);
    btn.textContent = 'Edit profile';
  } else {
    showProfileTab('settings', null, true);
    btn.textContent = 'Close editing';
  }
}

function showProfileTab(tab, u, isOwn) {
  profileTab = tab;
  u = u || window._profileUser;
  isOwn = isOwn !== undefined ? isOwn : window._profileIsOwn;
  document.querySelectorAll('.ptab').forEach(function(el){ el.classList.remove('active'); });
  var tabEl = document.getElementById('ptab-' + tab);
  if (tabEl) tabEl.classList.add('active');
  var el = document.getElementById('profile-tab-content');
  if (tab === 'resources') {
    var resources = u.resources || [];
    if (!resources.length) {
      el.innerHTML = '<div class="empty-state"><div class="empty-state-ico">'+_ico('file',44,1.2)+'</div><h3>No uploads yet</h3>' + (isOwn ? '<p>Go to Upload to share your first resource!</p><button class="btn btn-primary btn-sm mt12" onclick="nav(\'upload\')">Upload Now</button>' : '<p>This student hasn\'t uploaded anything yet</p>') + '</div>';
    } else {
      el.innerHTML = '<div class="ig-grid">' + resources.map(function(r){ return mkIgPost(r); }).join('') + '</div>';
      staggerChildren(el.querySelector('.ig-grid'));
    }
  } else if (tab === 'saved') {
    var saved = u.savedResources || [];
    if (!saved.length) {
      el.innerHTML = '<div class="empty-state"><div class="empty-state-ico">' + _ico('bookmark',44,1.2) + '</div><h3>No saved resources</h3><p>Browse resources and save them to access later.</p></div>';
    } else {
      el.innerHTML = '<div class="ig-grid">' + saved.map(function(r){ return mkIgPost(r); }).join('') + '</div>';
      staggerChildren(el.querySelector('.ig-grid'));
    }
  } else if (tab === 'settings') {
    renderSettings(u);
  }
}

function renderSettings(u) {
  var el = document.getElementById('profile-tab-content');
  var YEAR_OPTS = ['','1st Year','2nd Year','3rd Year','4th Year','5th Year','Masters','PhD','Graduate'];
  var yearOptions = YEAR_OPTS.map(function(y){ return '<option value="' + esc(y) + '"' + (u.year === y ? ' selected' : '') + '>' + (y || '— Select Year —') + '</option>'; }).join('');
  el.innerHTML = '<div class="settings-wrap">' +
    '<div class="settings-card"><h3>Profile Information</h3>' +
    '<form onsubmit="saveProfile(event)">' +
    '<div class="form-group"><label>Name</label><input type="text" id="set-name" value="' + esc(u.name) + '" maxlength="80"/></div>' +
    '<div class="form-row">' +
    '<div class="form-group"><label>University</label><input type="text" id="set-uni" value="' + esc(u.university || '') + '" maxlength="100"/></div>' +
    '<div class="form-group"><label>Year</label><select id="set-year">' + yearOptions + '</select></div>' +
    '</div>' +
    '<div class="form-group"><label>Subject / Field</label><input type="text" id="set-subject" value="' + esc(u.subject || '') + '"/></div>' +
    '<div class="form-group"><label>Bio</label><textarea id="set-bio" maxlength="300">' + esc(u.bio || '') + '</textarea></div>' +
    '<button type="submit" class="btn btn-primary" id="btn-save-profile">Save Changes</button>' +
    '</form></div>' +
    '<div class="settings-card"><h3>Change Password</h3>' +
    '<div class="auth-err" id="pw-err"></div>' +
    '<form onsubmit="changePassword(event)">' +
    '<div class="form-group"><label>Current Password</label><input type="password" id="set-cur-pw" placeholder="••••••••"/></div>' +
    '<div class="form-group"><label>New Password</label><input type="password" id="set-new-pw" placeholder="Min 6 characters"/></div>' +
    '<button type="submit" class="btn btn-primary" id="btn-change-pw">Update Password</button>' +
    '</form></div>' +
    '</div>';
}

function saveProfile(e) {
  e.preventDefault();
  var btn = document.getElementById('btn-save-profile');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
  api('PUT', '/users/me/profile', {
    name: document.getElementById('set-name').value,
    bio: document.getElementById('set-bio').value,
    university: document.getElementById('set-uni').value,
    year: document.getElementById('set-year').value,
    subject: document.getElementById('set-subject').value
  }).then(function(d) {
    me = Object.assign({}, me, d.user);
    localStorage.setItem('sl_user', JSON.stringify(me));
    updUI();
    toast('Profile updated!', 'success');
    loadProfile(null);
  }).catch(function(err) { toast(err.message, 'error'); })
  .finally(function() { btn.disabled = false; btn.textContent = 'Save Changes'; });
}

function changePassword(e) {
  e.preventDefault();
  var btn = document.getElementById('btn-change-pw');
  var errEl = document.getElementById('pw-err');
  errEl.classList.remove('show');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
  api('PUT', '/users/me/password', {
    currentPassword: document.getElementById('set-cur-pw').value,
    newPassword: document.getElementById('set-new-pw').value
  }).then(function() {
    toast('Password updated!', 'success');
    document.getElementById('set-cur-pw').value = '';
    document.getElementById('set-new-pw').value = '';
  }).catch(function(err) {
    errEl.textContent = err.message; errEl.classList.add('show');
  }).finally(function() { btn.disabled = false; btn.textContent = 'Update Password'; });
}

// ─── RESOURCE ACTIONS ─────────────────────────────────────────────────────────
function downloadResource(resourceId, fileName) {
  if (!token) { toast('Sign in to download files', 'error'); return; }
  toast('Preparing download…', 'info');
  fetch(API_BASE + '/api/resources/' + resourceId + '/download', {
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(function(r) {
    if (!r.ok) return r.json().then(function(d){ throw new Error(d.error || 'Download failed (' + r.status + ')'); });
    return r.json();
  }).then(function(d) {
    var a = document.createElement('a');
    a.href = d.url;
    a.download = d.fileName || fileName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast('Download started!', 'success');
  }).catch(function(err) { toast(err.message || 'Download failed', 'error'); });
}

function previewResource(resourceId) {
  openMod('mod-preview');
  document.getElementById('prev-modal-title').textContent = 'Loading…';
  document.getElementById('prev-modal-viewer').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%"><div class="spinner"></div></div>';
  document.getElementById('prev-modal-dl-btn').onclick = null;

  api('GET', '/resources/' + resourceId).then(function(d) {
    var r = d.resource;
    document.getElementById('prev-modal-title').textContent = r.title;
    document.getElementById('prev-modal-dl-btn').onclick = function() { downloadResource(r._id, r.fileName); };

    var fileUrl = r.fileUrl.startsWith('http') ? r.fileUrl : API_BASE + r.fileUrl;
    var viewer = document.getElementById('prev-modal-viewer');

    if (r.fileType === 'pdf') {
      viewer.innerHTML = '<iframe src="' + fileUrl + '" style="width:100%;height:100%;border:none"></iframe>';
    } else if (r.fileType === 'img') {
      viewer.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;padding:16px;background:var(--bg);box-sizing:border-box">'
        + '<img src="' + fileUrl + '" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:8px" '
        + 'onerror="this.parentNode.innerHTML=\'<p style=color:var(--text3);text-align:center>Image could not be loaded</p>\'">'
        + '</div>';
    } else if (r.fileType === 'txt' || r.fileType === 'md' || r.fileType === 'csv') {
      viewer.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%"><div class="spinner"></div></div>';
      fetch(fileUrl).then(function(res) { return res.text(); }).then(function(text) {
        viewer.innerHTML = '<pre style="width:100%;height:100%;overflow:auto;padding:20px 24px;background:var(--bg);color:var(--text);font-size:.85rem;line-height:1.65;margin:0;white-space:pre-wrap;word-break:break-word;box-sizing:border-box">' + esc(text) + '</pre>';
      }).catch(function() {
        viewer.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3)">Could not load preview — download the file to view it.</div>';
      });
    } else if (r.fileType === 'doc' || r.fileType === 'ppt' || r.fileType === 'xls') {
      var gdUrl = 'https://docs.google.com/viewer?url=' + encodeURIComponent(fileUrl) + '&embedded=true';
      viewer.innerHTML = '<iframe src="' + gdUrl + '" style="width:100%;height:100%;border:none"></iframe>'
        + '<p style="position:absolute;bottom:12px;left:0;right:0;text-align:center;font-size:.75rem;color:var(--text3);pointer-events:none">Powered by Google Docs Viewer</p>';
      viewer.style.position = 'relative';
    } else {
      viewer.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:14px;color:var(--text3);padding:24px;text-align:center">'
        + _ico('file', 48, 1.4)
        + '<p style="font-size:.9rem;margin:0">Preview not available for <strong>.' + esc(r.fileName.split('.').pop()) + '</strong> files.<br>Download the file to open it.</p>'
        + '<button class="btn btn-primary btn-sm" onclick="downloadResource(\'' + esc(r._id) + '\',\'' + esc(r.fileName) + '\')">' + _ico('download',13,2.5) + ' Download</button>'
        + '</div>';
    }
  }).catch(function(err) {
    document.getElementById('prev-modal-viewer').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3)">' + esc(err.message) + '</div>';
  });
}

function toggleLike(id, btn) {
  api('POST', '/resources/' + id + '/like').then(function(d) {
    btn.className = 'btn btn-sm ' + (d.liked ? 'btn-danger' : 'btn-ghost');
    btn.innerHTML = _ico('heart',13,2.5,d.liked)+' '+d.likesCount;
    popIcon(btn);
  }).catch(function(err) { toast(err.message, 'error'); });
}

function toggleSave(id, btn) {
  api('POST', '/users/me/save/' + id).then(function(d) {
    btn.className = 'btn btn-sm ' + (d.saved ? 'btn-green' : 'btn-ghost');
    popIcon(btn);
    toast(d.saved ? 'Resource saved!' : 'Removed from saved', 'info');
    if (me) {
      me.savedResources = me.savedResources || [];
      var existsIdx = me.savedResources.findIndex(function(x){ return x === id || (x && (x._id || x) === id); });
      if (d.saved && existsIdx === -1) {
        me.savedResources.push(id);
      } else if (!d.saved && existsIdx !== -1) {
        me.savedResources.splice(existsIdx, 1);
      }
      localStorage.setItem('sl_user', JSON.stringify(me));
    }
  }).catch(function(err) { toast(err.message, 'error'); });
}

function toggleFollow(uid, btn) {
  api('POST', '/users/' + uid + '/follow').then(function(d) {
    btn.className = 'btn btn-sm ' + (d.following ? 'btn-ghost' : 'btn-primary');
    btn.textContent = d.following ? 'Unfollow' : 'Follow';
    toast(d.following ? 'Now following!' : 'Unfollowed', 'info');
  }).catch(function(err) { toast(err.message, 'error'); });
}

// ─── RESOURCE DETAIL MODAL ────────────────────────────────────────────────────
function viewResDetail(id) {
  openMod('mod-res-detail');
  document.getElementById('mod-res-body').innerHTML = '<div style="text-align:center;padding:32px"><div class="spinner"></div></div>';
  api('GET', '/resources/' + id).then(function(d) {
    var r = d.resource;
    var ft = FILE_TYPE_MAP[r.fileType] || FILE_TYPE_MAP.other;
    var isLiked = me && r.likes && r.likes.some(function(id){ return (id._id||id) === me._id; });
    var isSaved = me && me.savedResources && me.savedResources.some(function(sid){ return sid === r._id || (sid && (sid._id || sid) === r._id); });
    var isOwner = me && r.user && (r.user._id || r.user) === me._id;
    var likesCount = r.likesCount !== undefined ? r.likesCount : (r.likes ? r.likes.length : 0);
    var authorName = r.user ? r.user.name : 'Unknown';
    var authorEmail = r.user ? (r.user.email || '') : '';
    var authorId = r.user ? (r.user._id || r.user) : null;
    var html = '';
    html += '<div style="text-align:center;margin-bottom:20px">';
    html += '<div style="display:inline-flex;width:80px;height:80px;border-radius:16px;background:' + ft.color + '22;align-items:center;justify-content:center;font-size:2.5rem;border:1px solid ' + ft.color + '33;margin-bottom:12px">' + ft.ico + '</div>';
    html += '<div><span class="badge badge-primary">' + esc(r.subject) + '</span></div>';
    html += '</div>';
    html += '<h2 style="font-size:1.15rem;font-weight:700;color:var(--text);margin-bottom:8px">' + esc(r.title) + '</h2>';
    if (r.description) html += '<p style="color:var(--text3);font-size:.875rem;line-height:1.6;margin-bottom:16px">' + esc(r.description) + '</p>';
    html += '<div class="divider"></div>';
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;cursor:pointer" onclick="closeMod(\'mod-res-detail\');viewStudentProfile(\'' + esc(String(authorId)) + '\')">';
    html += mkAvatar(authorName, authorEmail, 'av-md');
    html += '<div><div style="font-size:.875rem;font-weight:600;color:var(--text)">' + esc(authorName) + '</div>';
    if (r.user && r.user.university) html += '<div style="font-size:.75rem;color:var(--text3)">' + esc(r.user.university) + '</div>';
    html += '</div></div>';
    if (r.tags && r.tags.length) {
      html += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">';
      r.tags.forEach(function(t){ html += '<span class="badge badge-primary">' + esc(t) + '</span>'; });
      html += '</div>';
    }
    html += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px">';
    html += '<div style="background:var(--card);border:1px solid var(--border);border-radius:var(--rs);padding:10px 12px"><div style="font-size:.7rem;color:var(--text4);margin-bottom:2px">Downloads</div><div style="font-size:1rem;font-weight:700;color:var(--text);display:flex;align-items:center;gap:6px">'+_ico('download',15,2.5)+' '+(r.downloads||0)+'</div></div>';
    html += '<div style="background:var(--card);border:1px solid var(--border);border-radius:var(--rs);padding:10px 12px"><div style="font-size:.7rem;color:var(--text4);margin-bottom:2px">Likes</div><div style="font-size:1rem;font-weight:700;color:var(--text);display:flex;align-items:center;gap:6px">'+_ico('heart',15,2.5)+' '+likesCount+'</div></div>';
    html += '<div style="background:var(--card);border:1px solid var(--border);border-radius:var(--rs);padding:10px 12px"><div style="font-size:.7rem;color:var(--text4);margin-bottom:2px">File Size</div><div style="font-size:1rem;font-weight:700;color:var(--text)">' + esc(fmtSize(r.fileSize)) + '</div></div>';
    html += '<div style="background:var(--card);border:1px solid var(--border);border-radius:var(--rs);padding:10px 12px"><div style="font-size:.7rem;color:var(--text4);margin-bottom:2px">Uploaded</div><div style="font-size:.9rem;font-weight:700;color:var(--text)">' + new Date(r.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) + '</div></div>';
    html += '</div>';
    html += '<div style="display:flex;gap:8px;flex-wrap:wrap">';
    html += '<button class="btn btn-ghost" onclick="closeMod(\'mod-res-detail\');previewResource(\''+esc(r._id)+'\')">'+_ico('eye',15,2.5)+' Preview</button>';
    if (r.accessMode !== 'view-only' || isOwner) {
      html += '<button class="btn btn-primary" onclick="downloadResource(\''+esc(r._id)+'\',\''+esc(r.fileName)+'\')">'+_ico('download',15,2.5)+' Download</button>';
    } else {
      html += '<span class="badge badge-amber" style="padding:8px 14px;font-size:.78rem">View Only</span>';
    }
    html += '<button class="btn btn-sm '+(isLiked?'btn-danger':'btn-ghost')+'" onclick="toggleLike(\''+esc(r._id)+'\',this)" id="modal-like-btn">'+_ico('heart',14,2.5,isLiked)+' '+(isLiked?'Liked':'Like')+'</button>';
    html += '<button class="btn btn-sm '+(isSaved?'btn-green':'btn-ghost')+'" onclick="toggleSave(\''+esc(r._id)+'\',this)">'+_ico('bookmark',14,2.5,isSaved)+' '+(isSaved?'Saved':'Save')+'</button>';
    if (isOwner) html += '<button class="btn btn-sm btn-ghost" onclick="openEditResource(\''+esc(r._id)+'\')">'+_ico('edit',14,2.5)+' Edit</button>';
    if (isOwner) html += '<button class="btn btn-sm btn-danger" onclick="deleteResource(\''+esc(r._id)+'\')">'+_ico('trash',14,2.5)+' Delete</button>';
    html += '</div>';
    document.getElementById('mod-res-body').innerHTML = html;
  }).catch(function(err) {
    document.getElementById('mod-res-body').innerHTML = '<div class="empty-state"><div class="empty-state-ico">'+_ico('warn',44,1.2)+'</div><h3>Error loading resource</h3><p>' + esc(err.message) + '</p></div>';
  });
}

function deleteResource(id) {
  if (!confirm('Delete this resource? This cannot be undone.')) return;
  api('DELETE', '/resources/' + id).then(function() {
    closeMod('mod-res-detail');
    toast('Resource deleted', 'success');
    loadProfile(null);
  }).catch(function(err) { toast(err.message, 'error'); });
}

// ─── STUDENT PROFILE MODAL ───────────────────────────────────────────────────
function viewStudentProfile(uid) {
  if (!uid || uid === 'null' || uid === 'undefined') return;
  if (me && uid === me._id) { closeMod('mod-res-detail'); closeMod('mod-student'); nav('profile'); return; }
  openMod('mod-student');
  document.getElementById('mod-student-body').innerHTML = '<div style="text-align:center;padding:32px"><div class="spinner"></div></div>';
  api('GET', '/users/' + uid).then(function(d) {
    var u = d.user;
    var followerCount = u.followerCount !== undefined ? u.followerCount : (u.followers ? u.followers.length : 0);
    var followingCount = u.followingCount !== undefined ? u.followingCount : (u.following ? u.following.length : 0);
    var isFollowing = me && u.followers && u.followers.some(function(id){ return (id._id||id) === me._id; });
    var html = '<div style="text-align:center;margin-bottom:20px">';
    html += mkAvatar(u.name, u.email, 'av-xl', 'style="margin:0 auto 12px"');
    html += '<div style="font-size:1.15rem;font-weight:700;color:var(--text)">' + esc(u.name) + '</div>';
    if (u.university || u.year) html += '<div style="font-size:.82rem;color:var(--text3);margin-top:4px">' + [u.university, u.year].filter(Boolean).map(esc).join(' · ') + '</div>';
    html += '</div>';
    if (u.bio) html += '<p style="color:var(--text3);font-size:.875rem;text-align:center;margin-bottom:16px;line-height:1.5">' + esc(u.bio) + '</p>';
    html += '<div style="display:flex;justify-content:center;gap:24px;margin-bottom:20px">';
    html += '<div style="text-align:center"><div style="font-size:1.2rem;font-weight:700;color:var(--text)">' + (u.resources ? u.resources.length : 0) + '</div><div style="font-size:.72rem;color:var(--text3)">Uploads</div></div>';
    html += '<div style="text-align:center"><div style="font-size:1.2rem;font-weight:700;color:var(--text)">' + followerCount + '</div><div style="font-size:.72rem;color:var(--text3)">Followers</div></div>';
    html += '<div style="text-align:center"><div style="font-size:1.2rem;font-weight:700;color:var(--text)">' + followingCount + '</div><div style="font-size:.72rem;color:var(--text3)">Following</div></div>';
    html += '</div>';
    if (me) html += '<div style="text-align:center;margin-bottom:20px"><button class="btn ' + (isFollowing ? 'btn-ghost' : 'btn-primary') + ' btn-sm" onclick="toggleFollow(\'' + esc(u._id) + '\',this)">' + (isFollowing ? 'Unfollow' : 'Follow') + '</button></div>';
    if (u.resources && u.resources.length) {
      html += '<div class="divider"></div><h3 style="font-size:.9rem;font-weight:700;color:var(--text);margin-bottom:12px">Recent Resources</h3>';
      html += '<div class="resource-grid">' + u.resources.slice(0,4).map(function(r){ return mkResCard(r); }).join('') + '</div>';
    }
    document.getElementById('mod-student-body').innerHTML = html;
  }).catch(function(err) {
    document.getElementById('mod-student-body').innerHTML = '<div class="empty-state"><div class="empty-state-ico">'+_ico('warn',44,1.2)+'</div><h3>Error loading profile</h3></div>';
  });
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function openMod(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMod(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}
function closeModBg(e, id) {
  if (e.target === document.getElementById(id)) closeMod(id);
}
// ESC key closes modals
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(function(m){ m.classList.remove('open'); });
    document.body.style.overflow = '';
  }
});

// ─── PAGINATION ───────────────────────────────────────────────────────────────
function renderPagination(containerId, page, pages, callbackName) {
  var el = document.getElementById(containerId);
  if (pages <= 1) { el.innerHTML = ''; return; }
  var html = '<div class="pagination">';
  html += '<button class="page-btn" ' + (page <= 1 ? 'disabled' : '') + ' onclick="' + callbackName + '(' + (page-1) + ')">‹ Prev</button>';
  var start = Math.max(1, page-2);
  var end = Math.min(pages, start+4);
  if (start > 1) html += '<button class="page-btn" onclick="' + callbackName + '(1)">1</button>';
  if (start > 2) html += '<span style="color:var(--text4);padding:0 4px">…</span>';
  for (var i = start; i <= end; i++) {
    html += '<button class="page-btn' + (i === page ? ' active' : '') + '" onclick="' + callbackName + '(' + i + ')">' + i + '</button>';
  }
  if (end < pages-1) html += '<span style="color:var(--text4);padding:0 4px">…</span>';
  if (end < pages) html += '<button class="page-btn" onclick="' + callbackName + '(' + pages + ')">' + pages + '</button>';
  html += '<button class="page-btn" ' + (page >= pages ? 'disabled' : '') + ' onclick="' + callbackName + '(' + (page+1) + ')">Next ›</button>';
  html += '</div>';
  el.innerHTML = html;
}

// ─── STUDENTS ─────────────────────────────────────────────────────────────────
function stuSearchDebounce() {
  clearTimeout(stuSearchTimer);
  stuSearchTimer = setTimeout(function() { loadStudents(1); }, 350);
}

function loadStudents(page) {
  if (!me) { toast('Sign in to browse students', 'error'); return; }
  var search = (document.getElementById('stu-search').value || '').trim();
  var q = '?page=' + (page || 1) + '&limit=12';
  if (search) q += '&search=' + encodeURIComponent(search);
  q += getScopeParams();

  // Scope toggle
  var scopeEl = document.getElementById('stu-scope-toggle');
  if (!scopeEl) {
    var filterBar = document.querySelector('#panel-students .filter-bar');
    if (filterBar) filterBar.insertAdjacentHTML('beforebegin', '<div id="stu-scope-toggle">' + mkScopeToggle() + '</div>');
  } else {
    scopeEl.innerHTML = mkScopeToggle();
  }

  var grid = document.getElementById('stu-grid');
  grid.innerHTML = '<div class="empty-state"><span class="spinner"></span></div>';
  api('GET', '/users' + q).then(function(d) {
    if (!d.users || d.users.length === 0) {
      grid.innerHTML = '<div class="empty-state"><div class="empty-state-ico">'+_ico('users',44,1.2)+'</div><h3>No students found</h3><p>Try a different search term</p></div>';
      document.getElementById('stu-pagination').innerHTML = '';
      return;
    }
    grid.innerHTML = d.users.map(mkStudentCard).join('');
    staggerChildren(grid);
    renderPagination('stu-pagination', d.page, d.pages, 'loadStudents');
  }).catch(function() {
    grid.innerHTML = '<div class="empty-state"><div class="empty-state-ico">'+_ico('warn',44,1.2)+'</div><h3>Could not load students</h3></div>';
  });
}

function mkStudentCard(u) {
  var isMe = me && me._id === u._id;
  var isFollowing = me && me.following && me.following.some(function(fid){
    var fStr = (fid && fid._id) ? fid._id : String(fid);
    return fStr === u._id;
  });
  var html = '<div class="stu-card">';
  html += '<div class="stu-card-av">' + mkAvatar(u.name, u.email, 'av-lg') + '</div>';
  html += '<div class="stu-card-name">' + esc(u.name) + '</div>';
  if (u.university) html += '<div class="stu-card-uni">' + esc(u.university) + '</div>';
  if (u.subject) html += '<div class="stu-card-sub">' + esc(u.subject) + '</div>';
  else html += '<div style="margin-bottom:12px"></div>';
  html += '<div class="stu-card-stats">' + (u.followerCount || 0) + ' followers</div>';
  html += '<div class="stu-card-actions">';
  if (!isMe) {
    html += '<button class="btn ' + (isFollowing ? 'btn-ghost' : 'btn-primary') + ' btn-sm" onclick="followFromDiscover(\'' + esc(u._id) + '\',this)">' + (isFollowing ? 'Following' : '+ Follow') + '</button>';
  }
  html += '<button class="btn btn-ghost btn-sm" onclick="viewStudentProfile(\'' + esc(u._id) + '\')">Profile</button>';
  html += '</div></div>';
  return html;
}

function followFromDiscover(userId, btn) {
  if (!me) { toast('Sign in to follow students', 'error'); return; }
  api('POST', '/users/' + userId + '/follow').then(function(d) {
    if (d.following) {
      btn.className = 'btn btn-ghost btn-sm';
      btn.textContent = 'Following';
      if (!me.following) me.following = [];
      if (me.following.indexOf(userId) === -1) me.following.push(userId);
    } else {
      btn.className = 'btn btn-primary btn-sm';
      btn.textContent = '+ Follow';
      me.following = (me.following || []).filter(function(id){
        var s = (id && id._id) ? id._id : String(id);
        return s !== userId;
      });
    }
    saveAuth(me, token);
  }).catch(function(err) { toast(err.message, 'error'); });
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
(function init() {
  loadAuth();

  // Backward compat: convert old ?verify= / ?reset= query params to hash routes
  var params = new URLSearchParams(window.location.search);
  var verifyToken = params.get('verify');
  var resetToken = params.get('reset');
  if (verifyToken) {
    window.history.replaceState({}, '', window.location.pathname + '#verify?token=' + encodeURIComponent(verifyToken));
  }
  if (resetToken) {
    window.history.replaceState({}, '', window.location.pathname + '#reset?token=' + encodeURIComponent(resetToken));
  }

  if (!me || !token) {
    showAuthOverlay();
    openAuth('signin');
    handleHashRoute();
  } else {
    hideAuthOverlay();
    updUI();
    initSubjectChips();
    var parsed = parseHash();
    if (!parsed.route || !ROUTE_PANELS[parsed.route]) {
      nav('home');
    } else {
      handleHashRoute();
    }
  }
})();
