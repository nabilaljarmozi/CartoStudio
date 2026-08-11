/* World Cup 2026 Auction — two-player bidding game.
 * No build step, no server: open index.html and play.
 */
(function () {
  'use strict';

  /* =========================================================
   * 1. Translations
   * ======================================================= */

  var I18N = {
    en: {
      'app.title': 'World Cup 2026 Auction',
      'app.sub': '2 players · $100M each · beat the clock',
      'lang.other': 'العربية',

      's.title': 'Set up the auction',
      's.sub': 'Two managers, one shared game code. The computer puts World Cup 2026 stars up for auction one by one — outbid your rival before the clock runs out and fill every position in your squad.',
      'f.p1': 'Manager 1 name',
      'f.p2': 'Manager 2 name',
      'f.budget': 'Budget each ($M)',
      'f.timer': 'Seconds per lot',
      'f.reset': 'Seconds added by a bid',
      'f.formation': 'Squad shape',
      'f.how': 'How are you playing?',
      'f.join': 'Game code',
      'm.local': 'One screen (hot seat)',
      'm.localD': 'Both managers on the same device. Each has their own bid buttons.',
      'm.host': 'Two windows — create code',
      'm.hostD': 'You are Manager 1. Share the code with a second tab/window on this computer.',
      'm.guest': 'Two windows — join with code',
      'm.guestD': 'You are Manager 2. Enter the code your rival created.',
      'btn.start': 'Start the auction',
      'btn.create': 'Create room & wait',
      'btn.join': 'Join the room',
      'note.code': 'Both windows must be the same browser on this computer.',
      'note.file': 'Opening the file directly can block window-to-window messages in some browsers — serving the folder over http:// is the safe way.',
      'err.code': 'Enter the game code first.',
      'wait.host': 'Waiting for Manager 2 to join with the code…',
      'wait.guest': 'Connecting… make sure Manager 1 has created the room.',

      'r.title': 'Rules',
      'r.1': 'Each manager starts with the same budget — <b>$100M</b> by default.',
      'r.2': 'The computer auctions one player at a time. A lot ends when the clock hits zero; every bid puts time back on the clock.',
      'r.3': 'You can only bid on a player whose position you still have an open slot for — one goalkeeper, two defenders, and so on.',
      'r.4': 'You must keep at least $1M for every slot you still have to fill, so nobody can spend themselves into an incomplete squad.',
      'r.5': 'Pass to drop out of a lot. If nobody can bid, the lot ends immediately.',
      'r.6': 'Final score = total player rating + <b>chemistry</b> (+3 for each extra player from the same country). Ties go to the manager with money left over.',
      'r.7': 'Hot-seat keys — Manager 1: <b>Q W E</b> to bid, <b>R</b> to pass. Manager 2: <b>I O P</b> to bid, <b>[</b> to pass.',

      'g.up': 'Up now',
      'g.base': 'Base {0}',
      'g.nobid': 'No bids yet — opening price {0}',
      'g.high': 'Top bid: {0}',
      'g.lot': 'Lot {0} · {1} players still in the pool',
      'g.sec': 's',
      'g.ovr': 'OVR',
      'g.sold': '✅ SOLD to {0} — {1}',
      'g.unsold': '❌ Unsold — nobody bid',
      'g.paused': 'Paused',
      'btn.pause': '⏸',
      'btn.resume': '▶',
      'g.quitConfirm': 'End this auction and go back to setup?',
      'g.max': 'Max bid now {0}',
      'g.you': 'YOU',
      'g.rival': 'RIVAL',
      'st.leading': '★ You hold the top bid',
      'st.passed': 'Passed on this player',
      'st.noSlot': 'No {0} slot left',
      'st.broke': 'Not enough budget for this bid',
      'st.turn': 'Your move',
      'st.wait': 'Rival window',
      'btn.bidCustom': 'Bid',
      'btn.pass': 'Pass',
      'slots.empty': 'No players signed yet',
      'log.title': 'Auction log',

      'l.start': '🎬 Auction started — {0} per manager, {1} slots to fill',
      'l.join': '👋 {0} joined the room',
      'l.up': '⚽ Up for auction: <b>{0}</b> ({1}) — base {2}',
      'l.bid': '💰 {0} bids <b>{1}</b>',
      'l.pass': '🚪 {0} passes',
      'l.sold': '✅ <b>{0}</b> joins {1} for <b>{2}</b>',
      'l.unsold': '❌ {0} goes unsold',
      'l.end': '🏁 Auction complete',

      'res.win': '{0} wins the auction!',
      'res.draw': 'Dead heat!',
      'res.sub': '{0} to {1} on total squad score',
      'res.subDraw': 'Both squads scored {0}',
      'res.rating': 'Squad rating',
      'res.chem': 'Chemistry bonus',
      'res.spent': 'Spent',
      'res.left': 'Left over',
      'res.total': 'Total score',
      'res.slots': 'Slots filled',
      'btn.again': 'Play again',
      'btn.copy': '📋 Copy result',
      'btn.copied': '✓ Copied',

      'pos.GK': 'Goalkeeper', 'pos.DEF': 'Defender', 'pos.MID': 'Midfielder', 'pos.FWD': 'Forward',
      'posShort.GK': 'GK', 'posShort.DEF': 'DEF', 'posShort.MID': 'MID', 'posShort.FWD': 'FWD',
      'foot.note': 'Curated pool of {0} well-known players from nations at the 2026 World Cup. Ratings are gameplay values, not official statistics — edit players.js to change the pool.'
    },

    ar: {
      'app.title': 'مزاد كأس العالم 2026',
      'app.sub': 'لاعبان · 100 مليون دولار لكل منهما · سابق الوقت',
      'lang.other': 'English',

      's.title': 'إعداد المزاد',
      's.sub': 'مديران، ورمز لعبة واحد مشترك. الحاسوب يعرض نجوم كأس العالم 2026 لاعباً تلو الآخر — تفوّق على منافسك قبل انتهاء الوقت واملأ كل مركز في فريقك.',
      'f.p1': 'اسم المدير الأول',
      'f.p2': 'اسم المدير الثاني',
      'f.budget': 'الميزانية لكل مدير (مليون $)',
      'f.timer': 'ثواني لكل لاعب',
      'f.reset': 'ثواني تُضاف عند كل مزايدة',
      'f.formation': 'تشكيلة الفريق',
      'f.how': 'كيف ستلعبان؟',
      'f.join': 'رمز اللعبة',
      'm.local': 'شاشة واحدة (بالتناوب)',
      'm.localD': 'المديران على نفس الجهاز، ولكل واحد أزرار مزايدة خاصة به.',
      'm.host': 'نافذتان — أنشئ الرمز',
      'm.hostD': 'أنت المدير الأول. شارك الرمز مع نافذة أخرى على هذا الحاسوب.',
      'm.guest': 'نافذتان — ادخل بالرمز',
      'm.guestD': 'أنت المدير الثاني. أدخل الرمز الذي أنشأه منافسك.',
      'btn.start': 'ابدأ المزاد',
      'btn.create': 'أنشئ الغرفة وانتظر',
      'btn.join': 'ادخل الغرفة',
      'note.code': 'يجب أن تكون النافذتان في نفس المتصفح على هذا الحاسوب.',
      'note.file': 'فتح الملف مباشرة قد يمنع التواصل بين النافذتين في بعض المتصفحات — تشغيل المجلد عبر http:// هو الطريقة الآمنة.',
      'err.code': 'أدخل رمز اللعبة أولاً.',
      'wait.host': 'في انتظار انضمام المدير الثاني بالرمز…',
      'wait.guest': 'جارٍ الاتصال… تأكد من أن المدير الأول أنشأ الغرفة.',

      'r.title': 'القواعد',
      'r.1': 'كل مدير يبدأ بنفس الميزانية — <b>100 مليون دولار</b> افتراضياً.',
      'r.2': 'الحاسوب يعرض لاعباً واحداً في كل مرة. ينتهي المزاد عند وصول العدّاد إلى الصفر، وكل مزايدة تعيد الوقت.',
      'r.3': 'لا يمكنك المزايدة إلا على لاعب في مركز ما زال شاغراً عندك — حارس واحد، مدافعان، وهكذا.',
      'r.4': 'يجب أن تُبقي مليون دولار على الأقل لكل مركز شاغر متبقٍ، حتى لا ينتهي أحد بفريق ناقص.',
      'r.5': 'اضغط «انسحاب» للخروج من مزاد اللاعب الحالي. وإذا لم يعد أحد قادراً على المزايدة ينتهي المزاد فوراً.',
      'r.6': 'النتيجة النهائية = مجموع تقييم اللاعبين + <b>الانسجام</b> (‎+3 لكل لاعب إضافي من نفس البلد). وعند التعادل يفوز صاحب الرصيد المتبقي الأكبر.',
      'r.7': 'اختصارات الشاشة الواحدة — المدير الأول: <b>Q W E</b> للمزايدة و<b>R</b> للانسحاب. المدير الثاني: <b>I O P</b> للمزايدة و<b>[</b> للانسحاب.',

      'g.up': 'المعروض الآن',
      'g.base': 'السعر الابتدائي {0}',
      'g.nobid': 'لا مزايدات بعد — السعر الابتدائي {0}',
      'g.high': 'أعلى مزايدة: {0}',
      'g.lot': 'اللاعب رقم {0} · ما زال {1} لاعباً في القائمة',
      'g.sec': 'ث',
      'g.ovr': 'التقييم',
      'g.sold': '✅ بيع إلى {0} — {1}',
      'g.unsold': '❌ لم يُبَع — لا مزايدات',
      'g.paused': 'متوقف مؤقتاً',
      'btn.pause': '⏸',
      'btn.resume': '▶',
      'g.quitConfirm': 'إنهاء المزاد والعودة إلى الإعداد؟',
      'g.max': 'أقصى مزايدة الآن {0}',
      'g.you': 'أنت',
      'g.rival': 'المنافس',
      'st.leading': '★ أنت صاحب أعلى مزايدة',
      'st.passed': 'انسحبت من هذا اللاعب',
      'st.noSlot': 'لا يوجد مركز شاغر لـ{0}',
      'st.broke': 'الرصيد لا يكفي لهذه المزايدة',
      'st.turn': 'دورك',
      'st.wait': 'نافذة المنافس',
      'btn.bidCustom': 'زايد',
      'btn.pass': 'انسحاب',
      'slots.empty': 'لم تتعاقد مع أي لاعب بعد',
      'log.title': 'سجل المزاد',

      'l.start': '🎬 بدأ المزاد — {0} لكل مدير، و{1} مركزاً للتعبئة',
      'l.join': '👋 انضم {0} إلى الغرفة',
      'l.up': '⚽ معروض للمزاد: <b>{0}</b> ({1}) — السعر الابتدائي {2}',
      'l.bid': '💰 زايد {0} بمبلغ <b>{1}</b>',
      'l.pass': '🚪 انسحب {0}',
      'l.sold': '✅ انضم <b>{0}</b> إلى {1} مقابل <b>{2}</b>',
      'l.unsold': '❌ لم يُبَع {0}',
      'l.end': '🏁 انتهى المزاد',

      'res.win': 'فاز {0} بالمزاد!',
      'res.draw': 'تعادل تام!',
      'res.sub': '{0} مقابل {1} في مجموع النقاط',
      'res.subDraw': 'كلا الفريقين سجّل {0}',
      'res.rating': 'تقييم الفريق',
      'res.chem': 'مكافأة الانسجام',
      'res.spent': 'المصروف',
      'res.left': 'المتبقي',
      'res.total': 'مجموع النقاط',
      'res.slots': 'المراكز المكتملة',
      'btn.again': 'العب مرة أخرى',
      'btn.copy': '📋 انسخ النتيجة',
      'btn.copied': '✓ تم النسخ',

      'pos.GK': 'حارس مرمى', 'pos.DEF': 'مدافع', 'pos.MID': 'وسط', 'pos.FWD': 'مهاجم',
      'posShort.GK': 'حارس', 'posShort.DEF': 'مدافع', 'posShort.MID': 'وسط', 'posShort.FWD': 'مهاجم',
      'foot.note': 'قائمة مختارة من {0} لاعباً مشهوراً من منتخبات كأس العالم 2026. التقييمات لأغراض اللعب فقط وليست إحصاءات رسمية — عدّل ملف players.js لتغيير القائمة.'
    }
  };

  var lang = 'en';
  try { lang = localStorage.getItem('wc26:lang') || 'en'; } catch (e) {}
  if (!I18N[lang]) lang = 'en';

  function t(key, args) {
    var s = I18N[lang][key];
    if (s === undefined) s = I18N.en[key];
    if (s === undefined) return key;
    if (args) {
      for (var i = 0; i < args.length; i++) s = s.split('{' + i + '}').join(args[i]);
    }
    return s;
  }

  /* =========================================================
   * 2. Small helpers
   * ======================================================= */

  var $ = function (id) { return document.getElementById(id); };
  var POS_ORDER = ['GK', 'DEF', 'MID', 'FWD'];
  var FORMATIONS = {
    classic: { GK: 1, DEF: 2, MID: 2, FWD: 1 },
    attack:  { GK: 1, DEF: 1, MID: 2, FWD: 2 },
    eight:   { GK: 1, DEF: 3, MID: 2, FWD: 2 },
    eleven:  { GK: 1, DEF: 4, MID: 4, FWD: 3 }
  };

  var DEFAULT_NAMES = { en: ['Manager 1', 'Manager 2'], ar: ['المدير 1', 'المدير 2'] };

  function moneyRaw(m) { return '$' + m + 'M'; }
  // In RTL a run like "$12M" or "+3" flips unless it is bidi-isolated.
  function iso(s) { return lang === 'ar' ? '⁦' + s + '⁩' : s; }
  function money(m) { return iso(moneyRaw(m)); }
  function natLabel(code) {
    var n = NATIONS[code];
    if (!n) return code;
    return n.flag + ' ' + (lang === 'ar' ? n.ar : n.en);
  }
  function byId(pid) { return PLAYER_BY_ID[pid]; }

  var PLAYER_BY_ID = {};
  PLAYERS.forEach(function (p) { PLAYER_BY_ID[p.id] = p; });

  function seedFrom(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function rngFrom(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t2 = Math.imul(a ^ (a >>> 15), 1 | a);
      t2 = (t2 + Math.imul(t2 ^ (t2 >>> 7), 61 | t2)) ^ t2;
      return ((t2 ^ (t2 >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeCode() {
    var abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var s = '';
    for (var i = 0; i < 4; i++) s += abc[Math.floor(Math.random() * abc.length)];
    return 'WC26-' + s;
  }

  /* ---- sound ---- */
  var soundOn = true, actx = null;
  function beep(freq, dur, vol) {
    if (!soundOn) return;
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      var o = actx.createOscillator(), g = actx.createGain();
      o.type = 'triangle';
      o.frequency.value = freq;
      g.gain.value = vol || 0.05;
      o.connect(g); g.connect(actx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + (dur || 0.12));
      o.stop(actx.currentTime + (dur || 0.12) + 0.02);
    } catch (e) {}
  }

  /* =========================================================
   * 3. Networking (two windows, one code)
   * ======================================================= */

  var net = { role: 'local', code: null, seat: 0, bus: null, connected: false, pendingName: null };
  var seenMsg = {}, seenList = [], msgN = 0;

  function isHost() { return net.role !== 'guest'; }

  function makeBus(code, onMsg) {
    var name = 'wc26-auction-' + code;
    var ch = null;
    if (typeof BroadcastChannel !== 'undefined') {
      ch = new BroadcastChannel(name);
      ch.onmessage = function (e) { receive(e.data, onMsg); };
    } else {
      window.addEventListener('storage', function (e) {
        if (e.key !== 'wc26msg:' + code || !e.newValue) return;
        try { receive(JSON.parse(e.newValue), onMsg); } catch (err) {}
      });
    }
    return {
      send: function (msg) {
        msg.id = net.role + ':' + (++msgN) + ':' + Math.random().toString(36).slice(2, 7);
        if (ch) ch.postMessage(msg);
        else { try { localStorage.setItem('wc26msg:' + code, JSON.stringify(msg)); } catch (e) {} }
      },
      close: function () { if (ch) { try { ch.close(); } catch (e) {} } }
    };
  }

  function receive(msg, onMsg) {
    if (!msg || !msg.id || seenMsg[msg.id]) return;
    seenMsg[msg.id] = 1;
    seenList.push(msg.id);
    if (seenList.length > 300) delete seenMsg[seenList.shift()];
    onMsg(msg);
  }

  function onNetMessage(msg) {
    if (isHost()) {
      if (msg.t === 'join') {
        net.connected = true;
        if (S) {
          if (msg.name) S.teams[1].name = msg.name;
          pushLog('l.join', [S.teams[1].name]);
          broadcast();
        } else {
          net.pendingName = msg.name || null;
          if (pendingOpts) startHostedGame();
        }
      } else if (msg.t === 'act' && S) {
        if (msg.a === 'bid') doBid(1, msg.amt);
        else if (msg.a === 'pass') doPass(1);
      }
    } else {
      if (msg.t === 'state') {
        net.connected = true;
        S = msg.s;
        if (S.phase === 'done') showResults();
        else {
          if ($('game').classList.contains('hidden')) showGame();
          else render();
        }
      } else if (msg.t === 'over') {
        backToSetup();
      }
    }
  }

  function broadcast() {
    if (net.role === 'host' && net.bus && S) net.bus.send({ t: 'state', s: S });
  }

  /* =========================================================
   * 4. Game state
   * ======================================================= */

  var S = null;          // shared game state (host is authoritative)
  var tickTimer = null;
  var lastTick = 0;
  var squadSig = ['', ''];

  function newGame(opts) {
    var rand = rngFrom(seedFrom(opts.code));
    var order = PLAYERS.map(function (p) { return p.id; });
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1));
      var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
    }
    var form = FORMATIONS[opts.formation] || FORMATIONS.classic;
    var slots = 0;
    POS_ORDER.forEach(function (p) { slots += form[p]; });

    return {
      code: opts.code,
      budget0: opts.budget,
      lotSecs: opts.lotSecs,
      resetSecs: opts.resetSecs,
      formation: form,
      slotsTotal: slots,
      order: order,
      cursor: 0,
      lotNo: 0,
      teams: [
        { name: opts.names[0], budget: opts.budget, squad: [], passed: false },
        { name: opts.names[1], budget: opts.budget, squad: [], passed: false }
      ],
      lot: null,
      verdict: null,
      phase: 'bidding',
      paused: false,
      elapsed: 0,
      log: []
    };
  }

  function pushLog(key, args) {
    S.log.unshift({ k: key, a: args || [] });
    if (S.log.length > 60) S.log.pop();
  }

  function filled(seat, pos) {
    var n = 0;
    S.teams[seat].squad.forEach(function (x) { if (x.pos === pos) n++; });
    return n;
  }
  function slotOpen(seat, pos) { return filled(seat, pos) < S.formation[pos]; }
  function slotsLeft(seat) { return S.slotsTotal - S.teams[seat].squad.length; }
  function maxBid(seat) {
    // Keep $1M in reserve for every slot that still needs filling after this one.
    return S.teams[seat].budget - Math.max(0, slotsLeft(seat) - 1);
  }
  function minBid() {
    if (!S.lot) return 0;
    return S.lot.high ? S.lot.high.amt + 1 : S.lot.base;
  }
  function eligible(seat) {
    if (!S.lot || S.phase !== 'bidding') return false;
    var team = S.teams[seat];
    if (team.passed) return false;
    if (!slotOpen(seat, S.lot.pos)) return false;
    if (S.lot.high && S.lot.high.seat === seat) return false;
    return maxBid(seat) >= minBid();
  }
  function couldWant(seat, player) {
    // Would this manager even be able to sign this player at base price?
    return slotOpen(seat, player.pos) &&
           S.teams[seat].budget - Math.max(0, slotsLeft(seat) - 1) >= player.base;
  }

  /* ---- lot flow ---- */

  function nextLot() {
    while (S.cursor < S.order.length) {
      var p = byId(S.order[S.cursor++]);
      if (!p) continue;
      if (couldWant(0, p) || couldWant(1, p)) {
        S.lotNo++;
        S.lot = { pid: p.id, pos: p.pos, base: p.base, high: null, remain: S.lotSecs * 1000 };
        S.teams[0].passed = false;
        S.teams[1].passed = false;
        S.verdict = null;
        S.phase = 'bidding';
        pushLog('l.up', [p.name, natLabel(p.nat), money(p.base)]);
        beep(760, 0.09);
        squadSig = ['', ''];
        render();
        broadcast();
        return;
      }
    }
    finish();
  }

  function doBid(seat, amt) {
    if (!S || S.phase !== 'bidding' || S.paused) return;
    amt = Math.floor(amt);
    if (!eligible(seat)) return;
    if (isNaN(amt) || amt < minBid() || amt > maxBid(seat)) return;

    S.lot.high = { seat: seat, amt: amt };
    if (S.lot.remain < S.resetSecs * 1000) S.lot.remain = S.resetSecs * 1000;
    S.teams[seat].passed = false;
    pushLog('l.bid', [S.teams[seat].name, money(amt)]);
    beep(520 + seat * 180, 0.09);
    checkDeadlock();
    render();
    broadcast();
  }

  function doPass(seat) {
    if (!S || S.phase !== 'bidding' || S.paused) return;
    if (S.teams[seat].passed) return;
    S.teams[seat].passed = true;
    pushLog('l.pass', [S.teams[seat].name]);
    beep(240, 0.1);
    checkDeadlock();
    render();
    broadcast();
  }

  function checkDeadlock() {
    if (!eligible(0) && !eligible(1)) resolveLot();
  }

  function resolveLot() {
    var p = byId(S.lot.pid);
    if (S.lot.high) {
      var seat = S.lot.high.seat, amt = S.lot.high.amt;
      S.teams[seat].budget -= amt;
      S.teams[seat].squad.push({ id: p.id, name: p.name, nat: p.nat, pos: p.pos, ovr: p.ovr, price: amt });
      S.verdict = { pid: p.id, seat: seat, amt: amt };
      pushLog('l.sold', [p.name, S.teams[seat].name, money(amt)]);
      beep(880, 0.18, 0.07);
      setTimeout(function () { beep(1180, 0.22, 0.06); }, 130);
    } else {
      S.verdict = { pid: p.id, seat: null, amt: 0 };
      pushLog('l.unsold', [p.name]);
      beep(180, 0.25, 0.05);
    }
    S.phase = 'verdict';
    S.lot.remain = 0;
    squadSig = ['', ''];
    render();
    broadcast();

    if (isHost()) {
      setTimeout(function () {
        if (!S || S.phase !== 'verdict') return;
        if (slotsLeft(0) === 0 && slotsLeft(1) === 0) finish();
        else nextLot();
      }, 2300);
    }
  }

  function finish() {
    S.phase = 'done';
    S.lot = null;
    pushLog('l.end', []);
    stopTick();
    broadcast();
    showResults();
  }

  /* ---- clock ---- */

  function startTick() {
    stopTick();
    lastTick = Date.now();
    tickTimer = setInterval(tick, 100);
  }
  function stopTick() {
    if (tickTimer) clearInterval(tickTimer);
    tickTimer = null;
  }
  function tick() {
    var now = Date.now();
    var dt = now - lastTick;
    lastTick = now;
    if (!S || S.paused || S.phase === 'done') return;

    S.elapsed += dt;
    if (S.phase === 'bidding' && S.lot) {
      var before = S.lot.remain;
      S.lot.remain = Math.max(0, S.lot.remain - dt);
      if (before > 0 && S.lot.remain > 0 && Math.ceil(S.lot.remain / 1000) !== Math.ceil(before / 1000) && S.lot.remain <= 5000) {
        beep(400, 0.06, 0.04);
      }
      if (S.lot.remain === 0) { resolveLot(); return; }
    }
    render();
    if (net.role === 'host') broadcast();
  }

  /* =========================================================
   * 5. Scoring
   * ======================================================= */

  function scoreTeam(seat) {
    var team = S.teams[seat];
    var rating = 0, byNat = {};
    team.squad.forEach(function (p) {
      rating += p.ovr;
      byNat[p.nat] = (byNat[p.nat] || 0) + 1;
    });
    var chem = 0;
    Object.keys(byNat).forEach(function (k) { chem += (byNat[k] - 1) * 3; });
    return {
      rating: rating,
      chem: chem,
      total: rating + chem,
      spent: S.budget0 - team.budget,
      left: team.budget,
      slots: team.squad.length
    };
  }

  /* =========================================================
   * 6. Rendering
   * ======================================================= */

  function buildTeamPanels() {
    for (var s = 0; s < 2; s++) {
      var col = $('team' + s + '-col');
      col.innerHTML =
        '<div class="card team" style="--seat:' + (s === 0 ? 'var(--p1)' : 'var(--p2)') + '">' +
          '<div class="team-head">' +
            '<span class="team-name" id="tname-' + s + '"></span>' +
            '<span class="you-tag hidden" id="you-' + s + '"></span>' +
          '</div>' +
          '<div class="budget" id="tbud-' + s + '"></div>' +
          '<div class="max-note" id="tmax-' + s + '"></div>' +
          '<div class="slots" id="tslots-' + s + '"></div>' +
          '<ul class="squad" id="tsquad-' + s + '"></ul>' +
          '<div class="bid-pad">' +
            '<button class="bid-btn" data-seat="' + s + '" data-k="0"></button>' +
            '<button class="bid-btn" data-seat="' + s + '" data-k="1"></button>' +
            '<button class="bid-btn" data-seat="' + s + '" data-k="2"></button>' +
          '</div>' +
          '<div class="custom-row">' +
            '<input type="number" id="tcustom-' + s + '" min="1" step="1">' +
            '<button class="ghost-btn" id="tcbtn-' + s + '"></button>' +
          '</div>' +
          '<button class="pass-btn" id="tpass-' + s + '"></button>' +
          '<div class="status-line" id="tstat-' + s + '"></div>' +
        '</div>';
    }

    Array.prototype.forEach.call(document.querySelectorAll('.bid-btn'), function (b) {
      b.addEventListener('click', function () {
        var seat = +b.getAttribute('data-seat');
        var k = +b.getAttribute('data-k');
        act(seat, 'bid', minBid() + [0, 4, 9][k]);
      });
    });
    [0, 1].forEach(function (s) {
      $('tcbtn-' + s).addEventListener('click', function () { customBid(s); });
      $('tcustom-' + s).addEventListener('keydown', function (e) {
        if (e.key === 'Enter') customBid(s);
      });
      $('tpass-' + s).addEventListener('click', function () { act(s, 'pass'); });
    });
  }

  function customBid(seat) {
    var el = $('tcustom-' + seat);
    var v = parseInt(el.value, 10);
    if (!isNaN(v)) act(seat, 'bid', v);
    el.value = '';
  }

  function mySeats() {
    if (net.role === 'local') return [0, 1];
    if (net.role === 'host') return [0];
    return [1];
  }

  function act(seat, what, amt) {
    if (mySeats().indexOf(seat) === -1) return;
    if (isHost()) {
      if (what === 'bid') doBid(seat, amt); else doPass(seat);
    } else if (net.bus) {
      net.bus.send({ t: 'act', a: what, amt: amt });
    }
  }

  function render() {
    if (!S) return;
    renderLot();
    renderTeam(0);
    renderTeam(1);
    renderLog();
    $('elapsed-text').textContent = fmtClock(S.elapsed);
    $('pause-btn').textContent = S.paused ? t('btn.resume') : t('btn.pause');
  }

  function fmtClock(ms) {
    var s = Math.floor(ms / 1000);
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  function renderLot() {
    var v = $('verdict');
    if (S.phase === 'done' || !S.lot) return;
    var p = byId(S.lot.pid);

    $('lot-pos').className = 'pos-badge pos-' + p.pos;
    $('lot-pos').textContent = t('pos.' + p.pos);
    $('lot-name').textContent = p.name;
    $('lot-nat').textContent = natLabel(p.nat);
    $('lot-ovr').textContent = p.ovr;
    $('lot-base').textContent = t('g.base', [money(p.base)]);

    var high = S.lot.high;
    $('bid-now').textContent = money(high ? high.amt : p.base);
    $('bid-holder').textContent = high
      ? t('g.high', [S.teams[high.seat].name])
      : t('g.nobid', [money(p.base)]);

    var frac = Math.max(0, Math.min(1, S.lot.remain / (S.lotSecs * 1000)));
    var fill = $('timer-fill');
    fill.style.width = (frac * 100) + '%';
    fill.className = 'timer-fill' + (S.lot.remain <= 5000 ? ' danger' : (S.lot.remain <= 10000 ? ' warn' : ''));
    $('clock-text').textContent = (S.lot.remain / 1000).toFixed(1);
    $('clock-unit').textContent = t('g.sec');
    $('clock-text').className = S.lot.remain <= 5000 && S.phase === 'bidding' ? 'pulse' : '';

    var remaining = 0;
    for (var i = S.cursor; i < S.order.length; i++) remaining++;
    $('lot-counter').textContent = S.paused ? t('g.paused') : t('g.lot', [S.lotNo, remaining]);

    if (S.phase === 'verdict' && S.verdict) {
      v.classList.remove('hidden');
      if (S.verdict.seat === null) {
        v.className = 'verdict unsold pop';
        v.textContent = t('g.unsold');
      } else {
        v.className = 'verdict sold pop';
        v.textContent = t('g.sold', [S.teams[S.verdict.seat].name, money(S.verdict.amt)]);
      }
    } else {
      v.classList.add('hidden');
    }
  }

  function renderTeam(seat) {
    var team = S.teams[seat];
    var mine = mySeats().indexOf(seat) !== -1;

    $('tname-' + seat).textContent = team.name;
    var tag = $('you-' + seat);
    if (net.role === 'local') {
      tag.classList.add('hidden');
    } else {
      tag.classList.remove('hidden');
      tag.textContent = mine ? t('g.you') : t('g.rival');
    }

    var bud = $('tbud-' + seat);
    bud.textContent = money(team.budget);
    bud.className = 'budget' + (team.budget <= S.budget0 * 0.15 ? ' low' : '');
    $('tmax-' + seat).textContent = t('g.max', [money(Math.max(0, maxBid(seat)))]);

    // slots
    var sig = team.squad.length + '|' + team.budget + '|' + lang;
    if (squadSig[seat] !== sig) {
      squadSig[seat] = sig;
      var slotsHtml = '';
      POS_ORDER.forEach(function (pos) {
        for (var i = 0; i < S.formation[pos]; i++) {
          slotsHtml += '<span class="slot' + (i < filled(seat, pos) ? ' filled' : '') + '">' +
            t('posShort.' + pos) + '</span>';
        }
      });
      $('tslots-' + seat).innerHTML = slotsHtml;

      var listHtml = '';
      var sorted = team.squad.slice().sort(function (a, b) {
        return POS_ORDER.indexOf(a.pos) - POS_ORDER.indexOf(b.pos);
      });
      sorted.forEach(function (p) {
        listHtml += '<li>' +
          '<span class="tag pos-' + p.pos + '">' + t('posShort.' + p.pos) + '</span>' +
          '<span class="nm">' + escapeHtml(p.name) + ' <span style="color:var(--muted)">' +
          (NATIONS[p.nat] ? NATIONS[p.nat].flag : '') + ' ' + p.ovr + '</span></span>' +
          '<span class="pr">' + money(p.price) + '</span></li>';
      });
      $('tsquad-' + seat).innerHTML = listHtml ||
        '<li class="empty-squad">' + t('slots.empty') + '</li>';
    }

    // bid pad
    var can = eligible(seat) && mine && !S.paused && S.phase === 'bidding';
    var mb = minBid(), mx = maxBid(seat);
    var btns = document.querySelectorAll('.bid-btn[data-seat="' + seat + '"]');
    for (var k = 0; k < btns.length; k++) {
      var amt = mb + [0, 4, 9][k];
      btns[k].textContent = money(amt);
      btns[k].disabled = !can || amt > mx;
    }
    var ci = $('tcustom-' + seat);
    ci.disabled = !can;
    ci.min = mb;
    ci.max = Math.max(mb, mx);
    ci.placeholder = mb + '–' + Math.max(mb, mx);
    $('tcbtn-' + seat).disabled = !can;
    $('tcbtn-' + seat).textContent = t('btn.bidCustom');

    var pass = $('tpass-' + seat);
    pass.textContent = t('btn.pass');
    pass.disabled = !mine || team.passed || S.paused || S.phase !== 'bidding';

    // status line
    var st = $('tstat-' + seat), cls = 'status-line', msg = '';
    if (!mine && net.role !== 'local') { msg = t('st.wait'); }
    else if (S.phase !== 'bidding') { msg = ''; }
    else if (S.lot && S.lot.high && S.lot.high.seat === seat) { cls += ' leading'; msg = t('st.leading'); }
    else if (team.passed) { cls += ' out'; msg = t('st.passed'); }
    else if (S.lot && !slotOpen(seat, S.lot.pos)) { cls += ' out'; msg = t('st.noSlot', [t('pos.' + S.lot.pos)]); }
    else if (mx < mb) { cls += ' out'; msg = t('st.broke'); }
    else if (mine) { msg = t('st.turn'); }
    st.className = cls;
    st.textContent = msg;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderLog() {
    $('log').innerHTML = S.log.map(function (e) {
      return '<div>' + t(e.k, e.a) + '</div>';
    }).join('');
  }

  /* =========================================================
   * 7. Screens
   * ======================================================= */

  function showGame() {
    $('setup').classList.add('hidden');
    $('results').classList.add('hidden');
    $('game').classList.remove('hidden');
    $('code-chip').classList.remove('hidden');
    $('elapsed-chip').classList.remove('hidden');
    $('code-text').textContent = S.code;
    squadSig = ['', ''];
    buildTeamPanels();
    render();
  }

  function showResults() {
    stopTick();
    $('game').classList.add('hidden');
    $('setup').classList.add('hidden');
    $('results').classList.remove('hidden');

    var a = scoreTeam(0), b = scoreTeam(1);
    var win;
    if (a.total !== b.total) win = a.total > b.total ? 0 : 1;
    else if (a.left !== b.left) win = a.left > b.left ? 0 : 1;
    else win = -1;

    if (win === -1) {
      $('win-title').textContent = t('res.draw');
      $('win-sub').textContent = t('res.subDraw', [a.total]);
    } else {
      var w = win === 0 ? a : b, l = win === 0 ? b : a;
      $('win-title').textContent = t('res.win', [S.teams[win].name]);
      $('win-sub').textContent = t('res.sub', [w.total, l.total]);
    }

    var grid = $('result-grid');
    grid.innerHTML = '';
    [0, 1].forEach(function (seat) {
      var sc = seat === 0 ? a : b;
      var team = S.teams[seat];
      var rows = team.squad.slice().sort(function (x, y) {
        return POS_ORDER.indexOf(x.pos) - POS_ORDER.indexOf(y.pos);
      }).map(function (p) {
        return '<li><span class="tag pos-' + p.pos + '">' + t('posShort.' + p.pos) + '</span>' +
          '<span class="nm">' + escapeHtml(p.name) + ' <span style="color:var(--muted)">' +
          (NATIONS[p.nat] ? NATIONS[p.nat].flag : '') + ' ' + p.ovr + '</span></span>' +
          '<span class="pr">' + money(p.price) + '</span></li>';
      }).join('');

      var card = document.createElement('div');
      card.className = 'card team';
      card.style.setProperty('--seat', seat === 0 ? 'var(--p1)' : 'var(--p2)');
      card.innerHTML =
        '<div class="team-head"><span class="team-name">' +
          (win === seat ? '🏆 ' : '') + escapeHtml(team.name) + '</span></div>' +
        '<ul class="squad">' + (rows || '<li class="empty-squad">' + t('slots.empty') + '</li>') + '</ul>' +
        '<div class="score-line"><span>' + t('res.rating') + '</span><b>' + sc.rating + '</b></div>' +
        '<div class="score-line"><span>' + t('res.chem') + '</span><b>' + iso('+' + sc.chem) + '</b></div>' +
        '<div class="score-line"><span>' + t('res.slots') + '</span><b>' + iso(sc.slots + ' / ' + S.slotsTotal) + '</b></div>' +
        '<div class="score-line"><span>' + t('res.spent') + '</span><b>' + money(sc.spent) + '</b></div>' +
        '<div class="score-line"><span>' + t('res.left') + '</span><b>' + money(sc.left) + '</b></div>' +
        '<div class="score-line total"><span>' + t('res.total') + '</span><span>' + sc.total + '</span></div>';
      grid.appendChild(card);
    });

    beep(880, 0.2, 0.07);
    setTimeout(function () { beep(1100, 0.2, 0.07); }, 180);
    setTimeout(function () { beep(1320, 0.35, 0.07); }, 360);
  }

  function resultText() {
    var a = scoreTeam(0), b = scoreTeam(1);
    var lines = ['⚽ ' + t('app.title') + ' — ' + S.code];
    [0, 1].forEach(function (seat) {
      var sc = seat === 0 ? a : b;
      lines.push('');
      lines.push(S.teams[seat].name + ' — ' + sc.total + ' pts (' + moneyRaw(sc.spent) + ' spent)');
      S.teams[seat].squad.forEach(function (p) {
        lines.push('  ' + t('posShort.' + p.pos) + ' ' + p.name + ' (' + p.ovr + ') ' + moneyRaw(p.price));
      });
    });
    return lines.join('\n');
  }

  function backToSetup() {
    stopTick();
    if (net.bus) { net.bus.close(); net.bus = null; }
    net = { role: net.role, code: null, seat: 0, bus: null, connected: false, pendingName: null };
    S = null;
    pendingOpts = null;
    $('game').classList.add('hidden');
    $('results').classList.add('hidden');
    $('setup').classList.remove('hidden');
    $('code-chip').classList.add('hidden');
    $('elapsed-chip').classList.add('hidden');
    $('start-note').textContent = '';
    $('start-btn').disabled = false;
  }

  /* =========================================================
   * 8. Setup wiring
   * ======================================================= */

  var mode = 'local';
  var pendingOpts = null;   // host-mode settings, held until Manager 2 joins

  Array.prototype.forEach.call(document.querySelectorAll('.mode'), function (btn) {
    btn.addEventListener('click', function () {
      Array.prototype.forEach.call(document.querySelectorAll('.mode'), function (b) {
        b.classList.remove('on');
      });
      btn.classList.add('on');
      mode = btn.getAttribute('data-mode');
      $('join-wrap').classList.toggle('hidden', mode !== 'guest');
      $('in-p2').parentElement.classList.toggle('hidden', mode === 'host');
      $('in-p1').parentElement.classList.toggle('hidden', mode === 'guest');
      $('start-note').textContent = mode === 'local'
        ? ''
        : t('note.code') + (location.protocol === 'file:' ? ' ' + t('note.file') : '');
      applyLang();
    });
  });

  $('start-btn').addEventListener('click', function () {
    var budget = clampNum($('in-budget').value, 20, 500, 100);
    var lotSecs = clampNum($('in-timer').value, 5, 120, 20);
    var resetSecs = clampNum($('in-reset').value, 3, 60, 10);
    var n1 = ($('in-p1').value || '').trim() || DEFAULT_NAMES[lang][0];
    var n2 = ($('in-p2').value || '').trim() || DEFAULT_NAMES[lang][1];

    if (mode === 'guest') {
      var code = ($('in-code').value || '').trim().toUpperCase();
      if (!code) { $('start-note').textContent = t('err.code'); return; }
      net.role = 'guest';
      net.code = code;
      net.bus = makeBus(code, onNetMessage);
      $('start-note').textContent = t('wait.guest');
      net.bus.send({ t: 'join', name: n2 });
      // Re-announce a few times in case the host window opens later.
      var tries = 0;
      var iv = setInterval(function () {
        if (net.connected || ++tries > 20) { clearInterval(iv); return; }
        net.bus.send({ t: 'join', name: n2 });
      }, 1500);
      return;
    }

    net.role = mode === 'host' ? 'host' : 'local';
    net.code = makeCode();
    pendingOpts = {
      code: net.code,
      budget: budget,
      lotSecs: lotSecs,
      resetSecs: resetSecs,
      formation: $('in-formation').value,
      names: [n1, n2]
    };

    if (net.role === 'host') {
      net.bus = makeBus(net.code, onNetMessage);
      $('code-chip').classList.remove('hidden');
      $('code-text').textContent = net.code;
      $('start-note').textContent = t('wait.host') + ' — ' + net.code;
      $('start-btn').disabled = true;
      if (net.pendingName) startHostedGame();
      return;
    }

    startHostedGame();
  });

  function startHostedGame() {
    if (!pendingOpts) return;
    if (net.pendingName) pendingOpts.names[1] = net.pendingName;
    S = newGame(pendingOpts);
    pendingOpts = null;
    $('start-btn').disabled = false;
    pushLog('l.start', [money(S.budget0), S.slotsTotal]);
    if (net.role === 'host') pushLog('l.join', [S.teams[1].name]);
    showGame();
    startTick();
    nextLot();
    broadcast();
  }

  function clampNum(v, lo, hi, dflt) {
    var n = parseInt(v, 10);
    if (isNaN(n)) return dflt;
    return Math.max(lo, Math.min(hi, n));
  }

  $('pause-btn').addEventListener('click', function () {
    if (!S || !isHost()) return;
    S.paused = !S.paused;
    render();
    broadcast();
  });

  $('quit-btn').addEventListener('click', function () {
    if (!confirm(t('g.quitConfirm'))) return;
    if (net.role === 'host' && net.bus) net.bus.send({ t: 'over' });
    backToSetup();
  });

  $('again-btn').addEventListener('click', function () {
    if (net.role === 'host' && net.bus) net.bus.send({ t: 'over' });
    backToSetup();
  });

  $('copy-btn').addEventListener('click', function () {
    var txt = resultText();
    var done = function () {
      $('copy-btn').textContent = t('btn.copied');
      setTimeout(function () { $('copy-btn').textContent = t('btn.copy'); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, function () { fallbackCopy(txt, done); });
    } else fallbackCopy(txt, done);
  });

  function fallbackCopy(txt, done) {
    var ta = document.createElement('textarea');
    ta.value = txt;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  $('code-chip').addEventListener('click', function () {
    if (!net.code) return;
    var chip = $('code-chip');
    var back = chip.innerHTML;
    var flash = function () {
      chip.textContent = t('btn.copied');
      setTimeout(function () { chip.innerHTML = back; }, 1200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(net.code).then(flash, function () { fallbackCopy(net.code, flash); });
    } else fallbackCopy(net.code, flash);
  });

  $('sound-btn').addEventListener('click', function () {
    soundOn = !soundOn;
    $('sound-btn').textContent = soundOn ? '🔊' : '🔇';
    $('sound-btn').classList.toggle('on', soundOn);
    if (soundOn) beep(660, 0.08);
  });

  $('lang-btn').addEventListener('click', function () {
    lang = lang === 'en' ? 'ar' : 'en';
    try { localStorage.setItem('wc26:lang', lang); } catch (e) {}
    applyLang();
  });

  /* ---- hot-seat keyboard ---- */
  var KEYS = {
    q: [0, 0], w: [0, 1], e: [0, 2], r: [0, -1],
    i: [1, 0], o: [1, 1], p: [1, 2], '[': [1, -1]
  };
  document.addEventListener('keydown', function (ev) {
    if (!S || S.phase !== 'bidding') return;
    var tag = (ev.target && ev.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    var k = KEYS[ev.key.toLowerCase()];
    if (!k) return;
    ev.preventDefault();
    if (k[1] === -1) act(k[0], 'pass');
    else act(k[0], 'bid', minBid() + [0, 4, 9][k[1]]);
  });

  /* =========================================================
   * 9. Language application
   * ======================================================= */

  function applyLang() {
    document.documentElement.lang = lang;
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';

    $('ttl').textContent = t('app.title');
    $('ttl-sub').textContent = t('app.sub');
    $('lang-btn').textContent = t('lang.other');
    document.title = t('app.title') + ' — ' + (lang === 'ar' ? I18N.en['app.title'] : I18N.ar['app.title']);

    $('s-title').textContent = t('s.title');
    $('s-sub').textContent = t('s.sub');
    $('l-p1').textContent = t('f.p1');
    $('l-p2').textContent = t('f.p2');
    $('l-budget').textContent = t('f.budget');
    $('l-timer').textContent = t('f.timer');
    $('l-reset').textContent = t('f.reset');
    $('l-formation').textContent = t('f.formation');
    $('l-how').textContent = t('f.how');
    $('l-join').textContent = t('f.join');
    $('m-local').textContent = t('m.local');
    $('m-local-d').textContent = t('m.localD');
    $('m-host').textContent = t('m.host');
    $('m-host-d').textContent = t('m.hostD');
    $('m-guest').textContent = t('m.guest');
    $('m-guest-d').textContent = t('m.guestD');
    $('start-btn').textContent = mode === 'host' ? t('btn.create') : (mode === 'guest' ? t('btn.join') : t('btn.start'));
    $('r-title').textContent = t('r.title');
    $('rules-body').innerHTML = ['r.1', 'r.2', 'r.3', 'r.4', 'r.5', 'r.6', 'r.7']
      .map(function (k) { return '• ' + t(k); }).join('<br><br>');
    $('log-title').textContent = t('log.title');
    $('ovr-label').textContent = t('g.ovr');

    // Swap the placeholder manager names when they have not been edited.
    [0, 1].forEach(function (i) {
      var el = $(i === 0 ? 'in-p1' : 'in-p2');
      var v = (el.value || '').trim();
      if (v === '' || v === DEFAULT_NAMES.en[i] || v === DEFAULT_NAMES.ar[i]) {
        el.value = DEFAULT_NAMES[lang][i];
      }
    });
    $('again-btn').textContent = t('btn.again');
    $('copy-btn').textContent = t('btn.copy');
    $('footer-note').textContent = t('foot.note', [PLAYERS.length]);

    // Formation option labels use position abbreviations.
    var opts = $('in-formation').options;
    var shapes = [FORMATIONS.classic, FORMATIONS.attack, FORMATIONS.eight, FORMATIONS.eleven];
    for (var i = 0; i < opts.length; i++) {
      var f = shapes[i], total = 0, parts = [];
      POS_ORDER.forEach(function (p) { total += f[p]; parts.push(f[p] + ' ' + t('posShort.' + p)); });
      opts[i].textContent = parts.join(' · ') + ' (' + total + ')';
    }

    if (S && !$('game').classList.contains('hidden')) { squadSig = ['', '']; render(); }
    if (S && !$('results').classList.contains('hidden')) showResults();
  }

  applyLang();
})();
