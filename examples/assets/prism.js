/* PrismJS 1.14.0
http://prismjs.com/download.html#themes=prism&languages=markup+css+clike+javascript+markup-templating+json+php+php-extras&plugins=toolbar+normalize-whitespace+show-language+copy-to-clipboard */
const _self =
	typeof window !== 'undefined'
		? window
		: typeof WorkerGlobalScope !== 'undefined' &&
			  self instanceof WorkerGlobalScope
			? self
			: {};
const Prism = (function () {
	const e = /\blang(?:uage)?-([\w-]+)\b/i;
	let t = 0;
	var n = (_self.Prism = {
		manual: _self.Prism && _self.Prism.manual,
		disableWorkerMessageHandler:
			_self.Prism && _self.Prism.disableWorkerMessageHandler,
		util: {
			encode: function (e) {
				return e instanceof r
					? new r(e.type, n.util.encode(e.content), e.alias)
					: n.util.type(e) === 'Array'
						? e.map(n.util.encode)
						: e
								.replace(/&/g, '&amp;')
								.replace(/</g, '&lt;')
								.replace(/\u00a0/g, ' ');
			},
			type: function (e) {
				return Object.prototype.toString
					.call(e)
					.match(/\[object (\w+)\]/)[1];
			},
			objId: function (e) {
				return (
					e.__id || Object.defineProperty(e, '__id', { value: ++t }),
					e.__id
				);
			},
			clone: function (e, t) {
				const r = n.util.type(e);
				switch (((t = t || {}), r)) {
					case 'Object':
						if (t[n.util.objId(e)]) return t[n.util.objId(e)];
						var a = {};
						t[n.util.objId(e)] = a;
						for (const l in e) {
							e.hasOwnProperty(l) &&
								(a[l] = n.util.clone(e[l], t));
						}
						return a;
					case 'Array':
						if (t[n.util.objId(e)]) return t[n.util.objId(e)];
						var a = [];
						return (
							(t[n.util.objId(e)] = a),
							e.forEach(function (e, r) {
								a[r] = n.util.clone(e, t);
							}),
							a
						);
				}
				return e;
			}
		},
		languages: {
			extend: function (e, t) {
				const r = n.util.clone(n.languages[e]);
				for (const a in t) r[a] = t[a];
				return r;
			},
			insertBefore: function (e, t, r, a) {
				a = a || n.languages;
				const l = a[e];
				if (arguments.length == 2) {
					r = arguments[1];
					for (var i in r) r.hasOwnProperty(i) && (l[i] = r[i]);
					return l;
				}
				const o = {};
				for (const s in l) {
					if (l.hasOwnProperty(s)) {
						if (s == t) {
							for (var i in r) {
								r.hasOwnProperty(i) && (o[i] = r[i]);
							}
						}
						o[s] = l[s];
					}
				}
				return (
					n.languages.DFS(n.languages, function (t, n) {
						n === a[e] && t != e && (this[t] = o);
					}),
					(a[e] = o)
				);
			},
			DFS: function (e, t, r, a) {
				a = a || {};
				for (const l in e) {
					e.hasOwnProperty(l) &&
						(t.call(e, l, e[l], r || l),
						n.util.type(e[l]) !== 'Object' || a[n.util.objId(e[l])]
							? n.util.type(e[l]) !== 'Array' ||
								a[n.util.objId(e[l])] ||
								((a[n.util.objId(e[l])] = !0),
								n.languages.DFS(e[l], t, l, a))
							: ((a[n.util.objId(e[l])] = !0),
								n.languages.DFS(e[l], t, null, a)));
				}
			}
		},
		plugins: {},
		highlightAll: function (e, t) {
			n.highlightAllUnder(document, e, t);
		},
		highlightAllUnder: function (e, t, r) {
			const a = {
				callback: r,
				selector:
					'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
			};
			n.hooks.run('before-highlightall', a);
			for (
				var l, i = a.elements || e.querySelectorAll(a.selector), o = 0;
				(l = i[o++]);

			) {
				n.highlightElement(l, t === !0, a.callback);
			}
		},
		highlightElement: function (t, r, a) {
			for (var l, i, o = t; o && !e.test(o.className); ) o = o.parentNode;
			o &&
				((l = (o.className.match(e) || [, ''])[1].toLowerCase()),
				(i = n.languages[l])),
				(t.className =
					t.className.replace(e, '').replace(/\s+/g, ' ') +
					' language-' +
					l),
				t.parentNode &&
					((o = t.parentNode),
					/pre/i.test(o.nodeName) &&
						(o.className =
							o.className.replace(e, '').replace(/\s+/g, ' ') +
							' language-' +
							l));
			const s = t.textContent;
			const u = { element: t, language: l, grammar: i, code: s };
			if (
				(n.hooks.run('before-sanity-check', u), !u.code || !u.grammar)
			) {
				return (
					u.code &&
						(n.hooks.run('before-highlight', u),
						(u.element.textContent = u.code),
						n.hooks.run('after-highlight', u)),
					n.hooks.run('complete', u),
					void 0
				);
			}
			if ((n.hooks.run('before-highlight', u), r && _self.Worker)) {
				const g = new Worker(n.filename);
				(g.onmessage = function (e) {
					(u.highlightedCode = e.data),
						n.hooks.run('before-insert', u),
						(u.element.innerHTML = u.highlightedCode),
						a && a.call(u.element),
						n.hooks.run('after-highlight', u),
						n.hooks.run('complete', u);
				}),
					g.postMessage(
						JSON.stringify({
							language: u.language,
							code: u.code,
							immediateClose: !0
						})
					);
			} else {
				(u.highlightedCode = n.highlight(
					u.code,
					u.grammar,
					u.language
				)),
					n.hooks.run('before-insert', u),
					(u.element.innerHTML = u.highlightedCode),
					a && a.call(t),
					n.hooks.run('after-highlight', u),
					n.hooks.run('complete', u);
			}
		},
		highlight: function (e, t, a) {
			const l = { code: e, grammar: t, language: a };
			return (
				n.hooks.run('before-tokenize', l),
				(l.tokens = n.tokenize(l.code, l.grammar)),
				n.hooks.run('after-tokenize', l),
				r.stringify(n.util.encode(l.tokens), l.language)
			);
		},
		matchGrammar: function (e, t, r, a, l, i, o) {
			const s = n.Token;
			for (const u in r) {
				if (r.hasOwnProperty(u) && r[u]) {
					if (u == o) return;
					let g = r[u];
					g = n.util.type(g) === 'Array' ? g : [g];
					for (let c = 0; c < g.length; ++c) {
						let h = g[c];
						const f = h.inside;
						const d = !!h.lookbehind;
						const m = !!h.greedy;
						let p = 0;
						const y = h.alias;
						if (m && !h.pattern.global) {
							const v = h.pattern.toString().match(/[imuy]*$/)[0];
							h.pattern = RegExp(h.pattern.source, v + 'g');
						}
						h = h.pattern || h;
						for (
							let b = a, k = l;
							b < t.length;
							k += t[b].length, ++b
						) {
							let w = t[b];
							if (t.length > e.length) return;
							if (!(w instanceof s)) {
								if (m && b != t.length - 1) {
									h.lastIndex = k;
									var _ = h.exec(e);
									if (!_) break;
									for (
										var j = _.index + (d ? _[1].length : 0),
											P = _.index + _[0].length,
											A = b,
											x = k,
											O = t.length;
										O > A &&
										(P > x ||
											(!t[A].type && !t[A - 1].greedy));
										++A
									) {
										(x += t[A].length),
											j >= x && (++b, (k = x));
									}
									if (t[b] instanceof s) continue;
									(I = A - b),
										(w = e.slice(k, x)),
										(_.index -= k);
								} else {
									h.lastIndex = 0;
									var _ = h.exec(w);
									var I = 1;
								}
								if (_) {
									d && (p = _[1] ? _[1].length : 0);
									var j = _.index + p;
									var _ = _[0].slice(p);
									var P = j + _.length;
									const N = w.slice(0, j);
									const S = w.slice(P);
									const C = [b, I];
									N && (++b, (k += N.length), C.push(N));
									const E = new s(
										u,
										f ? n.tokenize(_, f) : _,
										y,
										_,
										m
									);
									if (
										(C.push(E),
										S && C.push(S),
										Array.prototype.splice.apply(t, C),
										I != 1 &&
											n.matchGrammar(
												e,
												t,
												r,
												b,
												k,
												!0,
												u
											),
										i)
									) {
										break;
									}
								} else if (i) break;
							}
						}
					}
				}
			}
		},
		tokenize: function (e, t) {
			const r = [e];
			const a = t.rest;
			if (a) {
				for (const l in a) t[l] = a[l];
				delete t.rest;
			}
			return n.matchGrammar(e, r, t, 0, 0, !1), r;
		},
		hooks: {
			all: {},
			add: function (e, t) {
				const r = n.hooks.all;
				(r[e] = r[e] || []), r[e].push(t);
			},
			run: function (e, t) {
				const r = n.hooks.all[e];
				if (r && r.length) for (var a, l = 0; (a = r[l++]); ) a(t);
			}
		}
	});
	var r = (n.Token = function (e, t, n, r, a) {
		(this.type = e),
			(this.content = t),
			(this.alias = n),
			(this.length = 0 | (r || '').length),
			(this.greedy = !!a);
	});
	if (
		((r.stringify = function (e, t, a) {
			if (typeof e === 'string') return e;
			if (n.util.type(e) === 'Array') {
				return e
					.map(function (n) {
						return r.stringify(n, t, e);
					})
					.join('');
			}
			const l = {
				type: e.type,
				content: r.stringify(e.content, t, a),
				tag: 'span',
				classes: ['token', e.type],
				attributes: {},
				language: t,
				parent: a
			};
			if (e.alias) {
				const i =
					n.util.type(e.alias) === 'Array' ? e.alias : [e.alias];
				Array.prototype.push.apply(l.classes, i);
			}
			n.hooks.run('wrap', l);
			const o = Object.keys(l.attributes)
				.map(function (e) {
					return (
						e +
						'="' +
						(l.attributes[e] || '').replace(/"/g, '&quot;') +
						'"'
					);
				})
				.join(' ');
			return (
				'<' +
				l.tag +
				' class="' +
				l.classes.join(' ') +
				'"' +
				(o ? ' ' + o : '') +
				'>' +
				l.content +
				'</' +
				l.tag +
				'>'
			);
		}),
		!_self.document)
	) {
		return _self.addEventListener
			? (n.disableWorkerMessageHandler ||
					_self.addEventListener(
						'message',
						function (e) {
							const t = JSON.parse(e.data);
							const r = t.language;
							const a = t.code;
							const l = t.immediateClose;
							_self.postMessage(
								n.highlight(a, n.languages[r], r)
							),
								l && _self.close();
						},
						!1
					),
				_self.Prism)
			: _self.Prism;
	}
	const a =
		document.currentScript ||
		[].slice.call(document.getElementsByTagName('script')).pop();
	return (
		a &&
			((n.filename = a.src),
			n.manual ||
				a.hasAttribute('data-manual') ||
				(document.readyState !== 'loading'
					? window.requestAnimationFrame
						? window.requestAnimationFrame(n.highlightAll)
						: window.setTimeout(n.highlightAll, 16)
					: document.addEventListener(
							'DOMContentLoaded',
							n.highlightAll
						))),
		_self.Prism
	);
})();
typeof module !== 'undefined' && module.exports && (module.exports = Prism),
	typeof global !== 'undefined' && (global.Prism = Prism);
(Prism.languages.markup = {
	comment: /<!--[\s\S]*?-->/,
	prolog: /<\?[\s\S]+?\?>/,
	doctype: /<!DOCTYPE[\s\S]+?>/i,
	cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
	tag: {
		pattern:
			/<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		greedy: !0,
		inside: {
			tag: {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ }
			},
			'attr-value': {
				pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
				inside: {
					punctuation: [
						/^=/,
						{ pattern: /(^|[^\\])["']/, lookbehind: !0 }
					]
				}
			},
			punctuation: /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: { namespace: /^[^\s>\/:]+:/ }
			}
		}
	},
	entity: /&#?[\da-z]{1,8};/i
}),
	(Prism.languages.markup.tag.inside['attr-value'].inside.entity =
		Prism.languages.markup.entity),
	Prism.hooks.add('wrap', function (a) {
		a.type === 'entity' &&
			(a.attributes.title = a.content.replace(/&amp;/, '&'));
	}),
	(Prism.languages.xml = Prism.languages.markup),
	(Prism.languages.html = Prism.languages.markup),
	(Prism.languages.mathml = Prism.languages.markup),
	(Prism.languages.svg = Prism.languages.markup);
(Prism.languages.css = {
	comment: /\/\*[\s\S]*?\*\//,
	atrule: {
		pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
		inside: { rule: /@[\w-]+/ }
	},
	url: /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	selector: /[^{}\s][^{};]*?(?=\s*\{)/,
	string: {
		pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: !0
	},
	property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
	important: /\B!important\b/i,
	function: /[-a-z0-9]+(?=\()/i,
	punctuation: /[(){};:]/
}),
	(Prism.languages.css.atrule.inside.rest = Prism.languages.css),
	Prism.languages.markup &&
		(Prism.languages.insertBefore('markup', 'tag', {
			style: {
				pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
				lookbehind: !0,
				inside: Prism.languages.css,
				alias: 'language-css',
				greedy: !0
			}
		}),
		Prism.languages.insertBefore(
			'inside',
			'attr-value',
			{
				'style-attr': {
					pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
					inside: {
						'attr-name': {
							pattern: /^\s*style/i,
							inside: Prism.languages.markup.tag.inside
						},
						punctuation: /^\s*=\s*['"]|['"]\s*$/,
						'attr-value': {
							pattern: /.+/i,
							inside: Prism.languages.css
						}
					},
					alias: 'language-css'
				}
			},
			Prism.languages.markup.tag
		));
Prism.languages.clike = {
	comment: [
		{ pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0 },
		{ pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 }
	],
	string: {
		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: !0
	},
	'class-name': {
		pattern:
			/((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
		lookbehind: !0,
		inside: { punctuation: /[.\\]/ }
	},
	keyword:
		/\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	boolean: /\b(?:true|false)\b/,
	function: /[a-z0-9_]+(?=\()/i,
	number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
	operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	punctuation: /[{}[\];(),.:]/
};
(Prism.languages.javascript = Prism.languages.extend('clike', {
	keyword:
		/\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	number: /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
	function: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
	operator:
		/-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
})),
	Prism.languages.insertBefore('javascript', 'keyword', {
		regex: {
			pattern:
				/((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[[^\]\r\n]+]|\\.|[^\/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
			lookbehind: !0,
			greedy: !0
		},
		'function-variable': {
			pattern:
				/[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
			alias: 'function'
		},
		constant: /\b[A-Z][A-Z\d_]*\b/
	}),
	Prism.languages.insertBefore('javascript', 'string', {
		'template-string': {
			pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
			greedy: !0,
			inside: {
				interpolation: {
					pattern: /\${[^}]+}/,
					inside: {
						'interpolation-punctuation': {
							pattern: /^\${|}$/,
							alias: 'punctuation'
						},
						rest: null
					}
				},
				string: /[\s\S]+/
			}
		}
	}),
	(Prism.languages.javascript[
		'template-string'
	].inside.interpolation.inside.rest = Prism.languages.javascript),
	Prism.languages.markup &&
		Prism.languages.insertBefore('markup', 'tag', {
			script: {
				pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
				lookbehind: !0,
				inside: Prism.languages.javascript,
				alias: 'language-javascript',
				greedy: !0
			}
		}),
	(Prism.languages.js = Prism.languages.javascript);
(Prism.languages['markup-templating'] = {}),
	Object.defineProperties(Prism.languages['markup-templating'], {
		buildPlaceholders: {
			value: function (e, t, n, a) {
				e.language === t &&
					((e.tokenStack = []),
					(e.code = e.code.replace(n, function (n) {
						if (typeof a === 'function' && !a(n)) return n;
						for (
							var r = e.tokenStack.length;
							e.code.indexOf(
								'___' + t.toUpperCase() + r + '___'
							) !== -1;

						) {
							++r;
						}
						return (
							(e.tokenStack[r] = n),
							'___' + t.toUpperCase() + r + '___'
						);
					})),
					(e.grammar = Prism.languages.markup));
			}
		},
		tokenizePlaceholders: {
			value: function (e, t) {
				if (e.language === t && e.tokenStack) {
					e.grammar = Prism.languages[t];
					let n = 0;
					const a = Object.keys(e.tokenStack);
					const r = function (o) {
						if (!(n >= a.length)) {
							for (let i = 0; i < o.length; i++) {
								const g = o[i];
								if (
									typeof g === 'string' ||
									(g.content && typeof g.content === 'string')
								) {
									const c = a[n];
									const s = e.tokenStack[c];
									const l =
										typeof g === 'string' ? g : g.content;
									const p = l.indexOf(
										'___' + t.toUpperCase() + c + '___'
									);
									if (p > -1) {
										++n;
										var f;
										const u = l.substring(0, p);
										const _ = new Prism.Token(
											t,
											Prism.tokenize(s, e.grammar, t),
											'language-' + t,
											s
										);
										const k = l.substring(
											p +
												(
													'___' +
													t.toUpperCase() +
													c +
													'___'
												).length
										);
										if (
											(u || k
												? ((f = [u, _, k].filter(
														function (e) {
															return !!e;
														}
													)),
													r(f))
												: (f = _),
											typeof g === 'string'
												? Array.prototype.splice.apply(
														o,
														[i, 1].concat(f)
													)
												: (g.content = f),
											n >= a.length)
										) {
											break;
										}
									}
								} else {
									g.content &&
										typeof g.content !== 'string' &&
										r(g.content);
								}
							}
						}
					};
					r(e.tokens);
				}
			}
		}
	});
(Prism.languages.json = {
	property: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/i,
	string: { pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/, greedy: !0 },
	number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
	punctuation: /[{}[\]);,]/,
	operator: /:/g,
	boolean: /\b(?:true|false)\b/i,
	null: /\bnull\b/i
}),
	(Prism.languages.jsonp = Prism.languages.json);
!(function (e) {
	(e.languages.php = e.languages.extend('clike', {
		keyword:
			/\b(?:and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
		constant: /\b[A-Z0-9_]{2,}\b/,
		comment: {
			pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
			lookbehind: !0
		}
	})),
		e.languages.insertBefore('php', 'string', {
			'shell-comment': {
				pattern: /(^|[^\\])#.*/,
				lookbehind: !0,
				alias: 'comment'
			}
		}),
		e.languages.insertBefore('php', 'keyword', {
			delimiter: { pattern: /\?>|<\?(?:php|=)?/i, alias: 'important' },
			variable: /\$+(?:\w+\b|(?={))/i,
			package: {
				pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
				lookbehind: !0,
				inside: { punctuation: /\\/ }
			}
		}),
		e.languages.insertBefore('php', 'operator', {
			property: { pattern: /(->)[\w]+/, lookbehind: !0 }
		}),
		e.languages.insertBefore('php', 'string', {
			'nowdoc-string': {
				pattern: /<<<'([^']+)'(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;/,
				greedy: !0,
				alias: 'string',
				inside: {
					delimiter: {
						pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
						alias: 'symbol',
						inside: { punctuation: /^<<<'?|[';]$/ }
					}
				}
			},
			'heredoc-string': {
				pattern:
					/<<<(?:"([^"]+)"(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;|([a-z_]\w*)(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\2;)/i,
				greedy: !0,
				alias: 'string',
				inside: {
					delimiter: {
						pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
						alias: 'symbol',
						inside: { punctuation: /^<<<"?|[";]$/ }
					},
					interpolation: null
				}
			},
			'single-quoted-string': {
				pattern: /'(?:\\[\s\S]|[^\\'])*'/,
				greedy: !0,
				alias: 'string'
			},
			'double-quoted-string': {
				pattern: /"(?:\\[\s\S]|[^\\"])*"/,
				greedy: !0,
				alias: 'string',
				inside: { interpolation: null }
			}
		}),
		delete e.languages.php.string;
	const n = {
		pattern:
			/{\$(?:{(?:{[^{}]+}|[^{}]+)}|[^{}])+}|(^|[^\\{])\$+(?:\w+(?:\[.+?]|->\w+)*)/,
		lookbehind: !0,
		inside: { rest: e.languages.php }
	};
	(e.languages.php['heredoc-string'].inside.interpolation = n),
		(e.languages.php['double-quoted-string'].inside.interpolation = n),
		e.hooks.add('before-tokenize', function (n) {
			if (/(?:<\?php|<\?)/gi.test(n.code)) {
				const i = /(?:<\?php|<\?)[\s\S]*?(?:\?>|$)/gi;
				e.languages['markup-templating'].buildPlaceholders(n, 'php', i);
			}
		}),
		e.hooks.add('after-tokenize', function (n) {
			e.languages['markup-templating'].tokenizePlaceholders(n, 'php');
		});
})(Prism);
Prism.languages.insertBefore('php', 'variable', {
	this: /\$this\b/,
	global: /\$(?:_(?:SERVER|GET|POST|FILES|REQUEST|SESSION|ENV|COOKIE)|GLOBALS|HTTP_RAW_POST_DATA|argc|argv|php_errormsg|http_response_header)\b/,
	scope: {
		pattern: /\b[\w\\]+::/,
		inside: { keyword: /static|self|parent/, punctuation: /::|\\/ }
	}
});
!(function () {
	if (typeof self !== 'undefined' && self.Prism && self.document) {
		let t = [];
		const e = {};
		const n = function () {};
		Prism.plugins.toolbar = {};
		const a = (Prism.plugins.toolbar.registerButton = function (n, a) {
			let o;
			(o =
				typeof a === 'function'
					? a
					: function (t) {
							let e;
							return (
								typeof a.onClick === 'function'
									? ((e = document.createElement('button')),
										(e.type = 'button'),
										e.addEventListener(
											'click',
											function () {
												a.onClick.call(this, t);
											}
										))
									: typeof a.url === 'string'
										? ((e = document.createElement('a')),
											(e.href = a.url))
										: (e = document.createElement('span')),
								(e.textContent = a.text),
								e
							);
						}),
				t.push((e[n] = o));
		});
		const o = (Prism.plugins.toolbar.hook = function (a) {
			const o = a.element.parentNode;
			if (
				o &&
				/pre/i.test(o.nodeName) &&
				!o.parentNode.classList.contains('code-toolbar')
			) {
				const r = document.createElement('div');
				r.classList.add('code-toolbar'),
					o.parentNode.insertBefore(r, o),
					r.appendChild(o);
				const i = document.createElement('div');
				i.classList.add('toolbar'),
					document.body.hasAttribute('data-toolbar-order') &&
						(t = document.body
							.getAttribute('data-toolbar-order')
							.split(',')
							.map(function (t) {
								return e[t] || n;
							})),
					t.forEach(function (t) {
						const e = t(a);
						if (e) {
							const n = document.createElement('div');
							n.classList.add('toolbar-item'),
								n.appendChild(e),
								i.appendChild(n);
						}
					}),
					r.appendChild(i);
			}
		});
		a('label', function (t) {
			const e = t.element.parentNode;
			if (e && /pre/i.test(e.nodeName) && e.hasAttribute('data-label')) {
				let n;
				let a;
				const o = e.getAttribute('data-label');
				try {
					a = document.querySelector('template#' + o);
				} catch (r) {}
				return (
					a
						? (n = a.content)
						: (e.hasAttribute('data-url')
								? ((n = document.createElement('a')),
									(n.href = e.getAttribute('data-url')))
								: (n = document.createElement('span')),
							(n.textContent = o)),
					n
				);
			}
		}),
			Prism.hooks.add('complete', o);
	}
})();
!(function () {
	function e(e) {
		this.defaults = r({}, e);
	}
	function n(e) {
		return e.replace(/-(\w)/g, function (e, n) {
			return n.toUpperCase();
		});
	}
	function t(e) {
		for (var n = 0, t = 0; t < e.length; ++t) {
			e.charCodeAt(t) == '	'.charCodeAt(0) && (n += 3);
		}
		return e.length + n;
	}
	var r =
		Object.assign ||
		function (e, n) {
			for (const t in n) n.hasOwnProperty(t) && (e[t] = n[t]);
			return e;
		};
	(e.prototype = {
		setDefaults: function (e) {
			this.defaults = r(this.defaults, e);
		},
		normalize: function (e, t) {
			t = r(this.defaults, t);
			for (const i in t) {
				const o = n(i);
				i !== 'normalize' &&
					o !== 'setDefaults' &&
					t[i] &&
					this[o] &&
					(e = this[o].call(this, e, t[i]));
			}
			return e;
		},
		leftTrim: function (e) {
			return e.replace(/^\s+/, '');
		},
		rightTrim: function (e) {
			return e.replace(/\s+$/, '');
		},
		tabsToSpaces: function (e, n) {
			return (n = 0 | n || 4), e.replace(/\t/g, new Array(++n).join(' '));
		},
		spacesToTabs: function (e, n) {
			return (
				(n = 0 | n || 4), e.replace(new RegExp(' {' + n + '}', 'g'), '	')
			);
		},
		removeTrailing: function (e) {
			return e.replace(/\s*?$/gm, '');
		},
		removeInitialLineFeed: function (e) {
			return e.replace(/^(?:\r?\n|\r)/, '');
		},
		removeIndent: function (e) {
			const n = e.match(/^[^\S\n\r]*(?=\S)/gm);
			return n && n[0].length
				? (n.sort(function (e, n) {
						return e.length - n.length;
					}),
					n[0].length
						? e.replace(new RegExp('^' + n[0], 'gm'), '')
						: e)
				: e;
		},
		indent: function (e, n) {
			return e.replace(
				/^[^\S\n\r]*(?=\S)/gm,
				new Array(++n).join('	') + '$&'
			);
		},
		breakLines: function (e, n) {
			n = n === !0 ? 80 : 0 | n || 80;
			for (var r = e.split('\n'), i = 0; i < r.length; ++i) {
				if (!(t(r[i]) <= n)) {
					for (
						var o = r[i].split(/(\s+)/g), a = 0, s = 0;
						s < o.length;
						++s
					) {
						const l = t(o[s]);
						(a += l), a > n && ((o[s] = '\n' + o[s]), (a = l));
					}
					r[i] = o.join('');
				}
			}
			return r.join('\n');
		}
	}),
		typeof module !== 'undefined' && module.exports && (module.exports = e),
		typeof Prism !== 'undefined' &&
			((Prism.plugins.NormalizeWhitespace = new e({
				'remove-trailing': !0,
				'remove-indent': !0,
				'left-trim': !0,
				'right-trim': !0
			})),
			Prism.hooks.add('before-sanity-check', function (e) {
				const n = Prism.plugins.NormalizeWhitespace;
				if (
					!e.settings ||
					e.settings['whitespace-normalization'] !== !1
				) {
					if ((!e.element || !e.element.parentNode) && e.code) {
						return (
							(e.code = n.normalize(e.code, e.settings)), void 0
						);
					}
					const t = e.element.parentNode;
					const r = /\bno-whitespace-normalization\b/;
					if (
						e.code &&
						t &&
						t.nodeName.toLowerCase() === 'pre' &&
						!r.test(t.className) &&
						!r.test(e.element.className)
					) {
						for (
							var i = t.childNodes, o = '', a = '', s = !1, l = 0;
							l < i.length;
							++l
						) {
							const c = i[l];
							c == e.element
								? (s = !0)
								: c.nodeName === '#text' &&
									(s
										? (a += c.nodeValue)
										: (o += c.nodeValue),
									t.removeChild(c),
									--l);
						}
						if (
							e.element.children.length &&
							Prism.plugins.KeepMarkup
						) {
							const u = o + e.element.innerHTML + a;
							(e.element.innerHTML = n.normalize(u, e.settings)),
								(e.code = e.element.textContent);
						} else {
							(e.code = o + e.code + a),
								(e.code = n.normalize(e.code, e.settings));
						}
					}
				}
			}));
})();
!(function () {
	if (typeof self !== 'undefined' && self.Prism && self.document) {
		if (!Prism.plugins.toolbar) {
			return (
				console.warn(
					'Show Languages plugin loaded before Toolbar plugin.'
				),
				void 0
			);
		}
		const e = {
			html: 'HTML',
			xml: 'XML',
			svg: 'SVG',
			mathml: 'MathML',
			css: 'CSS',
			clike: 'C-like',
			javascript: 'JavaScript',
			abap: 'ABAP',
			actionscript: 'ActionScript',
			apacheconf: 'Apache Configuration',
			apl: 'APL',
			applescript: 'AppleScript',
			arff: 'ARFF',
			asciidoc: 'AsciiDoc',
			asm6502: '6502 Assembly',
			aspnet: 'ASP.NET (C#)',
			autohotkey: 'AutoHotkey',
			autoit: 'AutoIt',
			basic: 'BASIC',
			csharp: 'C#',
			cpp: 'C++',
			coffeescript: 'CoffeeScript',
			csp: 'Content-Security-Policy',
			'css-extras': 'CSS Extras',
			django: 'Django/Jinja2',
			erb: 'ERB',
			fsharp: 'F#',
			gedcom: 'GEDCOM',
			glsl: 'GLSL',
			graphql: 'GraphQL',
			http: 'HTTP',
			hpkp: 'HTTP Public-Key-Pins',
			hsts: 'HTTP Strict-Transport-Security',
			ichigojam: 'IchigoJam',
			inform7: 'Inform 7',
			json: 'JSON',
			latex: 'LaTeX',
			livescript: 'LiveScript',
			lolcode: 'LOLCODE',
			'markup-templating': 'Markup templating',
			matlab: 'MATLAB',
			mel: 'MEL',
			n4js: 'N4JS',
			nasm: 'NASM',
			nginx: 'nginx',
			nsis: 'NSIS',
			objectivec: 'Objective-C',
			ocaml: 'OCaml',
			opencl: 'OpenCL',
			parigp: 'PARI/GP',
			php: 'PHP',
			'php-extras': 'PHP Extras',
			plsql: 'PL/SQL',
			powershell: 'PowerShell',
			properties: '.properties',
			protobuf: 'Protocol Buffers',
			q: 'Q (kdb+ database)',
			jsx: 'React JSX',
			tsx: 'React TSX',
			renpy: "Ren'py",
			rest: 'reST (reStructuredText)',
			sas: 'SAS',
			sass: 'Sass (Sass)',
			scss: 'Sass (Scss)',
			sql: 'SQL',
			soy: 'Soy (Closure Template)',
			tt2: 'Template Toolkit 2',
			typescript: 'TypeScript',
			vbnet: 'VB.Net',
			vhdl: 'VHDL',
			vim: 'vim',
			'visual-basic': 'Visual Basic',
			wasm: 'WebAssembly',
			wiki: 'Wiki markup',
			xojo: 'Xojo (REALbasic)',
			yaml: 'YAML'
		};
		Prism.plugins.toolbar.registerButton('show-language', function (t) {
			const a = t.element.parentNode;
			if (a && /pre/i.test(a.nodeName)) {
				const s =
					a.getAttribute('data-language') ||
					e[t.language] ||
					(t.language &&
						t.language.substring(0, 1).toUpperCase() +
							t.language.substring(1));
				if (s) {
					const i = document.createElement('span');
					return (i.textContent = s), i;
				}
			}
		});
	}
})();
!(function () {
	if (typeof self !== 'undefined' && self.Prism && self.document) {
		if (!Prism.plugins.toolbar) {
			return (
				console.warn(
					'Copy to Clipboard plugin loaded before Toolbar plugin.'
				),
				void 0
			);
		}
		let o = window.ClipboardJS || void 0;
		o || typeof require !== 'function' || (o = require('clipboard'));
		const e = [];
		if (!o) {
			const t = document.createElement('script');
			const n = document.querySelector('head');
			(t.onload = function () {
				if ((o = window.ClipboardJS)) for (; e.length; ) e.pop()();
			}),
				(t.src =
					'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js'),
				n.appendChild(t);
		}
		Prism.plugins.toolbar.registerButton('copy-to-clipboard', function (t) {
			function n() {
				const e = new o(i, {
					text: function () {
						return t.code;
					}
				});
				e.on('success', function () {
					(i.textContent = 'Copied!'), r();
				}),
					e.on('error', function () {
						(i.textContent = 'Press Ctrl+C to copy'), r();
					});
			}
			function r() {
				setTimeout(function () {
					i.textContent = 'Copy';
				}, 5e3);
			}
			var i = document.createElement('a');
			return (i.textContent = 'Copy'), o ? n() : e.push(n), i;
		});
	}
})();
