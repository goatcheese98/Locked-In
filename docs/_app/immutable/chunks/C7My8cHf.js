import {
	v as Y,
	w as R,
	x,
	E as B,
	y as M,
	H as C,
	z as F,
	A as $,
	B as y,
	C as q,
	D as N,
	F as w,
	U as Z,
	G as z,
	I as G,
	J as H,
	K as j,
	L as J,
	M as K,
	e as L,
	N as Q,
	S as U,
	O,
	P as V,
	h as A,
	Q as W,
	R as X,
	T as p,
	V as k,
	W as ee,
	X as re,
	j as ae,
	Y as ne,
	Z as se,
	_ as te,
	$ as ie,
	a0 as fe,
	a1 as ue,
	a2 as le,
	a3 as _e,
	a4 as de,
	a5 as ce,
	a6 as ve
} from './BdEMnGkn.js';
import { a as oe, g as be } from './DcxtdZEe.js';
function Ie(e, a, i = !1) {
	R && x();
	var r = e,
		s = null,
		n = null,
		l = Z,
		c = i ? B : 0,
		o = !1;
	const h = (_, f = !0) => {
		((o = !0), v(f, _));
	};
	var u = null;
	function I() {
		u !== null && (u.lastChild.remove(), r.before(u), (u = null));
		var _ = l ? s : n,
			f = l ? n : s;
		(_ && G(_),
			f &&
				H(f, () => {
					l ? (n = null) : (s = null);
				}));
	}
	const v = (_, f) => {
		if (l === (l = _)) return;
		let E = !1;
		if (R) {
			const P = M(r) === C;
			!!l === P && ((r = F()), $(r), y(!1), (E = !0));
		}
		var S = z(),
			d = r;
		if (
			(S && ((u = document.createDocumentFragment()), u.append((d = q()))),
			l ? (s ??= f && N(() => f(d))) : (n ??= f && N(() => f(d))),
			S)
		) {
			var g = w,
				t = l ? s : n,
				b = l ? n : s;
			(t && g.skipped_effects.delete(t), b && g.skipped_effects.add(b), g.add_callback(I));
		} else I();
		E && y(!0);
	};
	(Y(() => {
		((o = !1), a(h), o || v(null, null));
	}, c),
		R && (r = j));
}
function D(e, a) {
	return e === a || e?.[U] === a;
}
function Ee(e = {}, a, i, r) {
	return (
		J(() => {
			var s, n;
			return (
				K(() => {
					((s = n),
						(n = []),
						L(() => {
							e !== i(...n) && (a(e, ...n), s && D(i(...s), e) && a(null, ...s));
						}));
				}),
				() => {
					Q(() => {
						n && D(i(...n), e) && a(null, ...n);
					});
				}
			);
		}),
		e
	);
}
let T = !1,
	m = Symbol();
function Pe(e, a, i) {
	const r = (i[a] ??= { store: null, source: V(void 0), unsubscribe: O });
	if (r.store !== e && !(m in i))
		if ((r.unsubscribe(), (r.store = e ?? null), e == null))
			((r.source.v = void 0), (r.unsubscribe = O));
		else {
			var s = !0;
			((r.unsubscribe = oe(e, (n) => {
				s ? (r.source.v = n) : p(r.source, n);
			})),
				(s = !1));
		}
	return e && m in i ? be(e) : A(r.source);
}
function Te() {
	const e = {};
	function a() {
		W(() => {
			for (var i in e) e[i].unsubscribe();
			X(e, m, { enumerable: !1, value: !0 });
		});
	}
	return [e, a];
}
function Se(e) {
	var a = T;
	try {
		return ((T = !1), [e(), T]);
	} finally {
		T = a;
	}
}
function Ae(e, a, i, r) {
	var s = !ue || (i & le) !== 0,
		n = (i & fe) !== 0,
		l = (i & de) !== 0,
		c = r,
		o = !0,
		h = () => (o && ((o = !1), (c = l ? L(r) : r)), c),
		u;
	if (n) {
		var I = U in e || ve in e;
		u = k(e, a)?.set ?? (I && a in e ? (t) => (e[a] = t) : void 0);
	}
	var v,
		_ = !1;
	(n ? ([v, _] = Se(() => e[a])) : (v = e[a]),
		v === void 0 && r !== void 0 && ((v = h()), u && (s && ee(), u(v))));
	var f;
	if (
		(s
			? (f = () => {
					var t = e[a];
					return t === void 0 ? h() : ((o = !0), t);
				})
			: (f = () => {
					var t = e[a];
					return (t !== void 0 && (c = void 0), t === void 0 ? c : t);
				}),
		s && (i & re) === 0)
	)
		return f;
	if (u) {
		var E = e.$$legacy;
		return function (t, b) {
			return arguments.length > 0 ? ((!s || !b || E || _) && u(b ? f() : t), t) : f();
		};
	}
	var S = !1,
		d = ((i & _e) !== 0 ? ae : ne)(() => ((S = !1), f()));
	n && A(d);
	var g = te;
	return function (t, b) {
		if (arguments.length > 0) {
			const P = b ? A(d) : s && n ? se(t) : t;
			return (p(d, P), (S = !0), c !== void 0 && (c = P), t);
		}
		return (ce && S) || (g.f & ie) !== 0 ? d.v : A(d);
	};
}
export { Pe as a, Ee as b, Ie as i, Ae as p, Te as s };
