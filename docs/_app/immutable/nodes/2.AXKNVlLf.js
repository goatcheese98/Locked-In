import '../chunks/DsnmJJEf.js';
import { i as St } from '../chunks/D2WOwOT0.js';
import {
	b as Do,
	l as zn,
	w as Yt,
	d as Ho,
	g as ae,
	s as Be,
	e as C,
	o as Xn,
	c as Lo
} from '../chunks/DcxtdZEe.js';
import {
	w as Re,
	aD as Go,
	aE as Bo,
	aF as No,
	aG as Fo,
	aH as zo,
	aI as Xo,
	e as ee,
	M as Yn,
	F as je,
	aJ as Yo,
	af as Uo,
	p as tt,
	aK as ye,
	aL as Ut,
	l as Ee,
	t as qe,
	a as Ie,
	m as nt,
	T as h,
	P as I,
	n as M,
	o as x,
	q as b,
	h as l,
	aM as Qe,
	aa as gn,
	f as Wo,
	Y as ot
} from '../chunks/BdEMnGkn.js';
import { i as Un, s as Wt, a as ke, p as ue, b as Ft } from '../chunks/C7My8cHf.js';
function $o(e, t, n) {
	var i = e == null ? '' : '' + e;
	return ((i = i ? i + ' ' + t : t), i === '' ? null : i);
}
function Vo(e, t) {
	return e == null ? null : String(e);
}
function Pt(e, t, n, i, o, a) {
	var s = e.__className;
	if (Re || s !== n || s === void 0) {
		var r = $o(n, i);
		((!Re || r !== e.getAttribute('class')) &&
			(r == null ? e.removeAttribute('class') : (e.className = r)),
			(e.__className = n));
	}
	return a;
}
function Ke(e, t, n, i) {
	var o = e.__style;
	if (Re || o !== t) {
		var a = Vo(t);
		((!Re || a !== e.getAttribute('style')) &&
			(a == null ? e.removeAttribute('style') : (e.style.cssText = a)),
			(e.__style = t));
	}
	return i;
}
const Ko = Symbol('is custom element'),
	qo = Symbol('is html');
function oe(e) {
	if (Re) {
		var t = !1,
			n = () => {
				if (!t) {
					if (((t = !0), e.hasAttribute('value'))) {
						var i = e.value;
						(Ze(e, 'value', null), (e.value = i));
					}
					if (e.hasAttribute('checked')) {
						var o = e.checked;
						(Ze(e, 'checked', null), (e.checked = o));
					}
				}
			};
		((e.__on_r = n), No(n), Do());
	}
}
function Ze(e, t, n, i) {
	var o = Zo(e);
	(Re &&
		((o[t] = e.getAttribute(t)),
		t === 'src' || t === 'srcset' || (t === 'href' && e.nodeName === 'LINK'))) ||
		(o[t] !== (o[t] = n) &&
			(t === 'loading' && (e[Fo] = n),
			n == null
				? e.removeAttribute(t)
				: typeof n != 'string' && jo(e).includes(t)
					? (e[t] = n)
					: e.setAttribute(t, n)));
}
function Zo(e) {
	return (e.__attributes ??= { [Ko]: e.nodeName.includes('-'), [qo]: e.namespaceURI === Go });
}
var hn = new Map();
function jo(e) {
	var t = hn.get(e.nodeName);
	if (t) return t;
	hn.set(e.nodeName, (t = []));
	for (var n, i = e, o = Element.prototype; o !== i; ) {
		n = zo(i);
		for (var a in n) n[a].set && t.push(a);
		i = Bo(i);
	}
	return t;
}
function ve(e, t, n = t) {
	var i = Xo(),
		o = new WeakSet();
	(zn(e, 'input', (a) => {
		var s = a ? e.defaultValue : e.value;
		if (((s = Ot(e) ? Dt(s) : s), n(s), je !== null && o.add(je), i && s !== (s = t()))) {
			var r = e.selectionStart,
				f = e.selectionEnd;
			((e.value = s ?? ''),
				f !== null && ((e.selectionStart = r), (e.selectionEnd = Math.min(f, e.value.length))));
		}
	}),
		((Re && e.defaultValue !== e.value) || (ee(t) == null && e.value)) &&
			(n(Ot(e) ? Dt(e.value) : e.value), je !== null && o.add(je)),
		Yn(() => {
			var a = t();
			if (e === document.activeElement) {
				var s = Yo ?? je;
				if (o.has(s)) return;
			}
			(Ot(e) && a === Dt(e.value)) ||
				(e.type === 'date' && !a && !e.value) ||
				(a !== e.value && (e.value = a ?? ''));
		}));
}
function dt(e, t, n = t) {
	(zn(e, 'change', (i) => {
		var o = i ? e.defaultChecked : e.checked;
		n(o);
	}),
		((Re && e.defaultChecked !== e.checked) || ee(t) == null) && n(e.checked),
		Yn(() => {
			var i = t();
			e.checked = !!i;
		}));
}
function Ot(e) {
	var t = e.type;
	return t === 'number' || t === 'range';
}
function Dt(e) {
	return e === '' ? null : +e;
}
function Wn(e) {
	return function (...t) {
		var n = t[0];
		return (n.preventDefault(), e?.apply(this, t));
	};
}
function $n(e, t) {
	var n = e.$$events?.[t.type],
		i = Uo(n) ? n.slice() : n == null ? [] : [n];
	for (var o of i) o.call(this, t);
}
const Vn = 'zenZoneTimerSettings',
	$t = {
		workDuration: Math.max(1, 25) * 60,
		shortBreakDuration: Math.max(1, 5) * 60,
		longBreakDuration: Math.max(1, 15) * 60,
		sessionsBeforeLongBreak: Math.max(1, 4),
		autoCycle: !1
	};
function Ht(e) {
	const t = { ...$t, ...e };
	return (
		(t.workDuration = Math.max(1, Math.floor(t.workDuration / 60)) * 60),
		(t.shortBreakDuration = Math.max(1, Math.floor(t.shortBreakDuration / 60)) * 60),
		(t.longBreakDuration = Math.max(1, Math.floor(t.longBreakDuration / 60)) * 60),
		(t.sessionsBeforeLongBreak = Math.max(1, Math.floor(t.sessionsBeforeLongBreak))),
		t
	);
}
function Kn() {
	if (typeof window < 'u' && window.localStorage) {
		const e = localStorage.getItem(Vn);
		if (e)
			try {
				const t = JSON.parse(e);
				if (
					t &&
					typeof t.workDuration == 'number' &&
					typeof t.shortBreakDuration == 'number' &&
					typeof t.longBreakDuration == 'number' &&
					typeof t.sessionsBeforeLongBreak == 'number' &&
					typeof t.autoCycle == 'boolean'
				)
					return Ht(t);
				if (t)
					return (
						console.warn(
							'Partially invalid settings found in localStorage, attempting to sanitize.'
						),
						Ht(t)
					);
			} catch (t) {
				console.error('Error parsing timer settings from localStorage:', t);
			}
	}
	return Ht($t);
}
const Jo = Kn(),
	Qo = {
		currentSession: 'Work',
		timeRemaining: Jo.workDuration,
		isRunning: !1,
		currentCycleCount: 0
	},
	se = Yt(Kn()),
	J = Yt(Qo);
typeof window < 'u' &&
	window.localStorage &&
	se.subscribe((e) => {
		try {
			localStorage.setItem(Vn, JSON.stringify(e));
		} catch (t) {
			console.error('Error saving timer settings to localStorage:', t);
		}
	});
const ea = Ho(J, (e) => {
	const t = Math.floor(e.timeRemaining / 60),
		n = e.timeRemaining % 60;
	return `${String(t).padStart(2, '0')}:${String(n).padStart(2, '0')}`;
});
let te;
function qn() {
	const e = ae(J);
	if (e.isRunning && e.timeRemaining > 0) return;
	let t = e.timeRemaining;
	if (t <= 0) {
		const n = ae(se);
		switch (e.currentSession) {
			case 'Work':
				t = n.workDuration;
				break;
			case 'Short Break':
				t = n.shortBreakDuration;
				break;
			case 'Long Break':
				t = n.longBreakDuration;
				break;
		}
	}
	(J.update((n) => ({ ...n, isRunning: !0, timeRemaining: t })),
		te && clearInterval(te),
		(te = setInterval(() => {
			const n = ae(J);
			n.isRunning && n.timeRemaining > 0
				? J.update((i) => ({ ...i, timeRemaining: i.timeRemaining - 1 }))
				: n.isRunning && n.timeRemaining <= 0 && (te && clearInterval(te), (te = void 0), oa());
		}, 1e3)));
}
function ta() {
	(te && (clearInterval(te), (te = void 0)), J.update((e) => ({ ...e, isRunning: !1 })));
}
function na() {
	(te && (clearInterval(te), (te = void 0)),
		J.update((e) => {
			let t,
				n,
				i = e.currentCycleCount,
				o = $t;
			return (
				se.subscribe((s) => {
					o = s;
				})(),
				e.currentSession === 'Work'
					? (i++,
						i >= o.sessionsBeforeLongBreak
							? ((t = 'Long Break'), (n = o.longBreakDuration), (i = 0))
							: ((t = 'Short Break'), (n = o.shortBreakDuration)))
					: ((t = 'Work'), (n = o.workDuration)),
				{ ...e, currentSession: t, timeRemaining: n, isRunning: !1, currentCycleCount: i }
			);
		}));
}
function Zn(e) {
	te && (clearInterval(te), (te = void 0));
	const t = ae(se),
		n = e || ae(J).currentSession;
	let i = t.workDuration,
		o = ae(J).currentCycleCount;
	switch (n) {
		case 'Work':
			((i = t.workDuration), e === 'Work' && (o = 0));
			break;
		case 'Short Break':
			i = t.shortBreakDuration;
			break;
		case 'Long Break':
			i = t.longBreakDuration;
			break;
	}
	J.update((a) => ({
		...a,
		currentSession: n,
		timeRemaining: i,
		isRunning: !1,
		currentCycleCount: o
	}));
}
function fn(e) {
	J.update((t) => {
		if (t.isRunning) return t;
		const n = Math.max(60, e);
		return (
			se.update((i) => {
				const o = { ...i };
				switch (t.currentSession) {
					case 'Work':
						o.workDuration = n;
						break;
					case 'Short Break':
						o.shortBreakDuration = n;
						break;
					case 'Long Break':
						o.longBreakDuration = n;
						break;
				}
				return o;
			}),
			{ ...t, timeRemaining: n }
		);
	});
}
function oa() {
	const e = ae(J),
		t = ae(se);
	let n,
		i = e.currentCycleCount;
	(e.currentSession === 'Work'
		? (i++, i >= t.sessionsBeforeLongBreak ? ((n = 'Long Break'), (i = 0)) : (n = 'Short Break'))
		: (n = 'Work'),
		J.update((o) => ({ ...o, currentSession: n, isRunning: !1, currentCycleCount: i })),
		Zn(n),
		t.autoCycle && qn());
}
var aa = Ee(
		'<div class="flex flex-col items-center justify-center mx-2 scale-75 opacity-60 hover:opacity-100 transition-opacity"><button title="Increase minutes" aria-label="Increase minutes" class="p-1 text-gray-300 hover:text-teal-300 disabled:opacity-30"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg></button> <button title="Decrease minutes" aria-label="Decrease minutes" class="p-1 text-gray-300 hover:text-teal-300 disabled:opacity-30"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button></div>'
	),
	ia = Ee(
		'<div class="text-center mt-2 mb-8"><p class="text-xl font-semibold text-teal-400 mb-2" id="current-session-label"> </p> <div class="flex items-center justify-center text-8xl font-mono tracking-tighter text-gray-100 tabular-nums select-none relative svelte-oez0au" aria-live="polite" aria-atomic="true"><!> <span class="w-32 text-center"> </span> <span class="w-8 text-center">:</span> <span class="w-32 text-center"> </span></div> <div class="w-full bg-slate-700 rounded-full h-2.5 mt-6 overflow-hidden shadow-inner"><div class="bg-teal-500 h-2.5 rounded-full transition-all duration-1000 ease-linear" aria-valuemin="0" aria-valuemax="100" aria-labelledby="current-session-label" role="progressbar"></div></div></div>'
	);
