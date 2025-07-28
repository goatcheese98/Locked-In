import {
	ac as x,
	ad as A,
	ae as C,
	_ as R,
	Q,
	N as F,
	R as G,
	af as H,
	ag as k,
	ah as J,
	ai as q,
	aj as X,
	ak as Z,
	al as N,
	B as T,
	A as B,
	x as ee,
	K as w,
	am as te,
	an as ne,
	ao as re,
	ap as ae,
	aq as se,
	ar as oe,
	C as ie,
	D as ue,
	w as D,
	p as le,
	b as p,
	as as ce,
	m as fe,
	O as y,
	e as O,
	at as _e,
	r as de,
	au as E,
	d as pe,
	av as be,
	aw as I,
	a1 as he,
	ax as ve,
	a7 as ge,
	ay as ye,
	az as we,
	aA as me,
	aB as Ee,
	aC as Se,
	a9 as Te
} from './BdEMnGkn.js';
const xe = ['touchstart', 'touchmove'];
function Ae(e) {
	return xe.includes(e);
}
let j = !1;
function Ce() {
	j ||
		((j = !0),
		document.addEventListener(
			'reset',
			(e) => {
				Promise.resolve().then(() => {
					if (!e.defaultPrevented) for (const t of e.target.elements) t.__on_r?.();
				});
			},
			{ capture: !0 }
		));
}
function V(e) {
	var t = C,
		n = R;
	(x(null), A(null));
	try {
		return e();
	} finally {
		(x(t), A(n));
	}
}
function Ie(e, t, n, a = n) {
	e.addEventListener(t, () => V(n));
	const s = e.__on_r;
	(s
		? (e.__on_r = () => {
				(s(), a(!0));
			})
		: (e.__on_r = () => a(!0)),
		Ce());
}
const Oe = new Set(),
	z = new Set();
