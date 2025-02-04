// modified code from https://github.com/umbe1987/sidebar-v2
! function (t) {
    var e = {};

    function n(i) {
        if (e[i]) return e[i].exports;
        var r = e[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return t[i].call(r.exports, r, r.exports, n), r.l = !0, r.exports
    }
    n.m = t, n.c = e, n.d = function (t, e, i) {
        n.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: i
        })
    }, n.r = function (t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }, n.t = function (t, e) {
        if (1 & e && (t = n(t)), 8 & e) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var i = Object.create(null);
        if (n.r(i), Object.defineProperty(i, "default", {
            enumerable: !0,
            value: t
        }), 2 & e && "string" != typeof t)
            for (var r in t) n.d(i, r, function (e) {
                return t[e]
            }.bind(null, r));
        return i
    }, n.n = function (t) {
        var e = t && t.__esModule ? function () {
            return t.default
        } : function () {
            return t
        };
        return n.d(e, "a", e), e
    }, n.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, n.p = "", n(n.s = 0)
}([function (t, e, n) {
    t.exports = n(1)
}, function (t, e, n) {
    "use strict";

    function i() { }
    n.r(e);
    var r = "postrender";
    var s = 0;
    var o = "propertychange",
        a = "function" == typeof Object.assign ? Object.assign : function (t, e) {
            var n = arguments;
            if (null == t) throw new TypeError("Cannot convert undefined or null to object");
            for (var i = Object(t), r = 1, s = arguments.length; r < s; ++r) {
                var o = n[r];
                if (null != o)
                    for (var a in o) o.hasOwnProperty(a) && (i[a] = o[a])
            }
            return i
        };

    function l(t) {
        for (var e in t) delete t[e]
    }

    function c(t, e, n, i) {
        for (var r, s = 0, o = t.length; s < o; ++s)
            if ((r = t[s]).listener === e && r.bindTo === n) return i && (r.deleteIndex = s), r
    }

    function p(t, e) {
        var n = h(t);
        return n ? n[e] : void 0
    }

    function h(t, e) {
        var n = t.ol_lm;
        return !n && e && (n = t.ol_lm = {}), n
    }

    function u(t, e) {
        var n = p(t, e);
        if (n) {
            for (var i = 0, r = n.length; i < r; ++i) t.removeEventListener(e, n[i].boundListener), l(n[i]);
            n.length = 0;
            var s = h(t);
            s && (delete s[e], 0 === Object.keys(s).length && function (t) {
                delete t.ol_lm
            }(t))
        }
    }

    function f(t, e, n, i, r) {
        var s = h(t, !0),
            o = s[e];
        o || (o = s[e] = []);
        var a = c(o, n, i, !1);
        return a ? r || (a.callOnce = !1) : (a = {
            bindTo: i,
            callOnce: !!r,
            listener: n,
            target: t,
            type: e
        }, t.addEventListener(e, function (t) {
            var e = function (e) {
                var n = t.listener,
                    i = t.bindTo || t.target;
                return t.callOnce && _(t), n.call(i, e)
            };
            return t.boundListener = e, e
        }(a)), o.push(a)), a
    }

    function d(t, e, n, i) {
        return f(t, e, n, i, !0)
    }

    function v(t, e, n, i) {
        var r = p(t, e);
        if (r) {
            var s = c(r, n, i, !0);
            s && _(s)
        }
    }

    function _(t) {
        if (t && t.target) {
            t.target.removeEventListener(t.type, t.boundListener);
            var e = p(t.target, t.type);
            if (e) {
                var n = "deleteIndex" in t ? t.deleteIndex : e.indexOf(t); - 1 !== n && e.splice(n, 1), 0 === e.length && u(t.target, t.type)
            }
            l(t)
        }
    }
    var y = function () {
        this.disposed_ = !1
    };
    y.prototype.dispose = function () {
        this.disposed_ || (this.disposed_ = !0, this.disposeInternal())
    }, y.prototype.disposeInternal = function () { };
    var g = y,
        b = function (t) {
            this.propagationStopped, this.type = t, this.target = null
        };
    b.prototype.preventDefault = function () {
        this.propagationStopped = !0
    }, b.prototype.stopPropagation = function () {
        this.propagationStopped = !0
    };
    var m = b,
        O = "change";
    var L = function (t) {
        function e() {
            t.call(this), this.revision_ = 0
        }
        return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.changed = function () {
            ++this.revision_, this.dispatchEvent(O)
        }, e.prototype.getRevision = function () {
            return this.revision_
        }, e.prototype.on = function (t, e) {
            if (Array.isArray(t)) {
                for (var n = t.length, i = new Array(n), r = 0; r < n; ++r) i[r] = f(this, t[r], e);
                return i
            }
            return f(this, t, e)
        }, e.prototype.once = function (t, e) {
            if (Array.isArray(t)) {
                for (var n = t.length, i = new Array(n), r = 0; r < n; ++r) i[r] = d(this, t[r], e);
                return i
            }
            return d(this, t, e)
        }, e.prototype.un = function (t, e) {
            if (Array.isArray(t))
                for (var n = 0, i = t.length; n < i; ++n) v(this, t[n], e);
            else v(this, t, e)
        }, e
    }(function (t) {
        function e() {
            t.call(this), this.pendingRemovals_ = {}, this.dispatching_ = {}, this.listeners_ = {}
        }
        return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.addEventListener = function (t, e) {
            var n = this.listeners_[t];
            n || (n = this.listeners_[t] = []), -1 === n.indexOf(e) && n.push(e)
        }, e.prototype.dispatchEvent = function (t) {
            var e = "string" == typeof t ? new m(t) : t,
                n = e.type;
            e.target = this;
            var r, s = this.listeners_[n];
            if (s) {
                n in this.dispatching_ || (this.dispatching_[n] = 0, this.pendingRemovals_[n] = 0), ++this.dispatching_[n];
                for (var o = 0, a = s.length; o < a; ++o)
                    if (!1 === s[o].call(this, e) || e.propagationStopped) {
                        r = !1;
                        break
                    }
                if (--this.dispatching_[n], 0 === this.dispatching_[n]) {
                    var l = this.pendingRemovals_[n];
                    for (delete this.pendingRemovals_[n]; l--;) this.removeEventListener(n, i);
                    delete this.dispatching_[n]
                }
                return r
            }
        }, e.prototype.disposeInternal = function () {
            ! function (t) {
                var e = h(t);
                if (e)
                    for (var n in e) u(t, n)
            }(this)
        }, e.prototype.getListeners = function (t) {
            return this.listeners_[t]
        }, e.prototype.hasListener = function (t) {
            return t ? t in this.listeners_ : Object.keys(this.listeners_).length > 0
        }, e.prototype.removeEventListener = function (t, e) {
            var n = this.listeners_[t];
            if (n) {
                var r = n.indexOf(e);
                t in this.pendingRemovals_ ? (n[r] = i, ++this.pendingRemovals_[t]) : (n.splice(r, 1), 0 === n.length && delete this.listeners_[t])
            }
        }, e
    }(g)),
        j = function (t) {
            function e(e, n, i) {
                t.call(this, e), this.key = n, this.oldValue = i
            }
            return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e
        }(m),
        w = function (t) {
            function e(e) {
                var n;
                t.call(this), (n = this).ol_uid || (n.ol_uid = String(++s)), this.values_ = {}, void 0 !== e && this.setProperties(e)
            }
            return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.get = function (t) {
                var e;
                return this.values_.hasOwnProperty(t) && (e = this.values_[t]), e
            }, e.prototype.getKeys = function () {
                return Object.keys(this.values_)
            }, e.prototype.getProperties = function () {
                return a({}, this.values_)
            }, e.prototype.notify = function (t, e) {
                var n;
                n = function (t) {
                    return S.hasOwnProperty(t) ? S[t] : S[t] = "change:" + t
                }(t), this.dispatchEvent(new j(n, t, e)), n = o, this.dispatchEvent(new j(n, t, e))
            }, e.prototype.set = function (t, e, n) {
                if (n) this.values_[t] = e;
                else {
                    var i = this.values_[t];
                    this.values_[t] = e, i !== e && this.notify(t, i)
                }
            }, e.prototype.setProperties = function (t, e) {
                for (var n in t) this.set(n, t[n], e)
            }, e.prototype.unset = function (t, e) {
                if (t in this.values_) {
                    var n = this.values_[t];
                    delete this.values_[t], e || this.notify(t, n)
                }
            }, e
        }(L),
        S = {};

    function E(t) {
        return t && t.parentNode ? t.parentNode.removeChild(t) : null
    }
    var x = function (t) {
        function e(e) {
            t.call(this), this.element = e.element ? e.element : null, this.target_ = null, this.map_ = null, this.listenerKeys = [], this.render = e.render ? e.render : i, e.target && this.setTarget(e.target)
        }
        return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.disposeInternal = function () {
            E(this.element), t.prototype.disposeInternal.call(this)
        }, e.prototype.getMap = function () {
            return this.map_
        }, e.prototype.setMap = function (t) {
            this.map_ && E(this.element);
            for (var e = 0, n = this.listenerKeys.length; e < n; ++e) _(this.listenerKeys[e]);
            (this.listenerKeys.length = 0, this.map_ = t, this.map_) && ((this.target_ ? this.target_ : t.getOverlayContainerStopEvent()).appendChild(this.element), this.render !== i && this.listenerKeys.push(f(t, r, this.render, this)), t.render())
        }, e.prototype.setTarget = function (t) {
            this.target_ = "string" == typeof t ? document.getElementById(t) : t
        }, e
    }(w);
    n.d(e, "default", function () {
        return A
    });
    class A extends x {
        constructor(t) {
            var e, n, i = Object.assign({}, {
                element: null,
                position: "left"
            }, t),
                r = document.getElementById(i.element);
            for (super({
                element: r,
                target: i.target
            }), r.classList.add("sidebar-" + i.position), e = r.children.length - 1; e >= 0; e--) "DIV" === (n = r.children[e]).tagName && n.classList.contains("sidebar-content") && (this._container = n);
            for (this._tabitems = r.querySelectorAll("ul.sidebar-tabs > li, .sidebar-tabs > ul > li"), e = this._tabitems.length - 1; e >= 0; e--) this._tabitems[e]._sidebar = this;
            for (this._panes = [], this._closeButtons = [], e = this._container.children.length - 1; e >= 0; e--)
                if ("DIV" == (n = this._container.children[e]).tagName && n.classList.contains("sidebar-pane")) {
                    this._panes.push(n);
                    for (var s = n.querySelectorAll(".sidebar-close"), o = 0, a = s.length; o < a; o++) this._closeButtons.push(s[o])
                }
        }
        setMap(t) {
            var e, n;
            for (e = this._tabitems.length - 1; e >= 0; e--) {
                var i = (n = this._tabitems[e]).querySelector("a");
                i.hasAttribute("href") && "#" == i.getAttribute("href").slice(0, 1) && (i.onclick = this._onClick.bind(n))
            }
            for (e = this._closeButtons.length - 1; e >= 0; e--)(n = this._closeButtons[e]).onclick = this._onCloseClick.bind(this)
        }
        open(t) {
            var e, n;
            for (e = this._panes.length - 1; e >= 0; e--)(n = this._panes[e]).id == t ? n.classList.add("active") : n.classList.contains("active") && n.classList.remove("active");
            for (e = this._tabitems.length - 1; e >= 0; e--)(n = this._tabitems[e]).querySelector("a").hash == "#" + t ? n.classList.add("active") : n.classList.contains("active") && n.classList.remove("active");
            return this.element.classList.contains("collapsed") && this.element.classList.remove("collapsed"), this
        }
        close() {
            for (var t = this._tabitems.length - 1; t >= 0; t--) {
                var e = this._tabitems[t];
                e.classList.contains("active") && e.classList.remove("active")
            }
            return this.element.classList.contains("collapsed") || this.element.classList.add("collapsed"), this
        }
        _onClick(t) {
            t.preventDefault(), this.classList.contains("active") ? this._sidebar.close() : this.classList.contains("disabled") || this._sidebar.open(this.querySelector("a").hash.slice(1))
        }
        _onCloseClick() {
            this.close()
        }
    }
    window.ol && window.ol.control && (window.ol.control.Sidebar = A)
}]);