function ra(e, t) {
	tt(t, !1);
	const [n, i] = Wt(),
		o = () => ke(J, '$timerState', n),
		a = () => ke(se, '$timerSettings', n),
		s = () => ke(ea, '$formattedTime', n),
		r = I(),
		f = I();
	let p = I(0);
	function m() {
		if (o().isRunning) return;
		const H = Math.floor(o().timeRemaining / 60),
			k = o().timeRemaining % 60,
			_ = (H + 1) * 60 + k;
		fn(_);
	}
	function v() {
		if (o().isRunning) return;
		const H = Math.floor(o().timeRemaining / 60),
			k = o().timeRemaining % 60,
			_ = Math.max(0, H - 1) * 60 + k;
		fn(_);
	}
	(ye(
		() => (o(), a()),
		() => {
			const H = o(),
				k = a();
			let _ = k.workDuration;
			(H.currentSession === 'Short Break'
				? (_ = k.shortBreakDuration)
				: H.currentSession === 'Long Break' && (_ = k.longBreakDuration),
				(_ = Math.max(1, _)),
				_ > 0
					? h(p, Math.max(0, 100 - (H.timeRemaining / _) * 100))
					: h(p, H.timeRemaining > 0 ? 0 : 100));
		}
	),
		ye(
			() => s(),
			() => {
				h(r, s().substring(0, 2));
			}
		),
		ye(
			() => s(),
			() => {
				h(f, s().substring(3, 5));
			}
		),
		Ut(),
		St());
	var y = ia(),
		d = M(y),
		u = M(d, !0);
	x(d);
	var A = b(d, 2),
		N = M(A);
	{
		var G = (H) => {
			var k = aa(),
				_ = M(k),
				L = b(_, 2);
			(x(k),
				qe(() => {
					((_.disabled = (o(), ee(() => o().isRunning))),
						(L.disabled =
							(o(),
							ee(
								() =>
									o().isRunning ||
									(o().timeRemaining < 120 &&
										o().timeRemaining % 60 === 0 &&
										o().timeRemaining / 60 <= 1) ||
									o().timeRemaining < 60
							))));
				}),
				C('click', _, m),
				C('click', L, v),
				Ie(H, k));
		};
		Un(N, (H) => {
			(o(), ee(() => !o().isRunning) && H(G));
		});
	}
	var D = b(N, 2),
		z = M(D, !0);
	x(D);
	var E = b(D, 4),
		w = M(E, !0);
	(x(E), x(A));
	var $ = b(A, 2),
		W = M($);
	(x($),
		x(y),
		qe(() => {
			(Be(u, (o(), ee(() => o().currentSession))),
				Be(z, l(r)),
				Be(w, l(f)),
				Ke(W, `width: ${l(p) ?? ''}%;`),
				Ze(W, 'aria-valuenow', l(p)));
		}),
		Ie(e, y),
		nt(),
		i());
}
var la =
		Ee(`<button class="px-6 py-3 text-base font-semibold rounded-md transition-all ease-in-out duration-150 
             bg-white/10 hover:bg-white/20 text-slate-200 hover:text-teal-300 border border-slate-400/30
             disabled:opacity-50 disabled:cursor-not-allowed
             focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900/50"> </button>`),
	sa =
		Ee(`<button class="px-6 py-3 text-base font-semibold rounded-md transition-all ease-in-out duration-150 
             bg-white/10 hover:bg-white/20 text-slate-200 hover:text-amber-300 border border-slate-400/30
             disabled:opacity-50 disabled:cursor-not-allowed
             focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900/50" aria-label="Pause timer">Pause</button>`),
	ca =
		Ee(`<div class="flex justify-center space-x-2 mt-6"><!> <button class="px-6 py-3 text-base font-semibold rounded-md transition-all ease-in-out duration-150 
           bg-white/10 hover:bg-white/20 text-slate-200 hover:text-sky-300 border border-slate-400/30
           disabled:opacity-50 disabled:cursor-not-allowed
           focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900/50" aria-label="Skip to next session" title="Skip to next session">Skip <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 inline ml-1 align-text-bottom"><path fill-rule="evenodd" d="M2 10a.75.75 0 0 1 .75-.75h12.59l-2.1-1.95a.75.75 0 1 1 1.02-1.1l3.5 3.25a.75.75 0 0 1 0 1.1l-3.5 3.25a.75.75 0 1 1-1.02-1.1l2.1-1.95H2.75A.75.75 0 0 1 2 10Z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M18 10a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1 0-1.5h.008A.75.75 0 0 1 18 10Z" clip-rule="evenodd"></path></svg></button> <button class="px-6 py-3 text-base font-semibold rounded-md transition-all ease-in-out duration-150 
           bg-white/10 hover:bg-white/20 text-slate-200 hover:text-rose-300 border border-slate-400/30
           disabled:opacity-50 disabled:cursor-not-allowed
           focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-slate-900/50" aria-label="Reset current session timer" title="Reset current session">Reset <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 inline ml-1 align-text-bottom"><path fill-rule="evenodd" d="M15.323 3.407a.75.75 0 0 1 0 1.06l-2.096 2.096A6.5 6.5 0 0 1 10 16.5a6.501 6.501 0 0 1-6.414-5.523.75.75 0 0 1 1.482-.236A5.001 5.001 0 0 0 10 15a5 5 0 0 0 4.19-2.402l-1.618 1.617a.75.75 0 1 1-1.06 1.061l3.25-3.25a.75.75 0 0 1 0-1.06l-3.25-3.25a.75.75 0 0 1-1.06 0Z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M4.677 12.593a.75.75 0 0 1 0-1.06l2.096-2.096A6.5 6.5 0 0 1 10 3.5a6.501 6.501 0 0 1 6.414 5.523.75.75 0 0 1-1.482.236A5.001 5.001 0 0 0 10 5a5 5 0 0 0-4.19 2.402l1.618-1.617a.75.75 0 1 1 1.06-1.061L5.238 8.075a.75.75 0 0 1 0 1.06l3.25 3.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"></path></svg></button></div>`);
function da(e, t) {
	tt(t, !1);
	const [n, i] = Wt(),
		o = () => ke(J, '$timerState', n),
		a = () => ke(se, '$timerSettings', n);
	let s = I();
	(ye(
		() => (o(), a()),
		() => {
			const d = o(),
				u = a();
			h(
				s,
				!d.timeRemaining ||
					(d.currentSession === 'Work' && d.timeRemaining === u.workDuration) ||
					(d.currentSession === 'Short Break' && d.timeRemaining === u.shortBreakDuration) ||
					(d.currentSession === 'Long Break' && d.timeRemaining === u.longBreakDuration)
			);
		}
	),
		Ut(),
		St());
	var r = ca(),
		f = M(r);
	{
		var p = (d) => {
				var u = la(),
					A = M(u, !0);
				(x(u),
					qe(() => {
						(Ze(u, 'aria-label', l(s) ? 'Start timer' : 'Resume timer'),
							Be(A, l(s) ? 'Start' : 'Resume'));
					}),
					C('click', u, function (...N) {
						qn?.apply(this, N);
					}),
					Ie(d, u));
			},
			m = (d) => {
				var u = sa();
				(C('click', u, function (...A) {
					ta?.apply(this, A);
				}),
					Ie(d, u));
			};
		Un(f, (d) => {
			(o(), ee(() => !o().isRunning) ? d(p) : d(m, !1));
		});
	}
	var v = b(f, 2),
		y = b(v, 2);
	(x(r),
		qe(() => {
			((v.disabled = (o(), ee(() => o().isRunning))),
				(y.disabled = (o(), l(s), ee(() => o().isRunning && l(s)))));
		}),
		C('click', v, function (...d) {
			na?.apply(this, d);
		}),
		C('click', y, function (...d) {
			Zn?.apply(this, d);
		}),
		Ie(e, r),
		nt(),
		i());
}
const mn = 20,
	ge = {
		gradientColor1: 'hsl(210, 70%, 25%)',
		gradientColor2: 'hsl(200, 68%, 27%)',
		isFloatingEnabled: !0,
		gradientColor1History: ['hsl(210, 70%, 25%)'],
		gradientColor1HistoryIndex: 0,
		gradientColor2History: ['hsl(200, 68%, 27%)'],
		gradientColor2HistoryIndex: 0,
		isAutoCyclingColor1: !1,
		isAutoCyclingColor2: !1
	};
function jn(e) {
	const t = Math.floor(Math.random() * 361),
		n = Math.floor(Math.random() * 51) + 50,
		i = 0,
		o = e?.maxLightness ?? 50,
		a = Math.max(i, o),
		s = Math.floor(Math.random() * (a - i + 1)) + i;
	return `hsl(${t}, ${n}%, ${s}%)`;
}
function ua(e) {
	if (!e) return null;
	const t = e.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
	return t ? { h: parseInt(t[1]), s: parseInt(t[2]), l: parseInt(t[3]) } : null;
}
function at(e) {
	const t = ua(e);
	if (!t) return (console.warn('Could not parse current HSL for controlled step:', e), e);
	const n = Math.random() * 36 - 18;
	let i;
	t.s <= 0
		? (i = Math.random() * 5)
		: t.s >= 100
			? (i = Math.random() * -5)
			: (i = Math.random() * 10 - 5);
	let o;
	t.l <= 0
		? (o = Math.random() * 3)
		: t.l >= 50
			? (o = Math.random() * -3)
			: (o = Math.random() * 6 - 3);
	const a = (t.h + n + 360) % 360,
		s = Math.max(0, Math.min(100, t.s + i)),
		r = Math.max(0, Math.min(50, t.l + o));
	return `hsl(${Math.round(a)}, ${Math.round(s)}%, ${Math.round(r)}%)`;
}
function ga() {
	let e = {
		...ge,
		gradientColor1History: [...ge.gradientColor1History],
		gradientColor2History: [...ge.gradientColor2History]
	};
	if (typeof localStorage < 'u') {
		const t = localStorage.getItem('backgroundSettings');
		if (t)
			try {
				const n = JSON.parse(t);
				((e = {
					...e,
					...n,
					isAutoCyclingColor1: n.isAutoCyclingColor1 ?? ge.isAutoCyclingColor1,
					isAutoCyclingColor2: n.isAutoCyclingColor2 ?? ge.isAutoCyclingColor2
				}),
					!n.gradientColor1History || n.gradientColor1History.length === 0
						? ((e.gradientColor1History = [e.gradientColor1]), (e.gradientColor1HistoryIndex = 0))
						: ((e.gradientColor1HistoryIndex = Math.max(
								0,
								Math.min(n.gradientColor1HistoryIndex ?? 0, n.gradientColor1History.length - 1)
							)),
							(e.gradientColor1 = n.gradientColor1History[e.gradientColor1HistoryIndex])),
					!n.gradientColor2History || n.gradientColor2History.length === 0
						? ((e.gradientColor2History = [e.gradientColor2]), (e.gradientColor2HistoryIndex = 0))
						: ((e.gradientColor2HistoryIndex = Math.max(
								0,
								Math.min(n.gradientColor2HistoryIndex ?? 0, n.gradientColor2History.length - 1)
							)),
							(e.gradientColor2 = n.gradientColor2History[e.gradientColor2HistoryIndex])));
			} catch (n) {
				return (
					console.error('Failed to parse background settings from localStorage', n),
					{
						...ge,
						gradientColor1History: [...ge.gradientColor1History],
						gradientColor2History: [...ge.gradientColor2History]
					}
				);
			}
	}
	return e;
}
const ha = ga(),
	U = Yt(ha);
typeof localStorage < 'u' &&
	U.subscribe((e) => {
		localStorage.setItem('backgroundSettings', JSON.stringify(e));
	});