function Le(e, t, n, a = {}) {
	function s(r) {
		if ((a.capture || m.call(t, r), !r.cancelBubble)) return V(() => n?.call(this, r));
	}
	return (
		e.startsWith('pointer') || e.startsWith('touch') || e === 'wheel'
			? F(() => {
					t.addEventListener(e, s, a);
				})
			: t.addEventListener(e, s, a),
		s
	);
}
function Ve(e, t, n, a, s) {
	var r = { capture: a, passive: s },
		u = Le(e, t, n, r);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) &&
		Q(() => {
			t.removeEventListener(e, u, r);
		});
}
function m(e) {
	var t = this,
		n = t.ownerDocument,
		a = e.type,
		s = e.composedPath?.() || [],
		r = s[0] || e.target,
		u = 0,
		l = e.__root;
	if (l) {
		var f = s.indexOf(l);
		if (f !== -1 && (t === document || t === window)) {
			e.__root = t;
			return;
		}
		var o = s.indexOf(t);
		if (o === -1) return;
		f <= o && (u = f);
	}
	if (((r = s[u] || e.target), r !== t)) {
		G(e, 'currentTarget', {
			configurable: !0,
			get() {
				return r || n;
			}
		});
		var h = C,
			_ = R;
		(x(null), A(null));
		try {
			for (var i, c = []; r !== null; ) {
				var d = r.assignedSlot || r.parentNode || r.host || null;
				try {
					var b = r['__' + a];
					if (b != null && (!r.disabled || e.target === r))
						if (H(b)) {
							var [L, ...K] = b;
							L.apply(r, [e, ...K]);
						} else b.call(r, e);
				} catch (S) {
					i ? c.push(S) : (i = S);
				}
				if (e.cancelBubble || d === t || d === null) break;
				r = d;
			}
			if (i) {
				for (let S of c)
					queueMicrotask(() => {
						throw S;
					});
				throw i;
			}
		} finally {
			((e.__root = t), delete e.currentTarget, x(h), A(_));
		}
	}
}
function $e(e, t) {
	var n = t == null ? '' : typeof t == 'object' ? t + '' : t;
	n !== (e.__t ??= e.nodeValue) && ((e.__t = n), (e.nodeValue = n + ''));
}
function $(e, t) {
	return W(e, t);
}
function Ne(e, t) {
	(k(), (t.intro = t.intro ?? !1));
	const n = t.target,
		a = D,
		s = w;
	try {
		for (var r = J(n); r && (r.nodeType !== q || r.data !== X); ) r = Z(r);
		if (!r) throw N;
		(T(!0), B(r), ee());
		const u = W(e, { ...t, anchor: r });
		if (w === null || w.nodeType !== q || w.data !== te) throw (ne(), N);
		return (T(!1), u);
	} catch (u) {
		if (u === N) return (t.recover === !1 && re(), k(), ae(n), T(!1), $(e, t));
		throw u;
	} finally {
		(T(a), B(s));
	}
}
const v = new Map();
function W(e, { target: t, anchor: n, props: a = {}, events: s, context: r, intro: u = !0 }) {
	k();
	var l = new Set(),
		f = (_) => {
			for (var i = 0; i < _.length; i++) {
				var c = _[i];
				if (!l.has(c)) {
					l.add(c);
					var d = Ae(c);
					t.addEventListener(c, m, { passive: d });
					var b = v.get(c);
					b === void 0
						? (document.addEventListener(c, m, { passive: d }), v.set(c, 1))
						: v.set(c, b + 1);
				}
			}
		};
	(f(se(Oe)), z.add(f));
	var o = void 0,
		h = oe(() => {
			var _ = n ?? t.appendChild(ie());
			return (
				ue(() => {
					if (r) {
						le({});
						var i = p;
						i.c = r;
					}
					(s && (a.$$events = s),
						D && ce(_, null),
						(o = e(_, a) || {}),
						D && (R.nodes_end = w),
						r && fe());
				}),
				() => {
					for (var i of l) {
						t.removeEventListener(i, m);
						var c = v.get(i);
						--c === 0 ? (document.removeEventListener(i, m), v.delete(i)) : v.set(i, c);
					}
					(z.delete(f), _ !== n && _.parentNode?.removeChild(_));
				}
			);
		});
	return (M.set(o, h), o);
}
let M = new WeakMap();
function ke(e, t) {
	const n = M.get(e);
	return n ? (M.delete(e), n(t)) : Promise.resolve();
}
function Y(e, t, n) {
	if (e == null) return (t(void 0), n && n(void 0), y);
	const a = O(() => e.subscribe(t, n));
	return a.unsubscribe ? () => a.unsubscribe() : a;
}
const g = [];
function De(e, t) {
	return { subscribe: Me(e, t).subscribe };
}
function Me(e, t = y) {
	let n = null;
	const a = new Set();
	function s(l) {
		if (_e(e, l) && ((e = l), n)) {
			const f = !g.length;
			for (const o of a) (o[1](), g.push(o, e));
			if (f) {
				for (let o = 0; o < g.length; o += 2) g[o][0](g[o + 1]);
				g.length = 0;
			}
		}
	}
	function r(l) {
		s(l(e));
	}
	function u(l, f = y) {
		const o = [l, f];
		return (
			a.add(o),
			a.size === 1 && (n = t(s, r) || y),
			l(e),
			() => {
				(a.delete(o), a.size === 0 && n && (n(), (n = null)));
			}
		);
	}
	return { set: s, update: r, subscribe: u };
}
function We(e, t, n) {
	const a = !Array.isArray(e),
		s = a ? [e] : e;
	if (!s.every(Boolean)) throw new Error('derived() expects stores as input, got a falsy value');
	const r = t.length < 2;
	return De(n, (u, l) => {
		let f = !1;
		const o = [];
		let h = 0,
			_ = y;
		const i = () => {
				if (h) return;
				_();
				const d = t(a ? o[0] : o, u, l);
				r ? u(d) : (_ = typeof d == 'function' ? d : y);
			},
			c = s.map((d, b) =>
				Y(
					d,
					(L) => {
						((o[b] = L), (h &= ~(1 << b)), f && i());
					},
					() => {
						h |= 1 << b;
					}
				)
			);
		return (
			(f = !0),
			i(),
			function () {
				(de(c), _(), (f = !1));
			}
		);
	});
}
function Ye(e) {
	let t;
	return (Y(e, (n) => (t = n))(), t);
}
function Re() {
	return (C === null && be(), (C.ac ??= new AbortController()).signal);
}
function U(e) {
	(p === null && E(),
		he && p.l !== null
			? P(p).m.push(e)
			: pe(() => {
					const t = O(e);
					if (typeof t == 'function') return t;
				}));
}
function Pe(e) {
	(p === null && E(), U(() => () => O(e)));
}
function qe(e, t, { bubbles: n = !1, cancelable: a = !1 } = {}) {
	return new CustomEvent(e, { detail: t, bubbles: n, cancelable: a });
}
function Be() {
	const e = p;
	return (
		e === null && E(),
		(t, n, a) => {
			const s = e.s.$$events?.[t];
			if (s) {
				const r = H(s) ? s.slice() : [s],
					u = qe(t, n, a);
				for (const l of r) l.call(e.x, u);
				return !u.defaultPrevented;
			}
			return !0;
		}
	);
}
function je(e) {
	(p === null && E(), p.l === null && I(), P(p).b.push(e));
}
function ze(e) {
	(p === null && E(), p.l === null && I(), P(p).a.push(e));
}
function P(e) {
	var t = e.l;
	return (t.u ??= { a: [], b: [], m: [] });
}
const Ue = Object.freeze(
	Object.defineProperty(
		{
			__proto__: null,
			afterUpdate: ze,
			beforeUpdate: je,
			createEventDispatcher: Be,
			createRawSnippet: ve,
			flushSync: ge,
			getAbortSignal: Re,
			getAllContexts: ye,
			getContext: we,
			hasContext: me,
			hydrate: Ne,
			mount: $,
			onDestroy: Pe,
			onMount: U,
			setContext: Ee,
			settled: Se,
			tick: Te,
			unmount: ke,
			untrack: O
		},
		Symbol.toStringTag,
		{ value: 'Module' }
	)
);
export {
	Y as a,
	Ce as b,
	Pe as c,
	We as d,
	Ve as e,
	Ue as f,
	Ye as g,
	Ne as h,
	Ie as l,
	$ as m,
	U as o,
	$e as s,
	ke as u,
	Me as w
};
