var app = (function () {
	"use strict";
	function t() {}
	function e(t) {
		return t();
	}
	function n() {
		return Object.create(null);
	}
	function r(t) {
		t.forEach(e);
	}
	function o(t) {
		return "function" == typeof t;
	}
	function c(t, e) {
		return t != t
			? e == e
			: t !== e || (t && "object" == typeof t) || "function" == typeof t;
	}
	function l(t) {
		return null == t ? "" : t;
	}
	function s(t, e) {
		t.appendChild(e);
	}
	function i(t, e, n) {
		t.insertBefore(e, n || null);
	}
	function a(t) {
		t.parentNode.removeChild(t);
	}
	function d(t) {
		return document.createElement(t);
	}
	function u(t) {
		return document.createTextNode(t);
	}
	function p() {
		return u(" ");
	}
	function f(t, e, n, r) {
		return (
			t.addEventListener(e, n, r), () => t.removeEventListener(e, n, r)
		);
	}
	function m(t, e, n) {
		null == n
			? t.removeAttribute(e)
			: t.getAttribute(e) !== n && t.setAttribute(e, n);
	}
	function v(t, e, n, r) {
		t.style.setProperty(e, n, r ? "important" : "");
	}
	let h;
	function g(t) {
		h = t;
	}
	const $ = [],
		b = [],
		y = [],
		x = [],
		w = Promise.resolve();
	let q = !1;
	function E(t) {
		y.push(t);
	}
	let k = !1;
	const I = new Set();
	function S() {
		if (!k) {
			k = !0;
			do {
				for (let t = 0; t < $.length; t += 1) {
					const e = $[t];
					g(e), H(e.$$);
				}
				for (g(null), $.length = 0; b.length; ) b.pop()();
				for (let t = 0; t < y.length; t += 1) {
					const e = y[t];
					I.has(e) || (I.add(e), e());
				}
				y.length = 0;
			} while ($.length);
			for (; x.length; ) x.pop()();
			(q = !1), (k = !1), I.clear();
		}
	}
	function H(t) {
		if (null !== t.fragment) {
			t.update(), r(t.before_update);
			const e = t.dirty;
			(t.dirty = [-1]),
				t.fragment && t.fragment.p(t.ctx, e),
				t.after_update.forEach(E);
		}
	}
	const N = new Set();
	let T;
	function C(t, e) {
		t && t.i && (N.delete(t), t.i(e));
	}
	function A(t, e, n, r) {
		if (t && t.o) {
			if (N.has(t)) return;
			N.add(t),
				T.c.push(() => {
					N.delete(t), r && (n && t.d(1), r());
				}),
				t.o(e);
		}
	}
	const _ =
		"undefined" != typeof window
			? window
			: "undefined" != typeof globalThis
			? globalThis
			: global;
	function L(t) {
		t && t.c();
	}
	function M(t, n, c) {
		const {
			fragment: l,
			on_mount: s,
			on_destroy: i,
			after_update: a,
		} = t.$$;
		l && l.m(n, c),
			E(() => {
				const n = s.map(e).filter(o);
				i ? i.push(...n) : r(n), (t.$$.on_mount = []);
			}),
			a.forEach(E);
	}
	function P(t, e) {
		const n = t.$$;
		null !== n.fragment &&
			(r(n.on_destroy),
			n.fragment && n.fragment.d(e),
			(n.on_destroy = n.fragment = null),
			(n.ctx = []));
	}
	function j(t, e) {
		-1 === t.$$.dirty[0] &&
			($.push(t), q || ((q = !0), w.then(S)), t.$$.dirty.fill(0)),
			(t.$$.dirty[(e / 31) | 0] |= 1 << e % 31);
	}
	function G(e, o, c, l, s, i, d = [-1]) {
		const u = h;
		g(e);
		const p = o.props || {},
			f = (e.$$ = {
				fragment: null,
				ctx: null,
				props: i,
				update: t,
				not_equal: s,
				bound: n(),
				on_mount: [],
				on_destroy: [],
				before_update: [],
				after_update: [],
				context: new Map(u ? u.$$.context : []),
				callbacks: n(),
				dirty: d,
				skip_bound: !1,
			});
		let m = !1;
		if (
			((f.ctx = c
				? c(e, p, (t, n, ...r) => {
						const o = r.length ? r[0] : n;
						return (
							f.ctx &&
								s(f.ctx[t], (f.ctx[t] = o)) &&
								(!f.skip_bound && f.bound[t] && f.bound[t](o),
								m && j(e, t)),
							n
						);
				  })
				: []),
			f.update(),
			(m = !0),
			r(f.before_update),
			(f.fragment = !!l && l(f.ctx)),
			o.target)
		) {
			if (o.hydrate) {
				const t = (function (t) {
					return Array.from(t.childNodes);
				})(o.target);
				f.fragment && f.fragment.l(t), t.forEach(a);
			} else f.fragment && f.fragment.c();
			o.intro && C(e.$$.fragment), M(e, o.target, o.anchor), S();
		}
		g(u);
	}
	class z {
		$destroy() {
			P(this, 1), (this.$destroy = t);
		}
		$on(t, e) {
			const n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
			return (
				n.push(e),
				() => {
					const t = n.indexOf(e);
					-1 !== t && n.splice(t, 1);
				}
			);
		}
		$set(t) {
			var e;
			this.$$set &&
				((e = t), 0 !== Object.keys(e).length) &&
				((this.$$.skip_bound = !0),
				this.$$set(t),
				(this.$$.skip_bound = !1));
		}
	}
	var B, D, O;
	async function R(t, e) {
		let n = `https://node.dragonfruit.tk/panda_linux/${t}?query=${e}`;
		return (
			console.log("> Direction is " + t + ", query is " + e),
			console.log("> GET URL: " + n),
			new Promise((t, e) => {
				try {
					fetch(n).then(
						n => {
							n.json().then(
								e => {
									console.log(
										`> Server responded with {${e.original}, ${e.conversion}}`
									),
										t(e.conversion);
								},
								t => {
									e("An error occurred: " + t);
								}
							);
						},
						t => {
							e("An error occurred: " + t);
						}
					);
				} catch (t) {
					console.log(t),
						e("There was an error with the GET request: " + t);
				}
			})
		);
	}
	function F(t) {
		let e;
		return {
			c() {
				e = u("简体字");
			},
			m(t, n) {
				i(t, e, n);
			},
			d(t) {
				t && a(e);
			},
		};
	}
	function U(t) {
		let e;
		return {
			c() {
				e = u("Simplified");
			},
			m(t, n) {
				i(t, e, n);
			},
			d(t) {
				t && a(e);
			},
		};
	}
	function V(t) {
		let e;
		return {
			c() {
				e = u("繁體字");
			},
			m(t, n) {
				i(t, e, n);
			},
			d(t) {
				t && a(e);
			},
		};
	}
	function J(t) {
		let e;
		return {
			c() {
				e = u("Traditional");
			},
			m(t, n) {
				i(t, e, n);
			},
			d(t) {
				t && a(e);
			},
		};
	}
	function K(e) {
		let n, o, c, l, u, h, g, $, b, y, x, w, q, E, k, I, S, H, N, T, C, A;
		function _(t, e) {
			return t[0] == O.ENGLISH ? U : t[0] == O.CHINESE ? F : void 0;
		}
		let L = _(e),
			M = L && L(e);
		function P(t, e) {
			return t[0] == O.ENGLISH ? J : t[0] == O.CHINESE ? V : void 0;
		}
		let j = P(e),
			G = j && j(e);
		return {
			c() {
				(n = d("main")),
					(o = d("div")),
					(c = d("div")),
					(l = d("div")),
					(u = d("h2")),
					M && M.c(),
					(h = p()),
					(g = d("hr")),
					($ = p()),
					(b = d("div")),
					(y = d("label")),
					(x = d("textarea")),
					(w = p()),
					(q = d("div")),
					(E = d("h2")),
					G && G.c(),
					(k = p()),
					(I = d("hr")),
					(S = p()),
					(H = d("div")),
					(N = d("label")),
					(T = d("textarea")),
					m(u, "class", "align-center my-2 svelte-lkpw9n"),
					m(g, "class", "my-2"),
					v(g, "border-top", "1px solid black"),
					m(x, "class", "form-control svelte-lkpw9n"),
					m(x, "id", "simp"),
					m(x, "rows", "10"),
					m(x, "cols", "25"),
					m(x, "placeholder", e[1]),
					m(y, "class", "full-size svelte-lkpw9n"),
					m(y, "for", "simp"),
					m(b, "class", "form-group full-size svelte-lkpw9n"),
					m(l, "class", "col mx-3 my-2 full-size svelte-lkpw9n"),
					m(E, "class", "align-center my-2 svelte-lkpw9n"),
					m(I, "class", "my-2"),
					v(I, "border-top", "1px solid black"),
					m(T, "class", "form-control svelte-lkpw9n"),
					m(T, "id", "trad"),
					m(T, "rows", "10"),
					m(T, "cols", "25"),
					m(T, "placeholder", e[1]),
					m(N, "class", "full-size svelte-lkpw9n"),
					m(N, "for", "trad"),
					m(H, "class", "form-group full-size svelte-lkpw9n"),
					m(q, "class", "col mx-3 my-2 full-size svelte-lkpw9n"),
					m(c, "class", "row mt-10 d-flex"),
					v(c, "align-content", "center"),
					m(o, "class", "container text-center svelte-lkpw9n"),
					m(o, "id", "input-container");
			},
			m(t, r) {
				i(t, n, r),
					s(n, o),
					s(o, c),
					s(c, l),
					s(l, u),
					M && M.m(u, null),
					s(l, h),
					s(l, g),
					s(l, $),
					s(l, b),
					s(b, y),
					s(y, x),
					s(c, w),
					s(c, q),
					s(q, E),
					G && G.m(E, null),
					s(q, k),
					s(q, I),
					s(q, S),
					s(q, H),
					s(H, N),
					s(N, T),
					C ||
						((A = [f(x, "input", e[3]), f(T, "input", e[4])]),
						(C = !0));
			},
			p(t, [e]) {
				L !== (L = _(t)) &&
					(M && M.d(1), (M = L && L(t)), M && (M.c(), M.m(u, null))),
					2 & e && m(x, "placeholder", t[1]),
					j !== (j = P(t)) &&
						(G && G.d(1),
						(G = j && j(t)),
						G && (G.c(), G.m(E, null))),
					2 & e && m(T, "placeholder", t[1]);
			},
			i: t,
			o: t,
			d(t) {
				t && a(n), M && M.d(), G && G.d(), (C = !1), r(A);
			},
		};
	}
	!(function (t) {
		(t.s2t = "s2t"), (t.t2s = "t2s");
	})(B || (B = {})),
		(function (t) {
			(t.MAIN = "MAIN"), (t.API = "API");
		})(D || (D = {})),
		(function (t) {
			(t[(t.CHINESE = 0)] = "CHINESE"), (t[(t.ENGLISH = 1)] = "ENGLISH");
		})(O || (O = {}));
	function Q(t, e) {
		let n;
		switch (t.id) {
			case "simp":
				n = document.getElementById("trad");
				break;
			case "trad":
				n = document.getElementById("simp");
				break;
			default:
				t.value = "There was an error parsing your text.";
		}
		(t.style.color = null), (n.style.color = "SteelBlue"), (n.value = e);
	}
	function W(t, e, n) {
		let r,
			{ lang: o = O.CHINESE } = e,
			c = null;
		function l(t) {
			clearTimeout(c),
				(c = setTimeout(() => {
					const e = t.target;
					switch (
						(console.log(
							"> Text input detected in textarea with id " + e.id
						),
						e.id)
					) {
						case "simp":
							R(B.s2t, e.value).then(t => Q(e, t));
							break;
						case "trad":
							R(B.t2s, e.value).then(t => Q(e, t));
							break;
						default:
							e.value = "There was an error parsing your text.";
					}
				}, 500));
		}
		return (
			(t.$$set = t => {
				"lang" in t && n(0, (o = t.lang));
			}),
			(t.$$.update = () => {
				1 & t.$$.dirty &&
					n(1, (r = o == O.CHINESE ? "在此输入" : "Start typing..."));
			}),
			[o, r, l, t => l(t), t => l(t)]
		);
	}
	class X extends z {
		constructor(t) {
			super(), G(this, t, W, K, c, { lang: 0 });
		}
	}
	function Y(t) {
		let e;
		return {
			c() {
				e = u("使用说明");
			},
			m(t, n) {
				i(t, e, n);
			},
			d(t) {
				t && a(e);
			},
		};
	}
	function Z(t) {
		let e;
		return {
			c() {
				e = u("Instructions");
			},
			m(t, n) {
				i(t, e, n);
			},
			d(t) {
				t && a(e);
			},
		};
	}
	function tt(t) {
		let e;
		return {
			c() {
				e = u("在其中一个文本区开始输入，翻译会在对面显示");
			},
			m(t, n) {
				i(t, e, n);
			},
			d(t) {
				t && a(e);
			},
		};
	}
	function et(t) {
		let e;
		return {
			c() {
				e = u(
					"Start typing, and the output will appear in the other box."
				);
			},
			m(t, n) {
				i(t, e, n);
			},
			d(t) {
				t && a(e);
			},
		};
	}
	function nt(t) {
		let e, n, r, o, c, l, u, f, v, h, g, $, b;
		function y(t, e) {
			return t[0] == O.ENGLISH ? Z : t[0] == O.CHINESE ? Y : void 0;
		}
		n = new X({ props: { lang: t[0] } });
		let x = y(t),
			w = x && x(t);
		function q(t, e) {
			return t[0] == O.ENGLISH ? et : t[0] == O.CHINESE ? tt : void 0;
		}
		let E = q(t),
			k = E && E(t);
		return {
			c() {
				(e = d("main")),
					L(n.$$.fragment),
					(r = p()),
					(o = d("div")),
					(c = d("div")),
					(l = d("div")),
					(u = d("div")),
					(f = d("div")),
					(v = d("h3")),
					w && w.c(),
					(h = p()),
					(g = d("div")),
					($ = d("p")),
					k && k.c(),
					m(f, "class", "card-header"),
					m(g, "class", "card-body"),
					m(
						u,
						"class",
						"card border-primary mt-2 center-children svelte-18kaave"
					),
					m(u, "id", "instructions-card"),
					m(l, "class", "col mx-3 full-size svelte-18kaave"),
					m(c, "class", "row mt-2 d-flex"),
					m(o, "class", "container text-center");
			},
			m(t, a) {
				i(t, e, a),
					M(n, e, null),
					s(e, r),
					s(e, o),
					s(o, c),
					s(c, l),
					s(l, u),
					s(u, f),
					s(f, v),
					w && w.m(v, null),
					s(u, h),
					s(u, g),
					s(g, $),
					k && k.m($, null),
					(b = !0);
			},
			p(t, [e]) {
				const r = {};
				1 & e && (r.lang = t[0]),
					n.$set(r),
					x !== (x = y(t)) &&
						(w && w.d(1),
						(w = x && x(t)),
						w && (w.c(), w.m(v, null))),
					E !== (E = q(t)) &&
						(k && k.d(1),
						(k = E && E(t)),
						k && (k.c(), k.m($, null)));
			},
			i(t) {
				b || (C(n.$$.fragment, t), (b = !0));
			},
			o(t) {
				A(n.$$.fragment, t), (b = !1);
			},
			d(t) {
				t && a(e), P(n), w && w.d(), k && k.d();
			},
		};
	}
	function rt(t, e, n) {
		let { lang: r = O.CHINESE } = e;
		return (
			(t.$$set = t => {
				"lang" in t && n(0, (r = t.lang));
			}),
			[r]
		);
	}
	class ot extends z {
		constructor(t) {
			super(), G(this, t, rt, nt, c, { lang: 0 });
		}
	}
	const { document: ct } = _;
	function lt(e) {
		let n,
			r,
			o,
			c,
			l,
			u,
			h,
			g,
			$,
			b,
			y,
			x,
			w,
			q,
			E,
			k,
			I,
			S,
			H,
			N,
			T,
			C,
			A,
			_,
			L,
			M,
			P;
		return {
			c() {
				(n = d("script")),
					(o = p()),
					(c = d("main")),
					(l = d("div")),
					(u = d("div")),
					(u.innerHTML =
						'<div class="col mx-2"><p>Requests can be made directly via HTTP or HTTPS. The server responds to GET requests to:<br/> \n                <samp>http[s]://node.dragonfruit.tk/panda_linux/&lt;direction&gt;?query=&lt;query&gt;</samp></p></div>'),
					(h = p()),
					(g = d("div")),
					($ = d("div")),
					(b = d("div")),
					(b.innerHTML = "<h2>API Format</h2>"),
					(y = p()),
					(x = d("div")),
					(x.innerHTML =
						'<div class="col mx-2"><div class="card"><div class="card-header">Valid Directions</div> \n                            <div class="card-body bg-code svelte-1b6ohak"><pre><code class="language-ts">enum Direction {\n    s2t = &quot;s2t&quot;,    // Simplified to Traditional\n    s2t = &quot;t2s&quot;,    // Traditional to Simplified\n}</code></pre></div></div></div> \n                    <div class="col mx-2"><div class="card"><div class="card-header">Response Format</div> \n                            <div class="card-body bg-code svelte-1b6ohak"><pre><code class="language-ts">{\n    &quot;original&quot;: string,\n    &quot;conversion&quot;: string\n}</code></pre></div></div></div> \n                    <div class="col mx-2"><div class="card"><div class="card-header">Example</div> \n                            <div class="card-body bg-code svelte-1b6ohak"><pre><code class="language-ts">{\n    &quot;original&quot;: &quot;汉字&quot;,\n    &quot;conversion&quot;: &quot;漢字&quot;\n}</code></pre></div></div></div>'),
					(w = p()),
					(q = d("div")),
					(q.innerHTML = "<h2>Usage Examples</h2>"),
					(E = p()),
					(k = d("div")),
					(k.innerHTML =
						'<div class="col mx-2"><div class="card"><div class="card-header">Valid URL</div> \n                            <div class="card-body bg-code svelte-1b6ohak"><pre><code class="plaintext">https://node.dragonfruit.tk/panda_linux/s2t?query=汉字</code></pre></div></div></div>'),
					(I = p()),
					(S = d("div")),
					(H = d("div")),
					(N = d("div")),
					(T = d("div")),
					(T.textContent = "HTTPS (TypeScript)"),
					(C = p()),
					(A = d("div")),
					(_ = d("pre")),
					(L = d("code")),
					(L.textContent =
						'function convert(direction: Direction, query: string) {\n    let url = `https://node.dragonfruit.tk/panda_linux/${direction}?query=${query}`;\n    fetch(url).then(response => {\n        response.json().then(p => {\n            console.log("Original query: " + p.original);\n            console.log("Converted: " + p.conversion);\n        })\n    });\n}'),
					n.src !==
						(r =
							"//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/highlight.min.js") &&
						m(
							n,
							"src",
							"//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/highlight.min.js"
						),
					m(
						u,
						"class",
						"row mt-3 mb-2 center-children svelte-1b6ohak"
					),
					m(u, "id", "intro"),
					m(b, "class", "row"),
					m(x, "class", "row mt-1 mb-4"),
					m(x, "id", "server-formatting"),
					m(q, "class", "row"),
					m(k, "class", "row mt-1 mb-2"),
					m(k, "id", "https"),
					m(T, "class", "card-header"),
					m(L, "class", "language-ts"),
					m(A, "class", "card-body bg-code svelte-1b6ohak"),
					m(N, "class", "card"),
					m(H, "class", "col mx-2"),
					m(S, "class", "row mt-1 mb-2"),
					m(S, "id", "https"),
					m($, "class", "col mx-2"),
					m(g, "class", "row mb-10"),
					m(g, "id", "code-examples"),
					m(l, "class", "container text-container"),
					v(l, "margin-bottom", "60px");
			},
			m(t, r) {
				s(ct.head, n),
					i(t, o, r),
					i(t, c, r),
					s(c, l),
					s(l, u),
					s(l, h),
					s(l, g),
					s(g, $),
					s($, b),
					s($, y),
					s($, x),
					s($, w),
					s($, q),
					s($, E),
					s($, k),
					s($, I),
					s($, S),
					s(S, H),
					s(H, N),
					s(N, T),
					s(N, C),
					s(N, A),
					s(A, _),
					s(_, L),
					M || ((P = f(n, "load", e[0])), (M = !0));
			},
			p: t,
			i: t,
			o: t,
			d(t) {
				a(n), t && a(o), t && a(c), (M = !1), P();
			},
		};
	}
	function st(t) {
		return [
			() => {
				document.querySelectorAll("pre code").forEach(t => {
					hljs.highlightBlock(t);
				});
			},
		];
	}
	class it extends z {
		constructor(t) {
			super(), G(this, t, st, lt, c, {});
		}
	}
	function at(e) {
		let n;
		return {
			c() {
				(n = d("div")),
					(n.innerHTML = "<h1>404 Content Not Found</h1>"),
					m(n, "class", "row my-5"),
					v(n, "width", "100%"),
					v(n, "justify-content", "center");
			},
			m(t, e) {
				i(t, n, e);
			},
			p: t,
			i: t,
			o: t,
			d(t) {
				t && a(n);
			},
		};
	}
	function dt(t) {
		let e, n;
		return (
			(e = new ot({ props: { lang: t[1] } })),
			{
				c() {
					L(e.$$.fragment);
				},
				m(t, r) {
					M(e, t, r), (n = !0);
				},
				p(t, n) {
					const r = {};
					2 & n && (r.lang = t[1]), e.$set(r);
				},
				i(t) {
					n || (C(e.$$.fragment, t), (n = !0));
				},
				o(t) {
					A(e.$$.fragment, t), (n = !1);
				},
				d(t) {
					P(e, t);
				},
			}
		);
	}
	function ut(e) {
		let n, r, o, c, l, s;
		return (
			(n = new it({})),
			{
				c() {
					L(n.$$.fragment),
						(r = p()),
						(o = d("div")),
						(o.innerHTML =
							'<span><i class="centered-item fas fa-home fa-2x svelte-q8quuv"></i></span>'),
						m(
							o,
							"class",
							"container float pointer-hover svelte-q8quuv"
						);
				},
				m(t, a) {
					M(n, t, a),
						i(t, r, a),
						i(t, o, a),
						(c = !0),
						l || ((s = f(o, "click", e[3])), (l = !0));
				},
				p: t,
				i(t) {
					c || (C(n.$$.fragment, t), (c = !0));
				},
				o(t) {
					A(n.$$.fragment, t), (c = !1);
				},
				d(t) {
					P(n, t), t && a(r), t && a(o), (l = !1), s();
				},
			}
		);
	}
	function pt(t) {
		let e, n, r, o, c;
		return {
			c() {
				(e = d("div")),
					(n = d("span")),
					m(
						n,
						"class",
						(r =
							l(
								t[1] == O.CHINESE
									? "icon-en centered-item"
									: "icon-cn centered-item"
							) + " svelte-q8quuv")
					),
					m(
						e,
						"class",
						"container float pointer-hover svelte-q8quuv"
					);
			},
			m(r, l) {
				i(r, e, l), s(e, n), o || ((c = f(e, "click", t[4])), (o = !0));
			},
			p(t, e) {
				2 & e &&
					r !==
						(r =
							l(
								t[1] == O.CHINESE
									? "icon-en centered-item"
									: "icon-cn centered-item"
							) + " svelte-q8quuv") &&
					m(n, "class", r);
			},
			d(t) {
				t && a(e), (o = !1), c();
			},
		};
	}
	function ft(e) {
		let n, r, o;
		return {
			c() {
				(n = d("p")),
					(n.textContent = "API"),
					m(n, "class", "my-2 text-white p-link svelte-q8quuv");
			},
			m(t, c) {
				i(t, n, c), r || ((o = f(n, "click", e[2])), (r = !0));
			},
			p: t,
			d(t) {
				t && a(n), (r = !1), o();
			},
		};
	}
	function mt(t) {
		let e, n, o, c, l, u, f, v, h, g, $, b;
		const y = [ut, dt, at],
			x = [];
		function w(t, e) {
			return t[0] == D.API ? 0 : t[0] == D.MAIN ? 1 : 2;
		}
		(l = w(t)), (u = x[l] = y[l](t));
		let q = t[0] == D.MAIN && pt(t),
			E = t[0] != D.API && ft(t);
		return {
			c() {
				(e = d("main")),
					(n = d("header")),
					(n.innerHTML = '<h1 class="my-3 text-white">PandaCC</h1>'),
					(o = p()),
					(c = d("div")),
					u.c(),
					(f = p()),
					q && q.c(),
					(v = p()),
					(h = d("footer")),
					E && E.c(),
					(g = p()),
					($ = d("a")),
					($.textContent = "Github"),
					m(n, "class", "bg-dark text-center p-2 mb-3 svelte-q8quuv"),
					m(c, "class", "container svelte-q8quuv"),
					m(c, "id", "base-container"),
					m($, "class", "my-2 text-white svelte-q8quuv"),
					m($, "href", "https://github.com/minghao912/PandaCC"),
					m(h, "class", "bg-dark text-center p-2 mt-3 svelte-q8quuv");
			},
			m(t, r) {
				i(t, e, r),
					s(e, n),
					s(e, o),
					s(e, c),
					x[l].m(c, null),
					s(e, f),
					q && q.m(e, null),
					s(e, v),
					s(e, h),
					E && E.m(h, null),
					s(h, g),
					s(h, $),
					(b = !0);
			},
			p(t, [n]) {
				let o = l;
				(l = w(t)),
					l === o
						? x[l].p(t, n)
						: ((T = { r: 0, c: [], p: T }),
						  A(x[o], 1, 1, () => {
								x[o] = null;
						  }),
						  T.r || r(T.c),
						  (T = T.p),
						  (u = x[l]),
						  u ? u.p(t, n) : ((u = x[l] = y[l](t)), u.c()),
						  C(u, 1),
						  u.m(c, null)),
					t[0] == D.MAIN
						? q
							? q.p(t, n)
							: ((q = pt(t)), q.c(), q.m(e, v))
						: q && (q.d(1), (q = null)),
					t[0] != D.API
						? E
							? E.p(t, n)
							: ((E = ft(t)), E.c(), E.m(h, g))
						: E && (E.d(1), (E = null));
			},
			i(t) {
				b || (C(u), (b = !0));
			},
			o(t) {
				A(u), (b = !1);
			},
			d(t) {
				t && a(e), x[l].d(), q && q.d(), E && E.d();
			},
		};
	}
	function vt(t, e, n) {
		let r = D.MAIN;
		let o = O.CHINESE;
		return (
			(t.$$.update = () => {
				1 & t.$$.dirty && console.log("> Show page " + r),
					2 & t.$$.dirty && console.log("> Show lang " + o);
			}),
			[
				r,
				o,
				function () {
					n(0, (r = D.API));
				},
				function () {
					n(0, (r = D.MAIN));
				},
				function () {
					o == O.CHINESE
						? n(1, (o = O.ENGLISH))
						: n(1, (o = O.CHINESE));
				},
			]
		);
	}
	return new (class extends z {
		constructor(t) {
			super(), G(this, t, vt, mt, c, {});
		}
	})({ target: document.body, props: {} });
})();
//# sourceMappingURL=bundle.js.map