function Jn(e, t, n) {
	let i = [...t];
	(n < i.length - 1 && (i = i.slice(0, n + 1)),
		i.push(e),
		i.length > mn && (i = i.slice(i.length - mn)));
	const o = i.length - 1;
	return { history: i, index: o };
}
function it(e) {
	const t = ae(U);
	if (t.gradientColor1 === e) return;
	const { history: n, index: i } = Jn(e, t.gradientColor1History, t.gradientColor1HistoryIndex);
	U.update((o) => ({
		...o,
		gradientColor1: e,
		gradientColor1History: n,
		gradientColor1HistoryIndex: i
	}));
}
function rt(e) {
	const t = ae(U);
	if (t.gradientColor2 === e) return;
	const { history: n, index: i } = Jn(e, t.gradientColor2History, t.gradientColor2HistoryIndex);
	U.update((o) => ({
		...o,
		gradientColor2: e,
		gradientColor2History: n,
		gradientColor2HistoryIndex: i
	}));
}
function fa() {
	return jn({ maxLightness: 50 });
}
function ma() {
	return jn({ maxLightness: 50 });
}
function pa() {
	U.update((e) => {
		if (e.gradientColor1HistoryIndex > 0) {
			const t = e.gradientColor1HistoryIndex - 1;
			return { ...e, gradientColor1: e.gradientColor1History[t], gradientColor1HistoryIndex: t };
		}
		return e;
	});
}
function ya() {
	U.update((e) => {
		if (e.gradientColor1HistoryIndex < e.gradientColor1History.length - 1) {
			const t = e.gradientColor1HistoryIndex + 1;
			return { ...e, gradientColor1: e.gradientColor1History[t], gradientColor1HistoryIndex: t };
		}
		return e;
	});
}
function va() {
	U.update((e) => {
		if (e.gradientColor2HistoryIndex > 0) {
			const t = e.gradientColor2HistoryIndex - 1;
			return { ...e, gradientColor2: e.gradientColor2History[t], gradientColor2HistoryIndex: t };
		}
		return e;
	});
}
function ba() {
	U.update((e) => {
		if (e.gradientColor2HistoryIndex < e.gradientColor2History.length - 1) {
			const t = e.gradientColor2HistoryIndex + 1;
			return { ...e, gradientColor2: e.gradientColor2History[t], gradientColor2HistoryIndex: t };
		}
		return e;
	});
}
function Sa() {
	U.set({
		...ge,
		gradientColor1History: [...ge.gradientColor1History],
		gradientColor2History: [...ge.gradientColor2History]
	});
}
function We() {
	U.update((e) => ({ ...e, isAutoCyclingColor1: !e.isAutoCyclingColor1 }));
}
function $e() {
	U.update((e) => ({ ...e, isAutoCyclingColor2: !e.isAutoCyclingColor2 }));
}
const Ma = {
		mouseMove: {
			maxRadius: 50,
			speed: 0.35,
			lineWidth: 1,
			initialOpacity: 0.35,
			color: 'rgb(100, 180, 255)',
			decayRate: 0.005
		},
		click: {
			maxRadius: 85,
			speed: 0.9,
			lineWidth: 2.2,
			initialOpacity: 0.95,
			color: 'rgb(190, 230, 255)',
			decayRate: 0.008
		},
		ambient: {
			maxRadius: 30,
			speed: 0.2,
			lineWidth: 1,
			initialOpacity: 0.15,
			color: 'rgb(150, 200, 255)',
			decayRate: 0.008
		},
		longPress: {
			maxRadius: 150,
			speed: 0.3,
			lineWidth: 3.5,
			initialOpacity: 0.85,
			color: 'rgb(70, 140, 220)',
			decayRate: 0.006
		},
		glintExpire: {
			maxRadius: 40,
			speed: 0.9,
			lineWidth: 1,
			initialOpacity: 0.6,
			color: 'rgba(255, 255, 230, 0.7)',
			decayRate: 0.02
		}
	},
	xa = 2e3,
	Qn = 128,
	wa = 16,
	_a = 0.05,
	Aa = 30,
	Ca = 400,
	Ia = 10,
	pn = 0.0011,
	ka = 0.003,
	eo = 3e3,
	Lt = 2,
	Ra = 15,
	Ea = 'rgba(255, 255, 234, 0.95)',
	to = 4,
	Ta = 1e3,
	yn = 3,
	vn = 0.15,
	Pa = 0.3,
	bn = 0.2,
	Oa = 0.5,
	Sn = 45,
	Da = 60,
	ut = 0.6,
	gt = 0.6,
	Mn = 1,
	Ha = 2.25,
	La = 600,
	xn = 0.05,
	Ga = 0.25,
	wn = 0.5,
	Ba = 1.25,
	_n = 0.25,
	Na = 0.55,
	Fa = 6e4,
	za = 5e3,
	Ve = [
		{ x1: 0, y1: 0, x2: 1, y2: 1 },
		{ x1: 0.5, y1: 0, x2: 0.5, y2: 1 },
		{ x1: 1, y1: 0, x2: 0, y2: 1 },
		{ x1: 1, y1: 0.5, x2: 0, y2: 0.5 },
		{ x1: 1, y1: 1, x2: 0, y2: 0 },
		{ x1: 0.5, y1: 1, x2: 0.5, y2: 0 },
		{ x1: 0, y1: 1, x2: 1, y2: 0 },
		{ x1: 0, y1: 0.5, x2: 1, y2: 0.5 }
	],
	no = 25e3,
	Xa = 0.55,
	Ya = 'rgba(235, 245, 255, 0.7)',
	Ua = 'rgba(210, 230, 245, 0.5)',
	An = 0.5,
	Wa = 1.5,
	Ge = 15,
	Cn = 5,
	$a = 12,
	In = 500,
	Va = 1e3,
	Ka = 0.2,
	lt = 0.02,
	Gt = 0.12,
	kn = 0.005,
	Bt = 0.05,
	Rn = 0.02,
	qa = 0.3,
	Nt = Math.PI / 4,
	En = 25,
	Za = 100,
	ja = 0.25,
	Tn = 10,
	Ja = Math.PI / 3,
	Qa = 2,
	Pn = 30,
	ei = 70,
	ti = 0.25,
	zt = {
		plane: {
			minSpeed: 0.25,
			maxSpeed: 0.5,
			minSize: 25,
			maxSize: 45,
			baseOpacity: 0.4,
			minDuration: 1e4,
			maxDuration: 2e4,
			chancePerInterval: 0.01
		},
		whaleShadow: {
			minSpeed: 0.18,
			maxSpeed: 0.32,
			minSize: 40,
			maxSize: 70,
			baseOpacity: 0.5,
			minDuration: 1200,
			maxDuration: 2500,
			chancePerInterval: 0.09
		}
	};
function ni(e) {
	const t = Math.max(0, Math.min(1, e));
	return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
const st = 15,
	ct = 0.04;
function oi(e, t, n) {
	const i = (e * ct + t * ct * 0.3 + n * 0.8) * Math.PI * 2,
		o = (e * ct * 0.7 - t * ct + n * 0.5) * Math.PI * 2,
		a = Math.sin(i) * st * 0.6 + Math.sin(o) * st * 0.4,
		s = Math.cos(i) * st * 0.4 + Math.cos(o) * st * 0.6;
	return { dx: a, dy: s };
}
let On = 0,
	Dn = 0,
	Hn = 0,
	ai = 0,
	Ln = 0,
	Gn = 0,
	ii = 0,
	Bn = 0;
const ht = [],
	ft = [],
	mt = [],
	oo = [],
	pt = [],
	yt = [],
	ao = [],
	vt = [],
	io = [],
	ro = [],
	lo = [],
	so = [],
	co = [],
	uo = [],
	go = [],
	ri = () => ht,
	Mt = () => ft,
	ho = () => mt,
	Vt = () => oo,
	Kt = () => pt,
	qt = () => yt,
	et = () => ao,
	bt = () => vt;
function li(e) {
	let t = io.pop();
	(t
		? ((t.x = e.x),
			(t.y = e.y),
			(t.radius = e.radius),
			(t.maxRadius = e.maxRadius),
			(t.opacity = e.opacity),
			(t.speed = e.speed),
			(t.lineWidth = e.lineWidth),
			(t.color = e.color),
			(t.isAmbient = e.isAmbient),
			(t.decayRate = e.decayRate),
			(t.id = On++))
		: (t = { ...e, id: On++ }),
		ht.push(t));
}
function si(e) {
	let t = uo.pop();
	(t
		? ((t.x = e.x),
			(t.y = e.y),
			(t.radius = e.radius),
			(t.currentMaxRadius = e.currentMaxRadius),
			(t.opacity = e.opacity),
			(t.growthSpeed = e.growthSpeed),
			(t.opacitySpeed = e.opacitySpeed),
			(t.color = e.color),
			(t.vx = e.vx),
			(t.vy = e.vy),
			(t.isWave = e.isWave),
			(t.relativeXInSpawn = e.relativeXInSpawn),
			(t.relativeYInSpawn = e.relativeYInSpawn),
			(t.baseVx = e.baseVx),
			(t.baseVy = e.baseVy),
			(t.id = Dn++))
		: (t = { ...e, id: Dn++ }),
		ft.push(t));
}
function ci(e) {
	let t = ro.pop();
	(t
		? ((t.x = e.x),
			(t.y = e.y),
			(t.radius = e.radius),
			(t.opacity = e.opacity),
			(t.decay = e.decay),
			(t.color = e.color),
			(t.id = Hn++))
		: (t = { ...e, id: Hn++ }),
		mt.push(t));
}
const di = (e) => {
	oo.push({ ...e, id: ai++ });
};
function ui(e) {
	let t = lo.pop();
	(t
		? ((t.x = e.x),
			(t.y = e.y),
			(t.radius = e.radius),
			(t.opacity = e.opacity),
			(t.decay = e.decay),
			(t.color = e.color),
			(t.id = Ln++))
		: (t = { ...e, id: Ln++ }),
		pt.push(t));
}
function gi(e) {
	let t = so.pop();
	(t
		? ((t.type = e.type),
			(t.x = e.x),
			(t.y = e.y),
			(t.vx = e.vx),
			(t.vy = e.vy),
			(t.size = e.size),
			(t.opacity = e.opacity),
			(t.age = 0),
			(t.maxAge = e.maxAge),
			e.type === 'whaleShadow'
				? ((t.bodyAngle = e.bodyAngle ?? 0),
					(t.bodyAngleSpeed = e.bodyAngleSpeed),
					(t.bodyAngleAmplitude = e.bodyAngleAmplitude),
					(t.tailAngleOffset = e.tailAngleOffset ?? 0),
					(t.tailOscillationSpeed = e.tailOscillationSpeed),
					(t.tailOscillationAmplitude = e.tailOscillationAmplitude))
				: (delete t.bodyAngle,
					delete t.bodyAngleSpeed,
					delete t.bodyAngleAmplitude,
					delete t.tailAngleOffset,
					delete t.tailOscillationSpeed,
					delete t.tailOscillationAmplitude),
			(t.id = Gn++))
		: (t = { ...e, age: 0, id: Gn++ }),
		yt.push(t));
}
const hi = (e) => {
	ao.push({ ...e, id: ii++ });
};
function fi(e) {
	let t = co.pop();
	(t
		? ((t.anchorX = e.anchorX),
			(t.anchorY = e.anchorY),
			(t.particles = []),
			(t.vx = e.vx),
			(t.vy = e.vy),
			(t.opacity = 0),
			(t.age = 0),
			(t.maxAge = e.maxAge),
			(t.color = e.color),
			(t.id = Bn++))
		: (t = { ...e, particles: [], opacity: 0, age: 0, id: Bn++ }),
		vt.push(t));
}
function mi(e, t) {
	let n = go.pop();
	(n
		? ((n.x = t.x),
			(n.y = t.y),
			(n.size = t.size),
			(n.opacity = 0),
			(n.initialRelativeX = t.initialRelativeX),
			(n.initialRelativeY = t.initialRelativeY),
			(n.appearAtAge = t.appearAtAge),
			(n.maxOpacity = t.maxOpacity),
			(n.particleAge = 0),
			(n.particleMaxAge = t.particleMaxAge))
		: (n = { ...t, opacity: 0, particleAge: 0 }),
		e.particles.push(n));
}
function pi(e) {
	const t = ht.findIndex((n) => n.id === e.id);
	if (t !== -1) {
		const n = ht.splice(t, 1)[0];
		n && io.push(n);
	} else console.warn(`Attempted to release ripple with ID ${e.id} not found in active list.`);
}
function yi() {
	if (ft.length > 0) {
		const e = ft.shift();
		if (e) return (uo.push(e), e);
	}
	return null;
}
function vi(e) {
	const t = mt.findIndex((n) => n.id === e.id);
	if (t !== -1) {
		const n = mt.splice(t, 1)[0];
		n && ro.push(n);
	} else console.warn(`Attempted to release glint with ID ${e.id} not found in active list.`);
}
function bi(e) {
	const t = pt.findIndex((n) => n.id === e.id);
	if (t !== -1) {
		const n = pt.splice(t, 1)[0];
		n && lo.push(n);
	} else console.warn(`Attempted to release sunGlint with ID ${e.id} not found in active list.`);
}
function Si(e) {
	const t = yt.findIndex((n) => n.id === e.id);
	if (t !== -1) {
		const n = yt.splice(t, 1)[0];
		n && so.push(n);
	} else
		console.warn(`Attempted to release rareSighting with ID ${e.id} not found in active list.`);
}
function fo(e) {
	go.push(e);
}
function Xt(e) {
	const t = vt.findIndex((n) => n.id === e.id);
	if (t !== -1) {
		const n = vt.splice(t, 1)[0];
		if (n) {
			for (const i of n.particles) fo(i);
			((n.particles = []), co.push(n));
		}
	} else console.warn(`Attempted to release foamStreak with ID ${e.id} not found in active list.`);
}
function Je(e, t, n) {
	const i = Ma[n];
	if (!i)
		throw (
			console.error(`Unknown ripple type: ${n}. Ensure it is defined in RIPPLE_CONFIG.`),
			new Error(`Unknown ripple type: ${n}`)
		);
	let o = i.speed,
		a = i.maxRadius;
	((n === 'mouseMove' || n === 'click') &&
		((o = i.speed * (0.9 + Math.random() * 0.2)), (a = i.maxRadius * (0.9 + Math.random() * 0.2))),
		li({
			x: e,
			y: t,
			radius: 0,
			maxRadius: a,
			opacity: i.initialOpacity,
			speed: o,
			lineWidth: i.lineWidth,
			color: i.color,
			isAmbient: n === 'ambient',
			decayRate: i.decayRate
		}));
}
function Mi(e) {
	const t = e.globalAlpha,
		n = ri();
	for (let i = n.length - 1; i >= 0; i--) {
		const o = n[i];
		if (
			((o.radius += o.speed), (o.opacity -= o.decayRate), o.opacity <= 0 || o.radius >= o.maxRadius)
		) {
			pi(o);
			continue;
		}
		(e.beginPath(),
			e.arc(o.x, o.y, o.radius, 0, Math.PI * 2),
			(e.lineWidth = o.lineWidth),
			(e.strokeStyle = o.color),
			(e.globalAlpha = Math.max(0, o.opacity)),
			e.stroke());
	}
	e.globalAlpha = t;
}
function Nn(e, t, n) {
	Mt().length >= Qn && yi();
	let i,
		o,
		a,
		s,
		r,
		f,
		p,
		m = 1;
	const v = (e * (1 - ut)) / 2,
		y = e * ut,
		d = (t * (1 - gt)) / 2,
		u = t * gt,
		A = v + Math.random() * y,
		N = d + Math.random() * u;
	(n
		? ((i = (Math.min(e, t) / 2) * (0.8 + Math.random() * 0.4)),
			(m = bn + Math.random() * (Oa - bn)),
			(o = (Math.random() - 0.5) * 0.2 * m),
			(a = (Math.random() - 0.5) * 0.2 * m),
			(s = vn + Math.random() * (Pa - vn)),
			(r = (Math.random() * 0.015 + 0.005) * (Math.random() < 0.5 ? 1 : -1) * m),
			(f = (Math.random() * 15e-5 + 5e-5) * (Math.random() < 0.5 ? 1 : -1) * m),
			(p = `hsl(210, ${68 + Math.random() * 10}%, ${Sn + Math.random() * (Da - Sn)}%)`))
		: ((i = Math.random() * 80 + 40),
			(o = (Math.random() - 0.5) * 0.12),
			(a = (Math.random() - 0.5) * 0.12),
			(s = Math.random() * 0.03 + 0.01),
			(r = (Math.random() * 0.02 + 0.01) * (Math.random() < 0.5 ? 1 : -1)),
			(f = (Math.random() * 2e-4 + 1e-4) * (Math.random() < 0.5 ? 1 : -1)),
			(p = `hsl(${200 + Math.random() * 20}, ${65 + Math.random() * 20}%, ${35 + Math.random() * 30}%)`)),
		si({
			x: A,
			y: N,
			radius: Math.random() * i * 0.3 + i * 0.2,
			currentMaxRadius: i,
			opacity: s,
			growthSpeed: r,
			opacitySpeed: f,
			color: p,
			vx: o,
			vy: a,
			isWave: n,
			relativeXInSpawn: y > 0 ? (A - v) / y : 0.5,
			relativeYInSpawn: u > 0 ? (N - d) / u : 0.5,
			baseVx: o,
			baseVy: a
		}));
}
function xi(e, t, n, i) {
	const o = Mt();
	if (o.length === 0) return;
	const a = e.globalCompositeOperation;
	e.globalCompositeOperation = 'screen';
	for (let s = o.length - 1; s >= 0; s--) {
		const r = o[s];
		((r.x += r.vx),
			(r.y += r.vy),
			(r.radius += r.growthSpeed),
			(r.opacity += r.opacitySpeed),
			(r.opacity > 0.06 || r.opacity < 0.005) &&
				((r.opacitySpeed *= -1), (r.opacity = Math.max(0.005, Math.min(0.06, r.opacity)))),
			(r.radius > r.currentMaxRadius || r.radius < r.currentMaxRadius * 0.2) &&
				((r.growthSpeed *= -1), (r.radius = Math.max(10, Math.min(r.currentMaxRadius, r.radius)))),
			(r.x - r.radius < 0 || r.x + r.radius > t) &&
				((r.vx *= -1), (r.x = Math.max(r.radius, Math.min(t - r.radius, r.x)))),
			(r.y - r.radius < 0 || r.y + r.radius > n) &&
				((r.vy *= -1), (r.y = Math.max(r.radius, Math.min(n - r.radius, r.y)))));
		const f = oi(r.x, r.y, i),
			p = r.x + f.dx,
			m = r.y + f.dy,
			v = e.createRadialGradient(p, m, 0, p, m, r.radius),
			y = r.color.substring(0, r.color.lastIndexOf(')'));
		(v.addColorStop(0, `${y}, ${r.opacity})`),
			v.addColorStop(0.7, `${y}, ${r.opacity * 0.5})`),
			v.addColorStop(1, `${y}, 0)`),
			(e.fillStyle = v),
			e.beginPath(),
			e.arc(p, m, r.radius, 0, Math.PI * 2),
			e.fill());
	}
	e.globalCompositeOperation = a;
}
function wi(e, t) {
	const n = Mt();
	if (n.length === 0) return;
	const i = (e * (1 - ut)) / 2,
		o = e * ut,
		a = (t * (1 - gt)) / 2,
		s = t * gt,
		r = i + o / 2,
		f = a + s / 2,
		p = Math.sqrt(Math.pow(o / 2, 2) + Math.pow(s / 2, 2)) + 0.001;
	for (const m of n) {
		const v = m.relativeXInSpawn !== void 0 ? m.relativeXInSpawn : Math.random(),
			y = m.relativeYInSpawn !== void 0 ? m.relativeYInSpawn : Math.random();
		if (((m.x = i + v * o), (m.y = a + y * s), m.baseVx !== void 0 && m.baseVy !== void 0)) {
			const d = Math.sqrt(Math.pow(m.x - r, 2) + Math.pow(m.y - f, 2)),
				u = Math.min(1, d / p),
				A = Mn + u * (Ha - Mn);
			((m.vx = m.baseVx * A), (m.vy = m.baseVy * A));
		}
		if (m.isWave) {
			const d = (Math.min(e, t) / 2) * (0.8 + Math.random() * 0.4);
			((m.currentMaxRadius = d), (m.radius = Math.random() * d * 0.3 + d * 0.2));
		}
	}
}
const Fn = [
	[0, 0],
	[0, 1],
	[0, 2],
	[1, 0],
	[1, 1],
	[1, 1],
	[1, 1],
	[1, 1],
	[1, 1],
	[1, 1],
	[1, 2],
	[2, 0],
	[2, 1],
	[2, 2]
];
function mo(e, t) {
	const n = Fn[Math.floor(Math.random() * Fn.length)],
		i = n[0],
		o = n[1],
		a = e / 3,
		s = t / 3,
		r = o * a + Math.random() * a,
		f = i * s + Math.random() * s;
	return { x: r, y: f };
}
function _i(e, t, n) {
	if (Kt().length >= eo) return;
	const i = Math.random() * Math.PI * 2,
		o = Math.random() * n * 0.5;
	ui({
		x: e + Math.cos(i) * o,
		y: t + Math.sin(i) * o,
		radius: Math.random() * 0.6 + 0.4,
		opacity: Math.random() * 0.3 + 0.7,
		decay: Math.random() * 0.008 + 0.002,
		color: Ea
	});
}
function Ai(e, t) {
	const n = Math.min(e, t),
		{ x: i, y: o } = mo(e, t);
	di({
		x: i,
		y: o,
		baseRadius: n * 0.45,
		radiusAmplitude: n * 0.12,
		currentRadius: n * 0.45,
		baseOpacity: 0.35,
		opacityAmplitude: 0.3,
		currentOpacity: 0.35,
		pulseAngle: Math.random() * Math.PI * 2,
		pulseSpeed: pn + Math.random() * (ka - pn),
		vx: 0,
		vy: 0,
		relativeX: i / e,
		relativeY: o / t
	});
}
function Ci(e) {
	const t = Kt();
	if (t.length === 0) return;
	const n = e.globalAlpha;
	for (let i = t.length - 1; i >= 0; i--) {
		const o = t[i];
		((o.x += (Math.random() - 0.5) * 0.5),
			(o.y += (Math.random() - 0.5) * 0.5),
			(o.opacity -= o.decay),
			(o.radius += 0.005),
			o.opacity <= 0
				? bi(o)
				: (e.beginPath(),
					e.arc(o.x, o.y, o.radius, 0, Math.PI * 2),
					(e.fillStyle = o.color),
					(e.globalAlpha = Math.max(0, o.opacity)),
					e.fill()));
	}
	e.globalAlpha = n;
}
function Ii(e) {
	const t = Vt();
	if (t.length === 0) return;
	const n = e.globalCompositeOperation;
	e.globalCompositeOperation = 'lighter';
	const i = e.globalAlpha;
	for (let o = 0; o < t.length; o++) {
		const a = t[o];
		((a.pulseAngle += a.pulseSpeed),
			(a.currentRadius = a.baseRadius + Math.sin(a.pulseAngle) * a.radiusAmplitude),
			(a.currentOpacity =
				a.baseOpacity +
				(Math.sin(a.pulseAngle * 0.7 + Math.PI / 3) * 0.5 + 0.5) * a.opacityAmplitude),
			(a.currentOpacity = Math.max(0, Math.min(1, a.currentOpacity))));
		const s = a.baseOpacity + a.opacityAmplitude,
			r = s > 0 ? Math.max(0, a.currentOpacity / s) : 0,
			f = s > 0 ? a.baseOpacity / s : 0;
		let p = 0;
		if (r > 0)
			if (r <= f) {
				const v = f > 0 ? r / f : 0;
				p = Math.round(v * Lt);
			} else {
				const v = 1 - f,
					y = v > 0 ? (r - f) / v : 1;
				p = Math.round(Lt + y * (Ra - Lt));
			}
		p = Math.max(0, p);
		for (let v = 0; v < p && (_i(a.x, a.y, a.currentRadius), !(Kt().length >= eo)); v++);
		const m = e.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.currentRadius);
		(m.addColorStop(0, `rgba(255, 250, 220, ${a.currentOpacity})`),
			m.addColorStop(0.25, `rgba(255, 235, 180, ${a.currentOpacity * 0.8})`),
			m.addColorStop(0.6, `rgba(255, 220, 150, ${a.currentOpacity * 0.4})`),
			m.addColorStop(1, 'rgba(255, 210, 130, 0)'),
			(e.fillStyle = m),
			(e.globalAlpha = 1),
			e.beginPath(),
			e.arc(a.x, a.y, a.currentRadius, 0, Math.PI * 2),
			e.fill());
	}
	((e.globalCompositeOperation = n), (e.globalAlpha = i));
}
function ki(e, t) {
	const n = Vt();
	if (n.length === 0) return;
	const i = Math.min(e, t);
	for (const o of n) {
		if (o.relativeX !== void 0 && o.relativeY !== void 0)
			((o.x = o.relativeX * e), (o.y = o.relativeY * t));
		else {
			console.warn('SunGlow missing relative coordinates during resize. Recalculating position.');
			const { x: a, y: s } = mo(e, t);
			((o.x = a), (o.y = s), (o.relativeX = a / e), (o.relativeY = s / t));
		}
		((o.baseRadius = i * 0.45), (o.radiusAmplitude = i * 0.12));
	}
}
function Ri(e, t) {
	ho().length >= wa ||
		ci({
			x: Math.random() * e,
			y: Math.random() * t,
			radius: Math.random() * 0.25 + 0.2,
			opacity: Math.random() * 0.4 + 0.2,
			decay: Math.random() * 0.005 + 0.005,
			color: 'rgba(255, 255, 230, 0.85)'
		});
}
function Ei(e) {
	const t = ho();
	if (t.length === 0) return [];
	const n = [],
		i = e.globalAlpha;
	for (let o = t.length - 1; o >= 0; o--) {
		const a = t[o];
		((a.opacity -= a.decay),
			a.opacity <= 0
				? (n.push({ x: a.x, y: a.y }), vi(a))
				: (e.beginPath(),
					e.arc(a.x, a.y, a.radius, 0, Math.PI * 2),
					(e.fillStyle = a.color),
					(e.globalAlpha = Math.max(0, a.opacity)),
					e.fill()));
	}
	return ((e.globalAlpha = i), n);
}
function Ti(e, t) {
	(e.fillRect(t.x - t.size / 2, t.y - t.size / 8, t.size, t.size / 4),
		e.fillRect(t.x - t.size / 6, t.y - t.size / 3, t.size / 3, t.size * 0.8));
}
function Pi(e, t) {
	(t.bodyAngleSpeed &&
		t.bodyAngleAmplitude &&
		(t.bodyAngle = Math.sin(t.age * t.bodyAngleSpeed) * t.bodyAngleAmplitude),
		t.tailOscillationSpeed &&
			t.tailOscillationAmplitude &&
			(t.tailAngleOffset = Math.sin(t.age * t.tailOscillationSpeed) * t.tailOscillationAmplitude));
	const o = t.size * (1 + Math.sin(t.age * 0.02) * 0.05),
		a = o / 3.5,
		s = a * 0.9,
		r = o * 0.3;
	(e.save(),
		e.translate(t.x, t.y),
		e.rotate(t.bodyAngle || 0),
		e.beginPath(),
		e.ellipse(0, 0, o / 2, a / 2, 0, 0, Math.PI * 2),
		e.fill());
	const f = (-o / 2) * 0.85,
		p = 0;
	(e.save(),
		e.translate(f, p),
		e.rotate(t.tailAngleOffset || 0),
		e.beginPath(),
		e.ellipse(0, 0, r / 2, s / 2, 0, 0, Math.PI * 2),
		e.fill(),
		e.restore(),
		e.restore());
}
function Oi(e, t, n) {
	if (qt().length >= to) return;
	const i = n,
		o = zt[i];
	if (!o) {
		console.warn(`Configuration not found for rare sighting type: ${i}`);
		return;
	}
	let a, s, r, f;
	const p = o.minSpeed + Math.random() * (o.maxSpeed - o.minSpeed);
	switch (i) {
		case 'plane':
			((a = Math.random() < 0.5 ? -o.maxSize : e + o.maxSize),
				(s = Math.random() * t * 0.3),
				(r = (a < 0 ? 1 : -1) * p),
				(f = (Math.random() - 0.5) * p * 0.3));
			break;
		case 'whaleShadow':
			((a = Math.random() < 0.5 ? -o.maxSize * 1.5 : e + o.maxSize * 1.5),
				(s = t * (0.5 + Math.random() * 0.4)),
				(r = (a < 0 ? 1 : -1) * p),
				(f = (Math.random() - 0.5) * p * 0.1));
			break;
		default:
			console.warn(`Unhandled rare sighting type for creation: ${i}`);
			return;
	}
	const m = {
		type: i,
		x: a,
		y: s,
		vx: r,
		vy: f,
		size: o.minSize + Math.random() * (o.maxSize - o.minSize),
		opacity: o.baseOpacity,
		age: 0,
		maxAge: o.minDuration + Math.random() * (o.maxDuration - o.minDuration),
		...(i === 'whaleShadow'
			? {
					bodyAngle: 0,
					bodyAngleSpeed: (Math.random() * 0.003 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
					bodyAngleAmplitude: Math.PI / 36,
					tailAngleOffset: 0,
					tailOscillationSpeed: Math.random() * 0.04 + 0.03,
					tailOscillationAmplitude: Math.PI / 10
				}
			: {})
	};
	gi(m);
}
function Di(e, t, n) {
	const i = qt();
	if (i.length === 0) return;
	const o = e.globalAlpha;
	for (let a = i.length - 1; a >= 0; a--) {
		const s = i[a];
		(s.age++, (s.x += s.vx), (s.y += s.vy));
		const r = s.size * 2,
			f = s.age > s.maxAge,
			p = s.x < -r || s.x > t + r || s.y < -r || s.y > n + r;
		if (f || p) {
			Si(s);
			continue;
		}
		let m = s.opacity;
		const v = 0.8;
		if (s.age / s.maxAge > v) {
			const y = (s.age / s.maxAge - v) / (1 - v);
			m = s.opacity * (1 - y);
		}
		switch (
			((m = Math.max(0, m)),
			(e.globalAlpha = m),
			(e.fillStyle = `rgba(10, 10, 20, ${m * 0.7})`),
			s.type)
		) {
			case 'plane':
				Ti(e, s);
				break;
			case 'whaleShadow':
				Pi(e, s);
				break;
			default:
				console.warn(`No drawing function implemented for rare sighting type: ${s.type}`);
		}
	}
	e.globalAlpha = o;
}
function Hi(e, t) {
	if (et().length > 0) {
		console.warn('Attempted to re-initialize water grains. Skipping.');
		return;
	}
	for (let n = 0; n < La; n++) {
		const i = xn + Math.random() * (Ga - xn),
			o = Math.random() * Math.PI * 2,
			a = 20 + Math.random() * 10,
			s = Math.random() * e,
			r = Math.random() * t;
		hi({
			x: s,
			y: r,
			vx: Math.cos(o) * i,
			vy: Math.sin(o) * i,
			size: wn + Math.random() * (Ba - wn),
			opacity: _n + Math.random() * (Na - _n),
			color: `hsl(210, ${65 + Math.random() * 10}%, ${a}%)`,
			relativeX: e > 0 ? s / e : 0.5,
			relativeY: t > 0 ? r / t : 0.5
		});
	}
	console.log(`Initialized ${et().length} water grains.`);
}
function Li(e, t, n) {
	const i = et();
	if (i.length === 0) return;
	const o = e.globalAlpha;
	for (const a of i)
		((a.x += a.vx),
			(a.y += a.vy),
			a.x < -a.size ? (a.x = t + a.size) : a.x > t + a.size && (a.x = -a.size),
			a.y < -a.size ? (a.y = n + a.size) : a.y > n + a.size && (a.y = -a.size),
			e.beginPath(),
			e.arc(a.x, a.y, a.size, 0, Math.PI * 2),
			(e.fillStyle = a.color),
			(e.globalAlpha = Math.max(0, a.opacity * o)),
			e.fill());
	e.globalAlpha = o;
}
function Gi(e, t) {
	const n = et();
	if (n.length !== 0)
		for (const i of n)
			i.relativeX !== void 0 && i.relativeY !== void 0
				? ((i.x = i.relativeX * e), (i.y = i.relativeY * t))
				: (console.warn(
						'WaterGrain missing relative coordinates during resize. Re-randomizing position.'
					),
					(i.x = Math.random() * e),
					(i.y = Math.random() * t),
					(i.relativeX = e > 0 ? i.x / e : 0.5),
					(i.relativeY = t > 0 ? i.y / t : 0.5));
}
function Bi(e, t) {
	if (bt().length >= no) return;
	const n = Math.floor(Math.random() * 3);
	let i, o, a, s, r;
	n === 0
		? ((i = Math.random() * e),
			(o = -Ge),
			(a = (Math.random() - 0.5) * Gt * 0.5),
			(s = kn + Math.random() * (Bt - kn)),
			(r = Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 6)))
		: n === 1
			? ((i = -Ge),
				(o = Math.random() * t),
				(a = lt + Math.random() * (Gt - lt)),
				(s = (Math.random() - 0.5) * Bt * 0.4),
				(r = (Math.random() - 0.5) * (Math.PI / 4)))
			: ((i = e + Ge),
				(o = Math.random() * t),
				(a = -(lt + Math.random() * (Gt - lt))),
				(s = (Math.random() - 0.5) * Bt * 0.4),
				(r = Math.PI + (Math.random() - 0.5) * (Math.PI / 4)));
	let f = 0;
	const p = (d, u, A, N, G, D) => {
			let z = u,
				E = A,
				w = N;
			for (let $ = 0; $ < G; $++) {
				const W = Cn + Math.random() * ($a - Cn);
				if (((w += (Math.random() - 0.5) * 2 * Nt), D)) {
					const _ = ((w - N + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
					Math.abs(_) > Nt * 1.5 && (w = N + Math.sign(_) * Nt * 1.5);
				} else
					n === 0
						? (w = Math.max(Math.PI / 4, Math.min((3 * Math.PI) / 4, w)))
						: n === 1
							? (w = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, w)))
							: (w = Math.max((2 * Math.PI) / 3, Math.min((4 * Math.PI) / 3, w)));
				const H = z + Math.cos(w) * W,
					k = E + Math.sin(w) * W;
				for (let _ = 0; _ < Qa; _++) {
					const L = An + Math.random() * (Wa - An),
						X = w + Math.PI / 2,
						S = (Math.random() - 0.5) * Ge * 0.8,
						F = z + Math.cos(X) * S,
						P = E + Math.sin(X) * S;
					mi(d, {
						x: F,
						y: P,
						initialRelativeX: F,
						initialRelativeY: P,
						size: L,
						opacity: 0,
						appearAtAge: f++ * qa,
						maxOpacity: 0.5 + Math.random() * 0.4,
						particleAge: 0,
						particleMaxAge: Pn + Math.random() * (ei - Pn)
					});
				}
				if (((z = H), (E = k), !D && Math.random() < ja && $ < G - Tn / 2 && $ > 2)) {
					const _ = (Math.random() < 0.5 ? -1 : 1) * Ja * (0.7 + Math.random() * 0.6),
						L = Math.floor(Tn * (0.5 + Math.random() * 0.5));
					p(d, z, E, w + _, L, !0);
				}
			}
		},
		m = En + Math.floor(Math.random() * (Za - En + 1));
	p(0, 0, r, m, !1);
	const v = {
		anchorX: i,
		anchorY: o,
		particles: [],
		vx: a,
		vy: s,
		opacity: 0,
		age: 0,
		maxAge: In + Math.random() * (Va - In),
		color: Math.random() < 0.6 ? Ya : Ua
	};
	fi(v);
	const y = bt().find((d) => d.anchorX === i && d.anchorY === o && d.age === 0);
	if (y) {
		if ((p(y, 0, 0, r, m, !1), y.particles.length < 5)) {
			Xt(y);
			return;
		}
	} else console.warn('Could not find newly added streak to generate particles into.');
}
function Ni(e, t, n) {
	const i = bt();
	if (i.length === 0) return;
	const o = e.globalAlpha,
		a = e.globalCompositeOperation;
	e.globalCompositeOperation = 'lighter';
	for (let s = i.length - 1; s >= 0; s--) {
		const r = i[s];
		(r.age++, (r.anchorX += r.vx), (r.anchorY += r.vy));
		const f = r.maxAge * Ka;
		if (
			(r.age < f
				? (r.opacity = r.age / f)
				: r.age > r.maxAge - f
					? (r.opacity = 1 - (r.age - (r.maxAge - f)) / f)
					: (r.opacity = 1),
			(r.opacity = Math.max(0, Math.min(1, r.opacity))),
			r.opacity <= 0 && r.age > f)
		) {
			Xt(r);
			continue;
		}
		let p = !0;
		const m = Ge * 5,
			v = Ge * 5;
		if (r.anchorX > -m && r.anchorX < t + m && r.anchorY > -v && r.anchorY < n + v) p = !1;
		else {
			p = !0;
			for (const y of r.particles) {
				const d = r.anchorX + y.x,
					u = r.anchorY + y.y;
				if (d > -y.size && d < t + y.size && u > -y.size && u < n + y.size) {
					p = !1;
					break;
				}
			}
		}
		if (p && r.age > f * 2) {
			Xt(r);
			continue;
		}
		e.fillStyle = r.color;
		for (let y = r.particles.length - 1; y >= 0; y--) {
			const d = r.particles[y];
			if (r.age < d.appearAtAge) continue;
			if ((d.particleAge++, d.particleAge > d.particleMaxAge)) {
				((d.opacity = 0), fo(d), r.particles.splice(y, 1));
				continue;
			} else {
				const w = d.particleMaxAge * ti;
				(d.particleAge < w
					? (d.opacity = (d.particleAge / w) * d.maxOpacity)
					: d.particleAge > d.particleMaxAge - w
						? (d.opacity = (1 - (d.particleAge - (d.particleMaxAge - w)) / w) * d.maxOpacity)
						: (d.opacity = d.maxOpacity),
					(d.opacity = Math.max(0, Math.min(d.maxOpacity, d.opacity))));
			}
			if (d.opacity <= 0.001) continue;
			((d.x += (Math.random() - 0.5) * Rn), (d.y += (Math.random() - 0.5) * Rn));
			const u = d.x - d.initialRelativeX,
				A = d.y - d.initialRelativeY,
				N = u * u + A * A,
				G = Ge * 0.5;
			if (N > G * G) {
				const w = Math.sqrt(N);
				((d.x = d.initialRelativeX + (u / w) * G), (d.y = d.initialRelativeY + (A / w) * G));
			}
			const D = r.anchorX + d.x,
				z = r.anchorY + d.y,
				E = r.opacity * d.opacity;
			E <= 0.001 ||
				((e.globalAlpha = E * o), e.beginPath(), e.arc(D, z, d.size, 0, Math.PI * 2), e.fill());
		}
	}
	((e.globalCompositeOperation = a), (e.globalAlpha = o));
}
var Fi = Ee(
	'<canvas class="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none svelte-65deai"></canvas>'
);
function zi(e, t) {
	tt(t, !1);
	let n = ue(t, 'gradientColor1', 8, 'hsl(210, 70%, 25%)'),
		i = ue(t, 'gradientColor2', 8, 'hsl(200, 68%, 27%)'),
		o = I(),
		a,
		s = 0,
		r = 0,
		f = 0,
		p = 1,
		m = 0,
		v = { ...Ve[0] },
		y = 0;
	(Xn(() => {
		const u = l(o);
		if (!u) {
			console.error('Canvas not available onMount');
			return;
		}
		const A = u.getContext('2d');
		if (!A) {
			console.error('Context not available onMount');
			return;
		}
		(L(), console.log(`[onMount after initial resize] Canvas: ${u.width}x${u.height}`));
		let N = 0,
			G = 0,
			D = null,
			z,
			E = !1,
			w = 0;
		function $() {
			const S = Date.now();
			if (
				(m === 0 && ((m = S), (y = S), (f = (r + 1) % Ve.length), (p = 0)),
				S - m >= Fa && p >= 1 && ((r = f), (f = (r + 1) % Ve.length), (p = 0), (m = S), (y = S)),
				p < 1)
			) {
				const F = S - y;
				p = Math.min(1, F / za);
				const P = ni(p),
					B = Ve[r],
					q = Ve[f];
				((v.x1 = B.x1 + (q.x1 - B.x1) * P),
					(v.y1 = B.y1 + (q.y1 - B.y1) * P),
					(v.x2 = B.x2 + (q.x2 - B.x2) * P),
					(v.y2 = B.y2 + (q.y2 - B.y2) * P));
			} else ((v = { ...Ve[f] }), (r = f));
		}
		const W = (S) => {
				if (D) {
					if (!E) {
						const P = S.pageX - D.x,
							B = S.pageY - D.y;
						Math.sqrt(P * P + B * B) > Ia && (E = !0);
					}
					const F = Date.now();
					F - N > Aa && (Je(S.pageX, S.pageY, 'mouseMove'), (N = F));
				}
			},
			H = (S) => {
				((G = Date.now()), (D = { x: S.pageX, y: S.pageY }), (E = !1));
			},
			k = (S) => {
				if (!D || G === 0) return;
				const F = Date.now() - G;
				(E || (F >= Ca ? Je(S.pageX, S.pageY, 'longPress') : Je(S.pageX, S.pageY, 'mouseMove')),
					(D = null),
					(G = 0),
					(E = !1));
			},
			_ = () => {
				u && Je(Math.random() * u.width, Math.random() * u.height, 'ambient');
			};
		function L() {
			u &&
				((u.width = window.innerWidth),
				(u.height = window.innerHeight),
				console.log(`[resizeCanvas] Canvas: ${u.width}x${u.height}`),
				wi(u.width, u.height),
				ki(u.width, u.height),
				Gi(u.width, u.height));
		}
		if (
			(window.addEventListener('resize', L),
			window.addEventListener('mousemove', W),
			window.addEventListener('mousedown', H),
			window.addEventListener('mouseup', k),
			typeof window < 'u' && (z = window.setInterval(_, xa)),
			u)
		) {
			for (let S = 0; S < Qn - yn; S++) Nn(u.width, u.height, !1);
			for (let S = 0; S < yn; S++) Nn(u.width, u.height, !0);
			(Ai(u.width, u.height), Hi(u.width, u.height));
		}
		console.log(
			`[onMount End] Canvas: ${u.width}x${u.height}, ShimmerSpots: ${Mt().length}, Grains: ${et().length}, SunGlows: ${Vt().length}`
		);
		function X() {
			if (!A || !u) {
				a = requestAnimationFrame(X);
				return;
			}
			((s += 0.002), $());
			const S = v.x1 * u.width,
				F = v.y1 * u.height,
				P = v.x2 * u.width,
				B = v.y2 * u.height,
				q = A.createLinearGradient(S, F, P, B);
			if (
				(q.addColorStop(0, n()),
				q.addColorStop(1, i()),
				(A.fillStyle = q),
				A.fillRect(0, 0, u.width, u.height),
				Mi(A),
				xi(A, u.width, u.height, s),
				Li(A, u.width, u.height),
				Ii(A),
				Ci(A),
				(w += 16.67),
				w >= Ta)
			) {
				for (const ie in zt) {
					const ce = ie,
						le = zt[ce];
					typeof le.chancePerInterval == 'number' &&
						Math.random() < le.chancePerInterval &&
						qt().length < to &&
						Oi(u.width, u.height, ce);
				}
				w = 0;
			}
			(Di(A, u.width, u.height),
				Math.random() < _a && Ri(u.width, u.height),
				Ei(A).forEach((ie) => Je(ie.x, ie.y, 'glintExpire')),
				Math.random() < Xa && bt().length < no && Bi(u.width, u.height),
				Ni(A, u.width, u.height),
				(a = requestAnimationFrame(X)));
		}
		return (
			X(),
			() => {
				(window.removeEventListener('resize', L),
					window.removeEventListener('mousemove', W),
					window.removeEventListener('mousedown', H),
					window.removeEventListener('mouseup', k),
					z && clearInterval(z),
					a && cancelAnimationFrame(a));
			}
		);
	}),
		St());
	var d = Fi();
	(Ft(
		d,
		(u) => h(o, u),
		() => l(o)
	),
		Ie(e, d),
		nt());
}
var Xi = Ee(
	'<form class="space-y-4 mb-8"><div><label class="block text-sm font-medium text-gray-300 mb-1">Gradient Color 1 (HSL)</label> <div class="flex items-center space-x-1.5 mb-1.5"><button type="button" title="Previous Color 1" class="control-button icon-button svelte-1ymr0e5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd"></path></svg></button> <div class="color-preview svelte-1ymr0e5"><div class="hsl-values"> </div></div> <button type="button" title="Next Color 1" class="control-button icon-button svelte-1ymr0e5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd"></path></svg></button> <button type="button" title="Randomize Color 1" class="control-button icon-button random-button svelte-1ymr0e5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.252c-.772.732-.297 2.041.678 2.041h4.475l1.83 4.401c.321.772 1.415.772 1.736 0l1.83-4.401h4.475c.975 0 1.45-1.309.678-2.041L12.698 7.675l-4.753-.39-1.83-4.401z" clip-rule="evenodd"></path></svg></button></div> <div class="grid grid-cols-3 gap-2"><div><label for="c1-h" class="block text-xs font-medium text-gray-400">H</label> <input type="range" id="c1-h" min="0" max="360" class="slider hue-slider svelte-1ymr0e5" style="background: linear-gradient(to right, hsl(0, 100%, 35%), hsl(60, 100%, 35%), hsl(120, 100%, 35%), hsl(180, 100%, 35%), hsl(240, 100%, 35%), hsl(300, 100%, 35%), hsl(360, 100%, 35%));"/></div> <div><label for="c1-s" class="block text-xs font-medium text-gray-400">S%</label> <input type="range" id="c1-s" min="0" max="100" class="slider saturation-slider svelte-1ymr0e5"/></div> <div><label for="c1-l" class="block text-xs font-medium text-gray-400">L%</label> <input type="range" id="c1-l" min="0" max="100" class="slider lightness-slider svelte-1ymr0e5" style="background: linear-gradient(to right, black, white);"/></div></div> <div class="flex items-center pt-2 mt-2 mb-4"><label for="auto-cycle-1" class="toggle-switch svelte-1ymr0e5"><input id="auto-cycle-1" type="checkbox" class="toggle-input svelte-1ymr0e5"/> <span class="toggle-track svelte-1ymr0e5"><span class="toggle-thumb svelte-1ymr0e5"></span></span> <span class="toggle-label svelte-1ymr0e5">Auto-Cycle Color 1</span></label></div></div> <div><label class="block text-sm font-medium text-gray-300 mb-1">Gradient Color 2 (HSL)</label> <div class="flex items-center space-x-1.5 mb-1.5"><button type="button" title="Previous Color 2" class="control-button icon-button svelte-1ymr0e5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd"></path></svg></button> <div class="color-preview svelte-1ymr0e5"><div class="hsl-values"> </div></div> <button type="button" title="Next Color 2" class="control-button icon-button svelte-1ymr0e5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd"></path></svg></button> <button type="button" title="Randomize Color 2" class="control-button icon-button random-button svelte-1ymr0e5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.252c-.772.732-.297 2.041.678 2.041h4.475l1.83 4.401c.321.772 1.415.772 1.736 0l1.83-4.401h4.475c.975 0 1.45-1.309.678-2.041L12.698 7.675l-4.753-.39-1.83-4.401z" clip-rule="evenodd"></path></svg></button></div> <div class="grid grid-cols-3 gap-2"><div><label for="c2-h" class="block text-xs font-medium text-gray-400">H</label> <input type="range" id="c2-h" min="0" max="360" class="slider hue-slider svelte-1ymr0e5" style="background: linear-gradient(to right, hsl(0, 100%, 35%), hsl(60, 100%, 35%), hsl(120, 100%, 35%), hsl(180, 100%, 35%), hsl(240, 100%, 35%), hsl(300, 100%, 35%), hsl(360, 100%, 35%));"/></div> <div><label for="c2-s" class="block text-xs font-medium text-gray-400">S%</label> <input type="range" id="c2-s" min="0" max="100" class="slider saturation-slider svelte-1ymr0e5"/></div> <div><label for="c2-l" class="block text-xs font-medium text-gray-400">L%</label> <input type="range" id="c2-l" min="0" max="100" class="slider lightness-slider svelte-1ymr0e5" style="background: linear-gradient(to right, black, white);"/></div></div> <div class="flex items-center pt-2 mt-2 mb-4"><label for="auto-cycle-2" class="toggle-switch svelte-1ymr0e5"><input id="auto-cycle-2" type="checkbox" class="toggle-input svelte-1ymr0e5"/> <span class="toggle-track svelte-1ymr0e5"><span class="toggle-thumb svelte-1ymr0e5"></span></span> <span class="toggle-label svelte-1ymr0e5">Auto-Cycle Color 2</span></label></div></div> <div class="flex items-center pt-4"><label for="enable-floating" class="toggle-switch svelte-1ymr0e5"><input id="enable-floating" type="checkbox" class="toggle-input svelte-1ymr0e5"/> <span class="toggle-track svelte-1ymr0e5"><span class="toggle-thumb svelte-1ymr0e5"></span></span> <span class="toggle-label svelte-1ymr0e5">Enable floating effect?</span></label></div> <div class="pt-2"><button type="button" class="control-button reset-button svelte-1ymr0e5">Reset to Defaults</button></div></form>'
);
function Yi(e, t) {
	tt(t, !0);
	let n = ue(t, 'color1H', 7),
		i = ue(t, 'color1S', 7),
		o = ue(t, 'color1L', 7),
		a = ue(t, 'isAutoCycling1', 7),
		s = ue(t, 'color2H', 7),
		r = ue(t, 'color2S', 7),
		f = ue(t, 'color2L', 7),
		p = ue(t, 'isAutoCycling2', 7),
		m = ue(t, 'isFloatingEnabled', 7);
	function v(g) {
		const Z = g.target,
			K = parseInt(Z.value),
			re = Z.id.split('-')[1];
		let xe = n(),
			He = i(),
			me = o();
		(re === 'h' ? (xe = K) : re === 's' ? (He = K) : re === 'l' && (me = K),
			re === 'h' && n(K),
			t.onHsl1Change({ h: xe, s: He, l: me }));
	}
	function y(g) {
		const Z = g.target,
			K = parseInt(Z.value),
			re = Z.id.split('-')[1];
		let xe = s(),
			He = r(),
			me = f();
		(re === 'h' ? (xe = K) : re === 's' ? (He = K) : re === 'l' && (me = K),
			re === 'h' && s(K),
			t.onHsl2Change({ h: xe, s: He, l: me }));
	}
	function d(g) {
		const Z = g.target;
		t.onToggleFloating(Z.checked);
	}
	const u = gn(() => `linear-gradient(to right, hsl(${n()}, 0%, 50%), hsl(${n()}, 100%, 50%))`),
		A = gn(() => `linear-gradient(to right, hsl(${s()}, 0%, 50%), hsl(${s()}, 100%, 50%))`);
	var N = Xi(),
		G = M(N),
		D = b(M(G), 2),
		z = M(D),
		E = b(z, 2),
		w = M(E),
		$ = M(w);
	(x(w), x(E));
	var W = b(E, 2),
		H = b(W, 2);
	x(D);
	var k = b(D, 2),
		_ = M(k),
		L = b(M(_), 2);
	(oe(L), x(_));
	var X = b(_, 2),
		S = b(M(X), 2);
	(oe(S), x(X));
	var F = b(X, 2),
		P = b(M(F), 2);
	(oe(P), x(F), x(k));
	var B = b(k, 2),
		q = M(B),
		be = M(q);
	(oe(be), Qe(4), x(q), x(B), x(G));
	var Se = b(G, 2),
		ie = b(M(Se), 2),
		ce = M(ie),
		le = b(ce, 2),
		ne = M(le),
		Ne = M(ne);
	(x(ne), x(le));
	var we = b(le, 2),
		Fe = b(we, 2);
	x(ie);
	var _e = b(ie, 2),
		Ae = M(_e),
		he = b(M(Ae), 2);
	(oe(he), x(Ae));
	var Q = b(Ae, 2),
		fe = b(M(Q), 2);
	(oe(fe), x(Q));
	var ze = b(Q, 2),
		Me = b(M(ze), 2);
	(oe(Me), x(ze), x(_e));
	var Xe = b(_e, 2),
		Te = M(Xe),
		Ce = M(Te);
	(oe(Ce), Qe(4), x(Te), x(Xe), x(Se));
	var Pe = b(Se, 2),
		Ye = M(Pe),
		Oe = M(Ye);
	(oe(Oe), Qe(4), x(Ye), x(Pe));
	var De = b(Pe, 2),
		Y = M(De);
	(x(De),
		x(N),
		qe(() => {
			((z.disabled = !t.canGoPrev1),
				Ke(E, `--preview-bg: ${t.color1HslString ?? ''};`),
				Be($, `${n() ?? ''}, ${i() ?? ''}%, ${o() ?? ''}%`),
				(W.disabled = !t.canGoNext1),
				Ke(S, `background: ${l(u) ?? ''};`),
				(ce.disabled = !t.canGoPrev2),
				Ke(le, `--preview-bg: ${t.color2HslString ?? ''};`),
				Be(Ne, `${s() ?? ''}, ${r() ?? ''}%, ${f() ?? ''}%`),
				(we.disabled = !t.canGoNext2),
				Ke(fe, `background: ${l(A) ?? ''};`));
		}),
		C('click', z, function (...g) {
			t.onPrev1?.apply(this, g);
		}),
		C('click', W, function (...g) {
			t.onNext1?.apply(this, g);
		}),
		C('click', H, function (...g) {
			t.onRandom1?.apply(this, g);
		}),
		ve(L, n),
		C('input', L, v),
		C('pointerdown', L, function (...g) {
			t.onPointerDown1?.apply(this, g);
		}),
		C('pointerup', L, function (...g) {
			t.onPointerUp1?.apply(this, g);
		}),
		ve(S, i),
		C('input', S, v),
		C('pointerdown', S, function (...g) {
			t.onPointerDown1?.apply(this, g);
		}),
		C('pointerup', S, function (...g) {
			t.onPointerUp1?.apply(this, g);
		}),
		ve(P, o),
		C('input', P, v),
		C('pointerdown', P, function (...g) {
			t.onPointerDown1?.apply(this, g);
		}),
		C('pointerup', P, function (...g) {
			t.onPointerUp1?.apply(this, g);
		}),
		dt(be, a),
		C('change', be, function (...g) {
			t.onToggleAutoCycle1?.apply(this, g);
		}),
		C('click', ce, function (...g) {
			t.onPrev2?.apply(this, g);
		}),
		C('click', we, function (...g) {
			t.onNext2?.apply(this, g);
		}),
		C('click', Fe, function (...g) {
			t.onRandom2?.apply(this, g);
		}),
		ve(he, s),
		C('input', he, y),
		C('pointerdown', he, function (...g) {
			t.onPointerDown2?.apply(this, g);
		}),
		C('pointerup', he, function (...g) {
			t.onPointerUp2?.apply(this, g);
		}),
		ve(fe, r),
		C('input', fe, y),
		C('pointerdown', fe, function (...g) {
			t.onPointerDown2?.apply(this, g);
		}),
		C('pointerup', fe, function (...g) {
			t.onPointerUp2?.apply(this, g);
		}),
		ve(Me, f),
		C('input', Me, y),
		C('pointerdown', Me, function (...g) {
			t.onPointerDown2?.apply(this, g);
		}),
		C('pointerup', Me, function (...g) {
			t.onPointerUp2?.apply(this, g);
		}),
		dt(Ce, p),
		C('change', Ce, function (...g) {
			t.onToggleAutoCycle2?.apply(this, g);
		}),
		dt(Oe, m),
		C('change', Oe, d),
		C('click', Y, function (...g) {
			t.onResetDefaults?.apply(this, g);
		}),
		C(
			'submit',
			N,
			Wn(function (g) {
				$n.call(this, t, g);
			})
		),
		Ie(e, N),
		nt());
}
var Ui = Ee(
	'<!> <div class="min-h-screen bg-transparent text-gray-100 flex flex-col items-center justify-center p-4 selection:bg-teal-500 selection:text-teal-900 relative z-0" style="user-select: none; -webkit-user-select: none; -ms-user-select: none;"><div class="fixed top-4 right-4 z-20 flex space-x-2"><button class="p-2 bg-white/5 hover:bg-white/10 border border-slate-400/20 rounded-full text-gray-300 hover:text-teal-300 transition-all shadow-lg backdrop-blur-sm" aria-label="Toggle Settings Panel" title="Settings"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106A1.532 1.532 0 0111.49 3.17zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg></button></div> <div style="width: 24rem;"><div class="settings-panel-content p-6 rounded-lg shadow-xl backdrop-blur-lg" style="background: linear-gradient(160deg, hsla(0,0%,100%,0.07) 0%, hsla(0,0%,100%,0.02) 30%, hsla(0,0%,100%,0) 70%), hsla(0, 0%, 100%, 0.05); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid hsla(0,0%,100%,0.1);"><h3 class="text-xl font-semibold text-teal-400 mb-6 border-b border-slate-600 pb-3">Background Effects</h3> <!> <h3 class="text-xl font-semibold text-teal-400 mt-8 mb-6 border-b border-slate-600 pb-3">Timer Settings</h3> <form class="space-y-6 mb-8"><div><label for="work-duration" class="block text-sm font-medium text-gray-300 mb-1">Work Duration (minutes)</label> <input type="number" id="work-duration" min="1" class="mt-1 block w-full bg-slate-600/80 border-slate-500/70 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm svelte-1ouz19l"/></div> <div><label for="short-break-duration" class="block text-sm font-medium text-gray-300 mb-1">Short Break (minutes)</label> <input type="number" id="short-break-duration" min="1" class="mt-1 block w-full bg-slate-600/80 border-slate-500/70 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm svelte-1ouz19l"/></div> <div><label for="long-break-duration" class="block text-sm font-medium text-gray-300 mb-1">Long Break (minutes)</label> <input type="number" id="long-break-duration" min="1" class="mt-1 block w-full bg-slate-600/80 border-slate-500/70 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm svelte-1ouz19l"/></div> <div><label for="sessions-before-long-break" class="block text-sm font-medium text-gray-300 mb-1">Sessions before Long Break</label> <input type="number" id="sessions-before-long-break" min="1" class="mt-1 block w-full bg-slate-600/80 border-slate-500/70 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm svelte-1ouz19l"/></div> <div class="flex items-center mt-6"><input id="auto-cycle" type="checkbox" class="h-4 w-4 text-teal-600 border-slate-500/70 rounded focus:ring-teal-500 bg-slate-600/80 cursor-pointer"/> <label for="auto-cycle" class="ml-2 block text-sm text-gray-300 cursor-pointer select-none">Automatically start next session?</label></div></form></div></div> <header class="w-full max-w-md mb-8 text-center"><h1>Locked In</h1> <p> </p></header> <main class="w-full max-w-md rounded-lg px-6 pt-4 pb-6 border border-slate-400/20 transition-colors duration-1000 ease-linear transition-shadow duration-[2000ms] ease-out relative overflow-hidden shadow-[0_15px_25px_-5px_rgba(0,0,0,0.3),_0_8px_10px_-6px_rgba(0,0,0,0.2),_inset_0_1px_0px_hsla(0,0%,100%,0.07),_inset_0_0px_1px_hsla(0,0%,100%,0.05)] hover:shadow-[0_20px_30px_-5px_rgba(0,0,0,0.35),_0_10px_15px_-6px_rgba(0,0,0,0.25),_inset_0_1px_0px_hsla(0,0%,100%,0.07),_inset_0_0px_1px_hsla(0,0%,100%,0.05)]"><section aria-labelledby="timer-heading" class="mb-6"><h2 id="timer-heading" class="sr-only">Pomodoro Timer</h2> <!> <!></section></main> <footer class="mt-12 text-center text-xs text-gray-500"></footer></div>',
	1
);
function Zi(e, t) {
	tt(t, !1);
	const [n, i] = Wt(),
		o = () => ke(se, '$timerSettings', n),
		a = () => ke(U, '$backgroundSettings', n),
		s = () => ke(J, '$timerState', n);
	function r(c) {
		if (!c) return null;
		const T = c.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
		return T ? { h: parseInt(T[1]), s: parseInt(T[2]), l: parseInt(T[3]) } : null;
	}
	let f = I(!1),
		p = I(!1),
		m = I(),
		v = I();
	const y = { h: 222, s: 20, l: 22 },
		d = { h: 230, s: 25, l: 30 };
	let u = I(y.h),
		A = I(y.s),
		N = I(y.l),
		G = I(o().workDuration / 60),
		D = I(o().shortBreakDuration / 60),
		z = I(o().longBreakDuration / 60),
		E = I(o().sessionsBeforeLongBreak),
		w = I(o().autoCycle),
		$ = I(a().gradientColor1),
		W = I(a().gradientColor2),
		H = I(a().isFloatingEnabled),
		k = I(0),
		_ = I(0),
		L = I(0),
		X = I(0),
		S = I(0),
		F = I(0),
		P = I(a().isAutoCyclingColor1),
		B = I(a().isAutoCyclingColor2),
		q = 0,
		be = 0,
		Se = 0,
		ie = 0,
		ce = 0,
		le = 0,
		ne,
		Ne = 0,
		we = 0,
		Fe = 0,
		_e = 0,
		Ae = 0,
		he = 0,
		Q;
	const fe = 15e3;
	let ze = I(0),
		Me = I(0),
		Xe = I(0);
	const Te = [
		'a Notification Badge.',
		'an Unfinished Task.',
		'a Distraction.',
		'My To-Do List.',
		"Yesterday's Excuses."
	];
	let Ce = 0,
		Pe = I(Te[0]),
		Ye,
		Oe,
		De,
		Y,
		g,
		Z = !1,
		K = !1,
		re = I('text-teal-400'),
		xe = I('text-gray-400');
	const He = 60;
	(Xn(() => {
		const c = o();
		(h(G, c.workDuration / 60),
			h(D, c.shortBreakDuration / 60),
			h(z, c.longBreakDuration / 60),
			h(E, c.sessionsBeforeLongBreak),
			h(w, c.autoCycle));
		const T = a();
		(h($, T.gradientColor1), h(W, T.gradientColor2), h(H, T.isFloatingEnabled));
		function O() {
			const R = r(a().gradientColor1);
			R && (h(k, R.h), h(_, R.s), h(L, R.l));
			const j = r(a().gradientColor2);
			j && (h(X, j.h), h(S, j.s), h(F, j.l));
		}
		(O(),
			(q = ie = l(k)),
			(be = ce = l(_)),
			(Se = le = l(L)),
			(Ne = _e = l(X)),
			(we = Ae = l(S)),
			(Fe = he = l(F)),
			h(p, !0));
		const de = performance.now();
		function pe(R) {
			const j = R - de;
			a().isFloatingEnabled
				? (h(ze, Math.sin(j / 2e3) * 7),
					h(Me, Math.cos(j / 2800) * 5),
					h(Xe, Math.sin(j / 3500) * 1.5))
				: (h(ze, 0), h(Me, 0), h(Xe, 0));
		}
		(h(Pe, Te[Ce]),
			(Ye = window.setInterval(() => {
				((Ce = (Ce + 1) % Te.length), h(Pe, Te[Ce]));
			}, 3e4)),
			(Oe = window.setInterval(() => {
				if (l(P)) {
					const R = a().gradientColor1,
						j = at(R),
						V = r(j);
					V &&
						((ie = l(k)),
						(ce = l(_)),
						(le = l(L)),
						(q = V.h),
						(be = V.s),
						(Se = V.l),
						(ne = performance.now()));
				}
				if (l(B)) {
					const R = a().gradientColor2,
						j = at(R),
						V = r(j);
					V &&
						((_e = l(X)),
						(Ae = l(S)),
						(he = l(F)),
						(Ne = V.h),
						(we = V.s),
						(Fe = V.l),
						(Q = performance.now()));
				}
			}, fe)));
		function Le(R) {
			if ((pe(R), l(P) && ne !== void 0)) {
				const j = R - ne,
					V = Math.min(1, j / fe);
				(h(k, Zt(ie, q, V)), h(_, me(ce, be, V)), h(L, me(le, Se, V)), V >= 1 && (ne = void 0));
			}
			if (l(B) && Q !== void 0) {
				const j = R - Q,
					V = Math.min(1, j / fe);
				(h(X, Zt(_e, Ne, V)), h(S, me(Ae, we, V)), h(F, me(he, Fe, V)), V >= 1 && (Q = void 0));
			}
			De = requestAnimationFrame(Le);
		}
		De = requestAnimationFrame(Le);
	}),
		Lo(() => {
			(Ye && clearInterval(Ye),
				Oe && clearInterval(Oe),
				De && cancelAnimationFrame(De),
				Y && clearTimeout(Y),
				g && clearTimeout(g),
				(Z = !1),
				(K = !1));
		}));
	function me(c, T, O) {
		return Math.round(c * (1 - O) + T * O);
	}
	function Zt(c, T, O) {
		const de = ((((T - c) % 360) + 540) % 360) - 180;
		return Math.round((c + de * O + 360) % 360);
	}
	function po(c) {
		l(f) && l(m) && !l(m).contains(c.target) && l(v) && !l(v).contains(c.target) && h(f, !1);
	}
	(se.subscribe((c) => {
		(c.workDuration / 60 !== l(G) && h(G, c.workDuration / 60),
			c.shortBreakDuration / 60 !== l(D) && h(D, c.shortBreakDuration / 60),
			c.longBreakDuration / 60 !== l(z) && h(z, c.longBreakDuration / 60),
			c.sessionsBeforeLongBreak !== l(E) && h(E, c.sessionsBeforeLongBreak),
			c.autoCycle !== l(w) && h(w, c.autoCycle));
	}),
		U.subscribe((c) => {
			let T = !1;
			c.gradientColor1 !== l($) && (h($, c.gradientColor1), (T = !0));
			let O = !1;
			if ((c.gradientColor2 !== l(W) && (h(W, c.gradientColor2), (O = !0)), T)) {
				const R = r(l($));
				R && (R.h !== l(k) && h(k, R.h), R.s !== l(_) && h(_, R.s), R.l !== l(L) && h(L, R.l));
			}
			if (O) {
				const R = r(l(W));
				R && (R.h !== l(X) && h(X, R.h), R.s !== l(S) && h(S, R.s), R.l !== l(F) && h(F, R.l));
			}
			c.isFloatingEnabled !== l(H) && h(H, c.isFloatingEnabled);
			const de = r(c.gradientColor1),
				pe = r(c.gradientColor2);
			let Le = 25;
			(de && pe ? (Le = (de.l + pe.l) / 2) : de ? (Le = de.l) : pe && (Le = pe.l),
				Le > He
					? (h(re, 'text-slate-700'), h(xe, 'text-slate-700'))
					: (h(re, 'text-teal-400'), h(xe, 'text-gray-200')),
				c.isAutoCyclingColor1 !== l(P) && h(P, c.isAutoCyclingColor1),
				c.isAutoCyclingColor2 !== l(B) && h(B, c.isAutoCyclingColor2),
				c.isAutoCyclingColor1 || (ne = void 0),
				c.isAutoCyclingColor2 || (Q = void 0));
		}));
	function yo(c) {
		it(`hsl(${c.h}, ${c.s}%, ${c.l}%)`);
	}
	function vo(c) {
		rt(`hsl(${c.h}, ${c.s}%, ${c.l}%)`);
	}
	function bo() {
		(l(P) && (console.log('PointerDown1: AC was on, turning off.'), (Z = !0), We(), (ne = void 0)),
			Y && (clearTimeout(Y), (Y = void 0)));
	}
	function So() {
		(Z &&
			(console.log('PointerUp1: AC was on before drag, setting timeout to resume.'),
			(Y = window.setTimeout(() => {
				((Y = void 0),
					ae(U).isAutoCyclingColor1 ||
						(console.log('PointerUp1 TIMEOUT: Resuming auto-cycle for color 1.'), We()));
			}, 1e3))),
			(Z = !1));
	}
	function Mo() {
		(l(B) && (console.log('PointerDown2: AC was on, turning off.'), (K = !0), $e(), (Q = void 0)),
			g && (clearTimeout(g), (g = void 0)));
	}
	function xo() {
		(K &&
			(console.log('PointerUp2: AC was on before drag, setting timeout to resume.'),
			(g = window.setTimeout(() => {
				((g = void 0),
					ae(U).isAutoCyclingColor2 ||
						(console.log('PointerUp2 TIMEOUT: Resuming auto-cycle for color 2.'), $e()));
			}, 1e3))),
			(K = !1));
	}
	function wo() {
		(l(P) && (We(), (ne = void 0)), Y && clearTimeout(Y), (Y = void 0), (Z = !1));
		const c = fa();
		it(c);
	}
	function _o() {
		(l(B) && ($e(), (Q = void 0)), g && clearTimeout(g), (g = void 0), (K = !1));
		const c = ma();
		rt(c);
	}
	function Ao() {
		if ((Y && clearTimeout(Y), (Y = void 0), (Z = !1), We(), ae(U).isAutoCyclingColor1)) {
			const c = a().gradientColor1,
				T = at(c),
				O = r(T);
			O &&
				((ie = l(k)),
				(ce = l(_)),
				(le = l(L)),
				(q = O.h),
				(be = O.s),
				(Se = O.l),
				(ne = performance.now()));
		} else ne = void 0;
	}
	function Co() {
		if ((g && clearTimeout(g), (g = void 0), (K = !1), $e(), ae(U).isAutoCyclingColor2)) {
			const c = a().gradientColor2,
				T = at(c),
				O = r(T);
			O &&
				((_e = l(X)),
				(Ae = l(S)),
				(he = l(F)),
				(Ne = O.h),
				(we = O.s),
				(Fe = O.l),
				(Q = performance.now()));
		} else Q = void 0;
	}
	function Io(c) {
		U.update((T) => ({ ...T, isFloatingEnabled: c }));
	}
	function ko() {
		(l(P) && (We(), (ne = void 0)), Y && (clearTimeout(Y), (Y = void 0)), (Z = !1), pa());
	}
	function Ro() {
		(l(P) && (We(), (ne = void 0)), Y && (clearTimeout(Y), (Y = void 0)), (Z = !1), ya());
	}
	function Eo() {
		(l(B) && ($e(), (Q = void 0)), g && (clearTimeout(g), (g = void 0)), (K = !1), va());
	}
	function To() {
		(l(B) && ($e(), (Q = void 0)), g && (clearTimeout(g), (g = void 0)), (K = !1), ba());
	}
	(ye(
		() => (l(p), l(f)),
		() => {
			if (typeof window < 'u' && l(p) && l(f)) {
				const c = (T) => po(T);
				window.addEventListener('click', c, !0);
			}
		}
	),
		ye(
			() => (s(), o()),
			() => {
				const c = s(),
					T = o();
				let O = T.workDuration;
				(c.currentSession === 'Short Break'
					? (O = T.shortBreakDuration)
					: c.currentSession === 'Long Break' && (O = T.longBreakDuration),
					(O = Math.max(1, O)));
				const pe = 1 - (c.isRunning || c.timeRemaining < O ? Math.max(0, c.timeRemaining / O) : 1);
				(h(u, y.h + (d.h - y.h) * pe), h(A, y.s + (d.s - y.s) * pe), h(N, y.l + (d.l - y.l) * pe));
			}
		),
		ye(
			() => (l(p), l(G), l(D), l(z), l(E), l(w), o(), se),
			() => {
				if (l(p)) {
					const c = {
						workDuration: Math.max(1, l(G)) * 60,
						shortBreakDuration: Math.max(1, l(D)) * 60,
						longBreakDuration: Math.max(1, l(z)) * 60,
						sessionsBeforeLongBreak: Math.max(1, l(E)),
						autoCycle: l(w)
					};
					(o().workDuration !== c.workDuration ||
						o().shortBreakDuration !== c.shortBreakDuration ||
						o().longBreakDuration !== c.longBreakDuration ||
						o().sessionsBeforeLongBreak !== c.sessionsBeforeLongBreak ||
						o().autoCycle !== c.autoCycle) &&
						se.set(c);
				}
			}
		),
		ye(
			() => (l(p), l(k), l(_), l(L), l($), it),
			() => {
				if (l(p)) {
					const c = `hsl(${l(k)}, ${l(_)}%, ${l(L)}%)`;
					c !== l($) && it(c);
				}
			}
		),
		ye(
			() => (l(p), l(X), l(S), l(F), l(W), rt),
			() => {
				if (l(p)) {
					const c = `hsl(${l(X)}, ${l(S)}%, ${l(F)}%)`;
					c !== l(W) && rt(c);
				}
			}
		),
		ye(
			() => (l(p), a(), l(H), U),
			() => {
				l(p) &&
					a().isFloatingEnabled !== l(H) &&
					U.update((c) => ({ ...c, isFloatingEnabled: l(H) }));
			}
		),
		Ut(),
		St());
	var jt = Ui(),
		Jt = Wo(jt);
	zi(Jt, {
		get gradientColor1() {
			return (a(), ee(() => a().gradientColor1));
		},
		get gradientColor2() {
			return (a(), ee(() => a().gradientColor2));
		}
	});
	var Qt = b(Jt, 2),
		xt = M(Qt),
		wt = M(xt);
	(Ft(
		wt,
		(c) => h(v, c),
		() => l(v)
	),
		x(xt));
	var Ue = b(xt, 2),
		en = M(Ue),
		tn = b(M(en), 2);
	{
		let c = ot(() => (a(), ee(() => a().gradientColor1HistoryIndex > 0))),
			T = ot(
				() => (a(), ee(() => a().gradientColor1HistoryIndex < a().gradientColor1History.length - 1))
			),
			O = ot(() => (a(), ee(() => a().gradientColor2HistoryIndex > 0))),
			de = ot(
				() => (a(), ee(() => a().gradientColor2HistoryIndex < a().gradientColor2History.length - 1))
			);
		Yi(tn, {
			get color1H() {
				return l(k);
			},
			get color1S() {
				return l(_);
			},
			get color1L() {
				return l(L);
			},
			get color1HslString() {
				return l($);
			},
			get canGoPrev1() {
				return l(c);
			},
			get canGoNext1() {
				return l(T);
			},
			get isAutoCycling1() {
				return l(P);
			},
			get color2H() {
				return l(X);
			},
			get color2S() {
				return l(S);
			},
			get color2L() {
				return l(F);
			},
			get color2HslString() {
				return l(W);
			},
			get canGoPrev2() {
				return l(O);
			},
			get canGoNext2() {
				return l(de);
			},
			get isAutoCycling2() {
				return l(B);
			},
			get isFloatingEnabled() {
				return l(H);
			},
			onPrev1: ko,
			onNext1: Ro,
			onRandom1: wo,
			onPrev2: Eo,
			onNext2: To,
			onRandom2: _o,
			onHsl1Change: yo,
			onHsl2Change: vo,
			onToggleAutoCycle1: Ao,
			onToggleAutoCycle2: Co,
			onToggleFloating: Io,
			get onResetDefaults() {
				return Sa;
			},
			onPointerDown1: bo,
			onPointerUp1: So,
			onPointerDown2: Mo,
			onPointerUp2: xo
		});
	}
	var _t = b(tn, 4),
		At = M(_t),
		nn = b(M(At), 2);
	(oe(nn), x(At));
	var Ct = b(At, 2),
		on = b(M(Ct), 2);
	(oe(on), x(Ct));
	var It = b(Ct, 2),
		an = b(M(It), 2);
	(oe(an), x(It));
	var kt = b(It, 2),
		rn = b(M(kt), 2);
	(oe(rn), x(kt));
	var ln = b(kt, 2),
		sn = M(ln);
	(oe(sn),
		Qe(2),
		x(ln),
		x(_t),
		x(en),
		x(Ue),
		Ft(
			Ue,
			(c) => h(m, c),
			() => l(m)
		));
	var Rt = b(Ue, 2),
		cn = M(Rt),
		Et = b(cn, 2),
		Po = M(Et);
	(x(Et), x(Rt));
	var Tt = b(Rt, 2),
		dn = M(Tt),
		un = b(M(dn), 2);
	ra(un, {});
	var Oo = b(un, 2);
	(da(Oo, {}),
		x(dn),
		x(Tt),
		Qe(2),
		x(Qt),
		qe(() => {
			(Ze(wt, 'aria-expanded', l(f)),
				Pt(Ue, 1, `settings-panel-container ${l(f) ? 'open' : 'closed'}`, 'svelte-1ouz19l'),
				Ze(Ue, 'aria-hidden', !l(f)),
				Pt(
					cn,
					1,
					`text-5xl font-thin tracking-wider ${l(re) ?? ''} transition-colors duration-500`,
					'svelte-1ouz19l'
				),
				Pt(Et, 1, `text-sm ${l(xe) ?? ''} mt-1 transition-colors duration-500`, 'svelte-1ouz19l'),
				Be(Po, `Bad Day to Be ${l(Pe) ?? ''}`),
				Ke(
					Tt,
					`--main-bg-h: ${l(u) ?? ''}; --main-bg-s: ${l(A) ?? ''}%; --main-bg-l: ${l(N) ?? ''}%;
           background: 
             linear-gradient(160deg, hsla(0,0%,100%,0.07) 0%, hsla(0,0%,100%,0.02) 30%, hsla(0,0%,100%,0) 70%),
             hsla(var(--main-bg-h), var(--main-bg-s), 100%, 0.1);
           backdrop-filter: blur(12px);
           -webkit-backdrop-filter: blur(12px);
           transform: translate(${l(ze) ?? ''}px, ${l(Me) ?? ''}px) rotate(${l(Xe) ?? ''}deg);`
				));
		}),
		C('click', wt, () => {
			h(f, !l(f));
		}),
		ve(
			nn,
			() => l(G),
			(c) => h(G, c)
		),
		ve(
			on,
			() => l(D),
			(c) => h(D, c)
		),
		ve(
			an,
			() => l(z),
			(c) => h(z, c)
		),
		ve(
			rn,
			() => l(E),
			(c) => h(E, c)
		),
		dt(
			sn,
			() => l(w),
			(c) => h(w, c)
		),
		C(
			'submit',
			_t,
			Wn(function (c) {
				$n.call(this, t, c);
			})
		),
		Ie(e, jt),
		nt(),
		i());
}
export { Zi as component };
