var Recorder = {
    swfObject: null,
    _callbacks: {},
    _events: {},
    _initialized: !1,
    options: {},
    initialize: function(a) {
        this.options = a || {},
            this.options.flashContainer ||
            this._setupFlashContainer(),
            this.bind(
                "initialized",
                function() {
                    Recorder._initialized = !
                        0, a.initialized()
                }), this.bind(
                "showFlash",
                this.options.onFlashSecurity ||
                this._defaultOnShowFlash
            ), this._loadFlash()
    },
    clear: function() {
        Recorder._events = {}
    },
    record: function(a) {
        a = a || {},
            this.clearBindings(
                "recordingStart"
            ), this.clearBindings(
                "recordingProgress"
            ), this.clearBindings(
                "recordingCancel"
            ),
            this.bind(
                "recordingStart",
                this._defaultOnHideFlash
            ),
            this.bind(
                "recordingCancel",
                this._defaultOnHideFlash
            ),
            this.bind(
                "recordingCancel",
                this._loadFlash
            ),
            this.bind(
                "recordingStart",
                a.start), this.bind(
                "recordingProgress",
                a.progress),
            this.bind(
                "recordingCancel",
                a.cancel), this
            .flashInterface()
            .record()
    },
    stop: function() {
        return this.flashInterface()
            ._stop()
    },
    play: function(a) {
        a = a || {}, this.clearBindings(
                "playingProgress"
            ),
            this.bind(
                "playingProgress",
                a.progress),
            this.bind(
                "playingStop",
                a.finished),
            this.flashInterface()
            ._play()
    },
    upload: function(a) {
        a.audioParam = a.audioParam ||
            "audio", a.params =
            a.params || {},
            this.clearBindings(
                "uploadSuccess"
            ), this.bind(
                "uploadSuccess",
                function(b) {
                    a.success(
                        Recorder
                        ._externalInterfaceDecode(
                            b
                        ))
                }),
            this.flashInterface()
            .upload(a.url, a.audioParam,
                a.params)
    },
    audioData: function() {
        return this.flashInterface()
            .audioData().split(
                ";")
    },
    request: function(a, b, c, d, e) {
        var f = this.registerCallback(
            e);
        this.flashInterface().request(
            a, b, c, d, f)
    },
    clearBindings: function(a) {
        Recorder._events[a] = []
    },
    bind: function(a, b) {
        Recorder._events[a] ||
            (Recorder._events[a] = []),
            Recorder._events[a]
            .push(b)
    },
    triggerEvent: function(a, b, c) {
        Recorder._executeInWindowContext(
            function() {
                for (var d in
                        Recorder
                        ._events[
                            a
                        ])
                    Recorder
                    ._events[
                        a][
                        d
                    ] &&
                    Recorder
                    ._events[
                        a][
                        d
                    ].apply(
                        Recorder, [
                            b,
                            c
                        ])
            })
    },
    triggerCallback: function(a, b) {
        Recorder._executeInWindowContext(
            function() {
                Recorder._callbacks[
                    a].apply(
                    null,
                    b)
            })
    },
    registerCallback: function(a) {
        var b = "CB" + parseInt(
            Math.random() *
            999999, 10);
        return Recorder._callbacks[
            b] = a, b
    },
    flashInterface: function() {
        if (!this.swfObject)
            return null;
        if (this.swfObject.record)
            return this.swfObject;
        if (this.swfObject.children[
                3].record)
            return this.swfObject
                .children[3]
    },
    _executeInWindowContext: function(
        a) {
        window.setTimeout(a, 1)
    },
    _setupFlashContainer: function() {
        this.options.flashContainer =
            document.createElement(
                "div"), this.options
            .flashContainer.setAttribute(
                "id",
                "recorderFlashContainer"
            ), this.options
            .flashContainer.setAttribute(
                "style",
                "position: fixed; left: -9999px; top: -9999px; width: 230px; height: 140px; margin-left: 10px; border-top: 6px solid rgba(128, 128, 128, 0.6); border-bottom: 6px solid rgba(128, 128, 128, 0.6); border-radius: 5px 5px; padding-bottom: 1px; padding-right: 1px;"
            ), document.body.appendChild(
                this.options.flashContainer
            )
    },
    _clearFlash: function() {
        var a = this.options.flashContainer
            .children[0];
        a && this.options.flashContainer
            .removeChild(a)
    },
    _loadFlash: function() {
        this._clearFlash();
        var a = document.createElement(
            "div");
        a.setAttribute("id",
                "recorderFlashObject"
            ), this.options
            .flashContainer.appendChild(
                a), swfobject.embedSWF(
                this.options.swfSrc,
                "recorderFlashObject",
                "231", "141",
                "10.1.0",
                undefined,
                undefined, {
                    allowscriptaccess: "always"
                }, undefined,
                function(a) {
                    a.success ?
                        (
                            Recorder
                            .swfObject =
                            a.ref,
                            Recorder
                            ._checkForFlashBlock()
                        ) :
                        Recorder
                        ._showFlashRequiredDialog()
                })
    },
    _defaultOnShowFlash: function() {
        var a = Recorder.options
            .flashContainer;
        a.style.left = (window.innerWidth ||
                document.body.offsetWidth
            ) /
            2 - 115 + "px", a.style
            .top = (window.innerHeight ||
                document.body.offsetHeight
            ) / 2 - 70 + "px"
    },
    _defaultOnHideFlash: function() {
        var a = Recorder.options
            .flashContainer;
        a.style.left =
            "-9999px", a.style.top =
            "-9999px"
    },
    _checkForFlashBlock: function() {
        window.setTimeout(
            function() {
                Recorder._initialized ||
                    Recorder
                    .triggerEvent(
                        "showFlash"
                    )
            }, 500)
    },
    _showFlashRequiredDialog: function() {
        Recorder.options.flashContainer
            .innerHTML =
            "<p>Adobe Flash Player 10.1 or newer is required to use this feature.</p><p><a href='http://get.adobe.com/flashplayer' target='_top'>Get it on Adobe.com.</a></p>",
            Recorder.options.flashContainer
            .style.color =
            "white", Recorder.options
            .flashContainer.style
            .backgroundColor =
            "#777", Recorder.options
            .flashContainer.style
            .textAlign =
            "center", Recorder.triggerEvent(
                "showFlash")
    },
    _externalInterfaceDecode: function(
        a) {
        return a.replace(/%22/g,
            '"').replace(
            /%5c/g, "\\").replace(
            /%26/g, "&").replace(
            /%25/g, "%")
    }
};
if (swfobject == undefined) var
    swfobject = function() {
        function A() {
            if (t) return;
            try {
                var a = i.getElementsByTagName(
                    "body")[0].appendChild(
                    Q("span"));
                a.parentNode.removeChild(
                    a)
            } catch (b) {
                return
            }
            t = !0;
            var c = l.length;
            for (var d = 0; d < c; d++)
                l[d]()
        }

        function B(a) {
            t ? a() : l[l.length] =
                a
        }

        function C(b) {
            if (typeof h.addEventListener !=
                a) h.addEventListener(
                "load", b, !1);
            else if (typeof i.addEventListener !=
                a) i.addEventListener(
                "load", b, !1);
            else if (typeof h.attachEvent !=
                a) R(h, "onload", b);
            else if (typeof h.onload ==
                "function") {
                var c = h.onload;
                h.onload = function() {
                    c(), b()
                }
            } else h.onload = b
        }

        function D() {
            k ? E() : F()
        }

        function E() {
            var c = i.getElementsByTagName(
                    "body")[0],
                d = Q(b);
            d.setAttribute("type",
                e);
            var f = c.appendChild(d);
            if (f) {
                var g = 0;
                (function() {
                    if (typeof f
                        .GetVariable !=
                        a) {
                        var b =
                            f.GetVariable(
                                "$version"
                            );
                        b && (b =
                            b
                            .split(
                                " "
                            )[
                                1
                            ]
                            .split(
                                ","
                            ),
                            y
                            .pv = [
                                parseInt(
                                    b[
                                        0
                                    ],
                                    10
                                ),
                                parseInt(
                                    b[
                                        1
                                    ],
                                    10
                                ),
                                parseInt(
                                    b[
                                        2
                                    ],
                                    10
                                )
                            ]
                        )
                    } else if (
                        g < 10) {
                        g++,
                        setTimeout
                            (
                                arguments
                                .callee,
                                10
                            );
                        return
                    }
                    c.removeChild(
                            d),
                        f =
                        null, F()
                })()
            } else F()
        }

        function F() {
            var b = m.length;
            if (b > 0)
                for (var c = 0; c <
                    b; c++) {
                    var d = m[c].id,
                        e = m[c].callbackFn,
                        f = {
                            success:
                                !1,
                            id: d
                        };
                    if (y.pv[0] > 0) {
                        var g = P(d);
                        if (g)
                            if (S(m[
                                        c
                                    ]
                                    .swfVersion
                                ) &&
                                !(y
                                    .wk &&
                                    y
                                    .wk <
                                    312
                                )) U(
                                    d, !
                                    0
                                ),
                                e &&
                                (f
                                    .success = !
                                    0,
                                    f
                                    .ref =
                                    G(
                                        d
                                    ),
                                    e(
                                        f
                                    )
                                );
                            else if (
                            m[c].expressInstall &&
                            H()) {
                            var h = {};
                            h.data =
                                m[c]
                                .expressInstall,
                                h.width =
                                g.getAttribute(
                                    "width"
                                ) ||
                                "0",
                                h
                                .height =
                                g.getAttribute(
                                    "height"
                                ) ||
                                "0",
                                g.getAttribute(
                                    "class"
                                ) &&
                                (
                                    h
                                    .styleclass =
                                    g
                                    .getAttribute(
                                        "class"
                                    )
                                ),
                                g.getAttribute(
                                    "align"
                                ) &&
                                (h.align =
                                    g
                                    .getAttribute(
                                        "align"
                                    )
                                );
                            var i = {},
                                j =
                                g.getElementsByTagName(
                                    "param"
                                ),
                                k =
                                j.length;
                            for (
                                var
                                    l =
                                    0; l <
                                k; l++
                            ) j[l].getAttribute(
                                    "name"
                                ).toLowerCase() !=
                                "movie" &&
                                (i[
                                        j[
                                            l
                                        ]
                                        .getAttribute(
                                            "name"
                                        )
                                    ] =
                                    j[
                                        l
                                    ]
                                    .getAttribute(
                                        "value"
                                    )
                                );
                            I(h, i,
                                d,
                                e
                            )
                        } else J(g),
                            e && e(
                                f)
                    } else {
                        U(d, !0);
                        if (e) {
                            var n =
                                G(d);
                            n &&
                                typeof n
                                .SetVariable !=
                                a &&
                                (f.success = !
                                    0,
                                    f
                                    .ref =
                                    n
                                ),
                                e(f)
                        }
                    }
                }
        }

        function G(c) {
            var d = null,
                e = P(c);
            if (e && e.nodeName ==
                "OBJECT")
                if (typeof e.SetVariable !=
                    a) d = e;
                else {
                    var f = e.getElementsByTagName(
                        b)[0];
                    f && (d = f)
                }
            return d
        }

        function H() {
            return !u && S("6.0.65") &&
                (y.win || y.mac) &&
                !(y.wk &&
                    y.wk < 312)
        }

        function I(b, c, d, e) {
            u = !0, r = e || null,
                s = {
                    success: !1,
                    id: d
                };
            var g = P(d);
            if (g) {
                g.nodeName ==
                    "OBJECT" ? (p =
                        K(g), q =
                        null) : (
                        p = g, q =
                        d), b.id =
                    f;
                if (typeof b.width ==
                    a || !/%$/.test(
                        b.width) &&
                    parseInt(b.width,
                        10) < 310) b
                    .width = "310";
                if (typeof b.height ==
                    a || !/%$/.test(
                        b.height) &&
                    parseInt(b.height,
                        10) < 137) b
                    .height =
                    "137";
                i.title = i.title.slice(
                        0, 47) +
                    " - Flash Player Installation";
                var j = y.ie && y.win ?
                    "ActiveX" :
                    "PlugIn",
                    k =
                    "MMredirectURL=" +
                    encodeURI(h.location)
                    .toString()
                    .replace(/&/g,
                        "%26") +
                    "&MMplayerType=" +
                    j +
                    "&MMdoctitle=" +
                    i.title;
                typeof c.flashvars !=
                    a ? c.flashvars +=
                    "&" + k :
                    c.flashvars = k;
                if (y.ie && y.win &&
                    g.readyState !=
                    4) {
                    var l = Q("div");
                    d +=
                        "SWFObjectNew",
                        l.setAttribute(
                            "id", d
                        ),
                        g.parentNode
                        .insertBefore(
                            l, g),
                        g.style.display =
                        "none",
                        function() {
                            g.readyState ==
                                4 ?
                                g.parentNode
                                .removeChild(
                                    g
                                ) :
                                setTimeout(
                                    arguments
                                    .callee,
                                    10
                                )
                        }()
                }
                L(b, c, d)
            }
        }

        function J(a) {
            if (y.ie && y.win && a.readyState !=
                4) {
                var b = Q("div");
                a.parentNode.insertBefore(
                        b, a), b.parentNode
                    .replaceChild(
                        K(a), b), a
                    .style.display =
                    "none",
                    function() {
                        a.readyState ==
                            4 ? a.parentNode
                            .removeChild(
                                a) :
                            setTimeout(
                                arguments
                                .callee,
                                10)
                    }()
            } else a.parentNode.replaceChild(
                K(a), a)
        }

        function K(a) {
            var c = Q("div");
            if (y.win && y.ie) c.innerHTML =
                a.innerHTML;
            else {
                var d = a.getElementsByTagName(
                    b)[0];
                if (d) {
                    var e = d.childNodes;
                    if (e) {
                        var f = e.length;
                        for (var g =
                                0; g <
                            f; g++)
                            (e[g].nodeType !=
                                1 ||
                                e[g]
                                .nodeName !=
                                "PARAM"
                            ) &&
                            e[g].nodeType !=
                            8 && c.appendChild(
                                e[
                                    g
                                ].cloneNode(!
                                    0
                                ))
                    }
                }
            }
            return c
        }

        function L(c, d, f) {
            var g, h = P(f);
            if (y.wk && y.wk < 312)
                return g;
            if (h) {
                typeof c.id == a &&
                    (c.id = f);
                if (y.ie && y.win) {
                    var i = "";
                    for (var j in c)
                        c[j] !=
                        Object.prototype[
                            j] &&
                        (j.toLowerCase() ==
                            "data" ?
                            d.movie =
                            c[
                                j] :
                            j.toLowerCase() ==
                            "styleclass" ?
                            i +=
                            ' class="' +
                            c[j] +
                            '"' : j
                            .toLowerCase() !=
                            "classid" &&
                            (i +=
                                " " +
                                j +
                                '="' +
                                c[j] +
                                '"'
                            ));
                    var k = "";
                    for (var l in d)
                        d[l] !=
                        Object.prototype[
                            l] &&
                        (k +=
                            '<param name="' +
                            l +
                            '" value="' +
                            d[l] +
                            '" />');
                    h.outerHTML =
                        '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' +
                        i + ">" + k +
                        "</object>",
                        n[n.length] =
                        c.id, g = P(
                            c.id)
                } else {
                    var m = Q(b);
                    m.setAttribute(
                        "type",
                        e);
                    for (var o in c)
                        c[o] !=
                        Object.prototype[
                            o] &&
                        (o.toLowerCase() ==
                            "styleclass" ?
                            m.setAttribute(
                                "class",
                                c[o]
                            ) : o.toLowerCase() !=
                            "classid" &&
                            m.setAttribute(
                                o,
                                c[o]
                            ));
                    for (var p in d)
                        d[p] !=
                        Object.prototype[
                            p] &&
                        p.toLowerCase() !=
                        "movie" &&
                        M(m, p, d[p]);
                    h.parentNode.replaceChild(
                            m, h),
                        g = m
                }
            }
            return g
        }

        function M(a, b, c) {
            var d = Q("param");
            d.setAttribute("name",
                    b), d.setAttribute(
                    "value", c),
                a.appendChild(d)
        }

        function N(a) {
            var b = P(a);
            b && b.nodeName ==
                "OBJECT" && (y.ie &&
                    y.win ? (b.style
                        .display =
                        "none",
                        function() {
                            b.readyState ==
                                4 ?
                                O(a) :
                                setTimeout(
                                    arguments
                                    .callee,
                                    10
                                )
                        }()) : b.parentNode
                    .removeChild(b)
                )
        }

        function O(a) {
            var b = P(a);
            if (b) {
                for (var c in b)
                    typeof b[c] ==
                    "function" && (
                        b[
                            c] =
                        null);
                b.parentNode.removeChild(
                    b)
            }
        }

        function P(a) {
            var b = null;
            try {
                b = i.getElementById(
                    a)
            } catch (c) {}
            return b
        }

        function Q(a) {
            return i.createElement(
                a)
        }

        function R(a, b, c) {
            a.attachEvent(b, c), o[
                o.length] = [a,
                b, c
            ]
        }

        function S(a) {
            var b = y.pv,
                c = a.split(".");
            return c[0] = parseInt(
                    c[0], 10), c[1] =
                parseInt(c[1],
                    10) || 0, c[2] =
                parseInt(c[2], 10) ||
                0, b[0] >
                c[0] || b[0] == c[0] &&
                b[1] > c[1] || b[0] ==
                c[
                    0] && b[1] == c[
                    1] && b[2] >= c[
                    2] ? !0 : !1
        }

        function T(c, d, e, f) {
            if (y.ie && y.mac)
                return;
            var g = i.getElementsByTagName(
                "head")[0];
            if (!g) return;
            var h = e && typeof e ==
                "string" ? e :
                "screen";
            f && (v = null, w =
                null);
            if (!v || w != h) {
                var j = Q("style");
                j.setAttribute(
                        "type",
                        "text/css"),
                    j.setAttribute(
                        "media", h),
                    v = g.appendChild(
                        j), y.ie &&
                    y.win && typeof i
                    .styleSheets !=
                    a && i.styleSheets
                    .length > 0 &&
                    (v = i.styleSheets[
                        i.styleSheets
                        .length -
                        1]), w = h
            }
            y.ie && y.win ? v &&
                typeof v.addRule ==
                b && v.addRule(
                    c, d) : v &&
                typeof i.createTextNode !=
                a &&
                v.appendChild(i.createTextNode(
                    c + " {" +
                    d + "}"))
        }

        function U(a, b) {
            if (!x) return;
            var c = b ? "visible" :
                "hidden";
            t && P(a) ? P(a).style.visibility =
                c : T("#" + a,
                    "visibility:" +
                    c)
        }

        function V(b) {
            var c = /[\\\"<>\.;]/,
                d = c.exec(b) !=
                null;
            return d && typeof encodeURIComponent !=
                a ?
                encodeURIComponent(
                    b) : b
        }
        var a = "undefined",
            b = "object",
            c = "Shockwave Flash",
            d =
            "ShockwaveFlash.ShockwaveFlash",
            e =
            "application/x-shockwave-flash",
            f = "SWFObjectExprInst",
            g =
            "onreadystatechange",
            h = window,
            i = document,
            j = navigator,
            k = !1,
            l = [D],
            m = [],
            n = [],
            o = [],
            p, q, r, s, t = !1,
            u = !1,
            v, w, x = !0,
            y = function() {
                var f = typeof i.getElementById !=
                    a && typeof i.getElementsByTagName !=
                    a && typeof i.createElement !=
                    a,
                    g = j.userAgent
                    .toLowerCase(),
                    l = j.platform.toLowerCase(),
                    m = l ? /win/.test(
                        l) : /win/.test(
                        g),
                    n = l ? /mac/.test(
                        l) : /mac/.test(
                        g),
                    o = /webkit/.test(
                        g) ?
                    parseFloat(g.replace(
                        /^.*webkit\/(\d+(\.\d+)?).*$/,
                        "$1")) : !
                    1,
                    p = !1,
                    q = [0, 0, 0],
                    r = null;
                if (typeof j.plugins !=
                    a && typeof j.plugins[
                        c] ==
                    b) r = j.plugins[
                        c].description,
                    r && (typeof j
                        .mimeTypes ==
                        a || !j.mimeTypes[
                            e] || !
                        !j
                        .mimeTypes[
                            e].enabledPlugin
                    ) && (k = !0,
                        p = !1, r =
                        r.replace(
                            /^.*\s+(\S+\s+\S+$)/,
                            "$1"),
                        q[0] =
                        parseInt(r.replace(
                                /^(.*)\..*$/,
                                "$1"
                            ),
                            10), q[
                            1] =
                        parseInt(r.replace(
                            /^.*\.(.*)\s.*$/,
                            "$1"
                        ), 10), q[2] =
                        /[a-zA-Z]/.test(
                            r) ?
                        parseInt(r.replace(
                            /^.*[a-zA-Z]+(.*)$/,
                            "$1"
                        ), 10) : 0);
                else if (typeof h.ActiveXObject !=
                    a) try {
                    var s = new ActiveXObject(
                        d);
                    s && (r = s
                        .GetVariable(
                            "$version"
                        ),
                        r &&
                        (p = !
                            0,
                            r =
                            r
                            .split(
                                " "
                            )[
                                1
                            ]
                            .split(
                                ","
                            ),
                            q = [
                                parseInt(
                                    r[
                                        0
                                    ],
                                    10
                                ),
                                parseInt(
                                    r[
                                        1
                                    ],
                                    10
                                ),
                                parseInt(
                                    r[
                                        2
                                    ],
                                    10
                                )
                            ]
                        ))
                } catch (t) {}
                return {
                    w3: f,
                    pv: q,
                    wk: o,
                    ie: p,
                    win: m,
                    mac: n
                }
            }(),
            z = function() {
                if (!y.w3) return;
                (typeof i.readyState !=
                    a && i.readyState ==
                    "complete" ||
                    typeof i.readyState ==
                    a && (i.getElementsByTagName(
                            "body")[
                            0] || i
                        .body)) &&
                A(), t || (
                    typeof i.addEventListener !=
                    a && i.addEventListener(
                        "DOMContentLoaded",
                        A, !1),
                    y.ie && y
                    .win && (i.attachEvent(
                            g,
                            function() {
                                i
                                    .readyState ==
                                    "complete" &&
                                    (
                                        i
                                        .detachEvent(
                                            g,
                                            arguments
                                            .callee
                                        ),
                                        A()
                                    )
                            }),
                        h ==
                        top &&

                        function() {
                            if (
                                t
                            )
                                return;
                            try {
                                i
                                    .documentElement
                                    .doScroll(
                                        "left"
                                    )
                            } catch (
                                a
                            ) {
                                setTimeout
                                    (
                                        arguments
                                        .callee,
                                        0
                                    );
                                return
                            }
                            A()
                        }()), y
                    .wk &&
                    function() {
                        if (t)
                            return;
                        if (!
                            /loaded|complete/
                            .test(
                                i
                                .readyState
                            )) {
                            setTimeout
                                (
                                    arguments
                                    .callee,
                                    0
                                );
                            return
                        }
                        A()
                    }(), C(A))
            }(),
            W = function() {
                y.ie && y.win &&
                    window.attachEvent(
                        "onunload",
                        function() {
                            var a =
                                o.length;
                            for (
                                var
                                    b =
                                    0; b <
                                a; b++
                            ) o[b][
                                0
                            ].detachEvent(
                                o[
                                    b
                                ]
                                [
                                    1
                                ],
                                o[
                                    b
                                ]
                                [
                                    2
                                ]
                            );
                            var c =
                                n.length;
                            for (
                                var
                                    d =
                                    0; d <
                                c; d++
                            ) N(n[d]);
                            for (
                                var
                                    e in
                                    y
                            ) y[e] =
                                null;
                            y =
                                null;
                            for (
                                var
                                    f in
                                    swfobject
                            )
                                swfobject[
                                    f
                                ] =
                                null;
                            swfobject
                                =
                                null
                        })
            }();
        return {
            registerObject: function(
                a, b, c, d) {
                if (y.w3 && a &&
                    b) {
                    var e = {};
                    e.id = a, e
                        .swfVersion =
                        b, e.expressInstall =
                        c, e.callbackFn =
                        d, m[m.length] =
                        e,
                        U(a, !1)
                } else d && d({
                    success:
                        !
                        1,
                    id: a
                })
            },
            getObjectById: function(
                a) {
                if (y.w3) return G(
                    a)
            },
            embedSWF: function(c, d,
                e, f, g, h, i,
                j, k, l) {
                var m = {
                    success:
                        !1,
                    id: d
                };
                y.w3 && !(y.wk &&
                        y.wk <
                        312) &&
                    c && d && e &&
                    f && g ? (U(
                            d, !
                            1),
                        B(
                            function() {
                                e
                                    +=
                                    "",
                                    f +=
                                    "";
                                var
                                    n = {};
                                if (
                                    k &&
                                    typeof k ===
                                    b
                                )
                                    for (
                                        var
                                            o in
                                            k
                                    )
                                        n[
                                            o
                                        ] =
                                        k[
                                            o
                                        ];
                                n
                                    .data =
                                    c,
                                    n
                                    .width =
                                    e,
                                    n
                                    .height =
                                    f;
                                var
                                    p = {};
                                if (
                                    j &&
                                    typeof j ===
                                    b
                                )
                                    for (
                                        var
                                            q in
                                            j
                                    )
                                        p[
                                            q
                                        ] =
                                        j[
                                            q
                                        ];
                                if (
                                    i &&
                                    typeof i ===
                                    b
                                )
                                    for (
                                        var
                                            r in
                                            i
                                    )
                                        typeof p
                                        .flashvars !=
                                        a ?
                                        p
                                        .flashvars +=
                                        "&" +
                                        r +
                                        "=" +
                                        i[
                                            r
                                        ] :
                                        p
                                        .flashvars =
                                        r +
                                        "=" +
                                        i[
                                            r
                                        ];
                                if (
                                    S(
                                        g
                                    )
                                ) {
                                    var
                                        s =
                                        L(
                                            n,
                                            p,
                                            d
                                        );
                                    n
                                        .id ==
                                        d &&
                                        U(
                                            d, !
                                            0
                                        ),
                                        m
                                        .success = !
                                        0,
                                        m
                                        .ref =
                                        s
                                } else {
                                    if (
                                        h &&
                                        H()
                                    ) {
                                        n
                                            .data =
                                            h,
                                            I(
                                                n,
                                                p,
                                                d,
                                                l
                                            );
                                        return
                                    }
                                    U
                                        (
                                            d, !
                                            0
                                        )
                                }
                                l
                                    &&
                                    l(
                                        m
                                    )
                            })) :
                    l && l(m)
            },
            switchOffAutoHideShow: function() {
                x = !1
            },
            ua: y,
            getFlashPlayerVersion: function() {
                return {
                    major: y.pv[
                        0],
                    minor: y.pv[
                        1],
                    release: y.pv[
                        2]
                }
            },
            hasFlashPlayerVersion: S,
            createSWF: function(a,
                b, c) {
                return y.w3 ? L(
                        a, b, c
                    ) :
                    undefined
            },
            showExpressInstall: function(
                a, b, c, d) {
                y.w3 && H() &&
                    I(a, b, c,
                        d)
            },
            removeSWF: function(a) {
                y.w3 && N(a)
            },
            createCSS: function(a,
                b, c, d) {
                y.w3 && T(a, b,
                    c, d)
            },
            addDomLoadEvent: B,
            addLoadEvent: C,
            getQueryParamValue: function(
                a) {
                var b = i.location
                    .search ||
                    i.location.hash;
                if (b) {
                    /\?/.test(b) &&
                        (b = b.split(
                            "?"
                        )[1]);
                    if (a ==
                        null)
                        return V(
                            b
                        );
                    var c = b.split(
                        "&"
                    );
                    for (var d =
                            0; d <
                        c.length; d++
                    )
                        if (c[d]
                            .substring(
                                0,
                                c[
                                    d
                                ]
                                .indexOf(
                                    "="
                                )
                            ) ==
                            a)
                            return V(
                                c[
                                    d
                                ]
                                .substring(
                                    c[
                                        d
                                    ]
                                    .indexOf(
                                        "="
                                    ) +
                                    1
                                )
                            )
                }
                return ""
            },
            expressInstallCallback: function() {
                if (u) {
                    var a = P(f);
                    a && p && (
                            a.parentNode
                            .replaceChild(
                                p,
                                a
                            ),
                            q &&
                            (U(
                                    q, !
                                    0
                                ),
                                y
                                .ie &&
                                y
                                .win &&
                                (
                                    p
                                    .style
                                    .display =
                                    "block"
                                )
                            ),
                            r &&
                            r(s)
                        ), u = !
                        1
                }
            }
        }
    }();
var __hasProp = Object.prototype.hasOwnProperty;
window.SC = window.SC || {}, window.SC.URI =
    function(a, b) {
        var c, d;
        return a == null && (a = ""), b ==
            null && (b = {}), d =
            /^(?:([^:\/?\#]+):)?(?:\/\/([^\/?\#]*))?([^?\#]*)(?:\?([^\#]*))?(?:\#(.*))?/,
            c =
            /^(?:([^@]*)@)?([^:]*)(?::(\d*))?/,
            this.scheme =
            this.user = this.password =
            this.host = this.port =
            this.path =
            this.query = this.fragment =
            null, this.toString =
            function() {
                var a;
                return a = "", this.isAbsolute() &&
                    (a += this.scheme,
                        a += "://",
                        this.user !=
                        null && (a +=
                            this.user +
                            ":" + this.password +
                            "@"), a +=
                        this.host,
                        this.port !=
                        null && (a +=
                            ":" + this.port
                        )),
                    a += this.path,
                    this.path === "" &&
                    (this.query !=
                        null || this.fragment !=
                        null) && (a +=
                        "/"),
                    this.query != null &&
                    (a += this.encodeParamsWithPrepend(
                        this.query,
                        "?")), this.fragment !=
                    null && (
                        a += this.encodeParamsWithPrepend(
                            this.fragment,
                            "#")), a
            }, this.isRelative =
            function() {
                return !this.isAbsolute()
            }, this.isAbsolute =
            function() {
                return this.host !=
                    null
            }, this.decodeParams =
            function(a) {
                var b, c, d, e, f, g, h,
                    i;
                a == null && (a = ""),
                    c = {}, i = a.split(
                        "&");
                for (g = 0, h = i.length; g <
                    h; g++) d = i[g], d !==
                    "" && (e = d.split(
                            "="), b =
                        decodeURIComponent(
                            e[
                                0]), f =
                        decodeURIComponent(
                            e[1] || "")
                        .replace(
                            /\+/g, " "),
                        this.normalizeParams(
                            c, b, f));
                return c
            }, this.normalizeParams =
            function(a, b, c) {
                var d, e, f, g, h, i;
                return c == null && (c =
                        NULL), h = b.match(
                        /^[\[\]]*([^\[\]]+)\]*(.*)/
                    ), f = h[1] || "",
                    d = h[2] || "", d ===
                    "" ? a[f] = c : d ===
                    "[]" ?
                    (a[f] || (a[f] = []),
                        a[f].push(c)) :
                    (i = d.match(
                        /^\[\]\[([^\[\]]+)\]$/
                    ) || (i = d.match(
                        /^\[\](.+)$/
                    ))) ? (e = i[1], a[
                            f] || (a[f] = []),
                        g = a[f][a[f].length -
                            1
                        ], g != null &&
                        g.constructor ===
                        Object && g[e] ==
                        null ? this.normalizeParams(
                            g, e, c) :
                        a[f].push(this.normalizeParams({},
                            e, c))) : (
                        a[f] || (a[f] = {}),
                        a[f] =
                        this.normalizeParams(
                            a[f], d, c)
                    ), a
            }, this.encodeParamsWithPrepend =
            function(a, b) {
                var c;
                return c = this.encodeParams(
                        a), c !== "" ?
                    b + c :
                    ""
            }, this.encodeParams =
            function(a) {
                var b, c, d, e, f, g, h,
                    i;
                f = "";
                if (a.constructor ===
                    String) return f =
                    a;
                b = this.flattenParams(
                    a), d = [];
                for (h = 0, i = b.length; h <
                    i; h++) e = b[h], c =
                    e[
                        0], g = e[1], g ===
                    null ? d.push(c) :
                    d.push(
                        c + "=" +
                        encodeURIComponent(
                            g));
                return f = d.join("&")
            }, this.flattenParams =
            function(a, b, c) {
                var d, e, f, g, h;
                b == null && (b = ""),
                    c == null && (c = []);
                if (a == null) b !=
                    null && c.push([b,
                        null
                    ]);
                else if (a.constructor ===
                    Object)
                    for (d in a) {
                        if (!__hasProp.call(
                                a, d))
                            continue;
                        f = a[d], b !==
                            "" ? e = b +
                            "[" + d +
                            "]" :
                            e = d, this
                            .flattenParams(
                                f, e, c
                            )
                    } else if (a.constructor ===
                        Array)
                        for (g = 0, h =
                            a.length; g <
                            h; g++) f =
                            a[g],
                            this.flattenParams(
                                f, b +
                                "[]", c
                            );
                    else b !== "" && c.push(
                        [b, a]);
                return c
            }, this.parse = function(a,
                b) {
                var e, f, g, h, i;
                a == null && (a = ""),
                    b == null && (b = {}),
                    g =
                    function(a) {
                        return a === "" ?
                            null : a
                    }, h = a.match(d),
                    this.scheme = g(h[1]),
                    e = h[2],
                    e != null && (f = e
                        .match(c), i =
                        g(f[1]), i !=
                        null && (this.user =
                            i.split(":")[
                                0],
                            this.password =
                            i.split(":")[
                                1]),
                        this.host = g(f[
                            2]),
                        this.port =
                        parseInt(f[3],
                            10) || null
                    ), this
                    .path = h[3], this.query =
                    g(h[4]), b.decodeQuery &&
                    (this.query = this.decodeParams(
                        this.query)),
                    this.fragment = g(h[
                        5]);
                if (b.decodeFragment)
                    return this.fragment =
                        this.decodeParams(
                            this.fragment
                        )
            }, this.parse(a.toString(),
                b), this
    },
    function() {
        var AbstractDialog,
            ConnectDialog, EchoDialog,
            PickerDialog,
            __hasProp = {}.hasOwnProperty,
            __extends = function(a, b) {
                function d() {
                    this.constructor =
                        a
                }
                for (var c in b)
                    __hasProp.call(b, c) &&
                    (a[c] = b[c]);
                return d.prototype = b.prototype,
                    a.prototype = new d,
                    a.__super__ = b.prototype,
                    a
            };
        window.SC || (window.SC = {}),
            SC.Helper = {
                merge: function(a, b) {
                    var c, d, e, f,
                        g;
                    if (a.constructor ===
                        Array) {
                        d = Array.apply(
                            null,
                            a);
                        for (f = 0,
                            g = b.length; f <
                            g; f++)
                            e =
                            b[f], d
                            .push(e);
                        return d
                    }
                    d = {};
                    for (c in a) {
                        if (!
                            __hasProp
                            .call(a,
                                c))
                            continue;
                        e = a[c], d[
                                c] =
                            e
                    }
                    for (c in b) {
                        if (!
                            __hasProp
                            .call(b,
                                c))
                            continue;
                        e = b[c], d[
                                c] =
                            e
                    }
                    return d
                },
                groupBy: function(a, b) {
                    var c, d, e, f,
                        g, h;
                    c = {};
                    for (f = 0, g =
                        a.length; f <
                        g; f++) {
                        d = a[f];
                        if (e = d[b])
                            c[h = d[
                                b
                            ]] || (
                                c[h] = []
                            ),
                            c[d[b]]
                            .push(d)
                    }
                    return c
                },
                loadJavascript: function(
                    a, b) {
                    var c;
                    return c =
                        document.createElement(
                            "script"
                        ),
                        c.async = !
                        0, c.src =
                        a, SC.Helper
                        .attachLoadEvent(
                            c, b),
                        document.body
                        .appendChild(
                            c),
                        c
                },
                extractOptionsAndCallbackArguments: function(
                    a, b) {
                    var c;
                    return c = {},
                        b != null ?
                        (c.callback =
                            b, c
                            .options =
                            a) :
                        typeof a ==
                        "function" ?
                        (c.callback =
                            a, c.options = {}
                        ) :
                        c.options =
                        a || {}, c
                },
                openCenteredPopup: function(
                    a, b, c) {
                    var d;
                    return d = {},
                        c != null ?
                        (d.width =
                            b, d.height =
                            c) : d =
                        b, d = SC.Helper
                        .merge(d, {
                            location: 1,
                            left: window
                                .screenX +
                                (
                                    window
                                    .outerWidth -
                                    d
                                    .width
                                ) /
                                2,
                            top: window
                                .screenY +
                                (
                                    window
                                    .outerHeight -
                                    d
                                    .height
                                ) /
                                2,
                            toolbar: "no",
                            scrollbars: "yes"
                        }), window.open(
                            a, d.name,
                            this._optionsToString(
                                d))
                },
                _optionsToString: function(
                    a) {
                    var b, c, d;
                    c = [];
                    for (b in a) {
                        if (!
                            __hasProp
                            .call(a,
                                b))
                            continue;
                        d = a[b], c
                            .push(b +
                                "=" +
                                d)
                    }
                    return c.join(
                        ", ")
                },
                attachLoadEvent: function(
                    a, b) {
                    return a.addEventListener ?
                        a.addEventListener(
                            "load",
                            b, !1) :
                        a.onreadystatechange =
                        function() {
                            if (
                                this
                                .readyState ===
                                "complete"
                            )
                                return b()
                        }
                },
                millisecondsToHMS: function(
                    a) {
                    var b, c, d, e,
                        f;
                    return b = {
                            h: Math
                                .floor(
                                    a /
                                    36e5
                                ),
                            m: Math
                                .floor(
                                    a /
                                    6e4 %
                                    60
                                ),
                            s: Math
                                .floor(
                                    a /
                                    1e3 %
                                    60
                                )
                        }, f = [],
                        b.h > 0 &&
                        f.push(b.h),
                        c = b.m,
                        d = "", e =
                        "", b.m <
                        10 && b.h >
                        0 && (d =
                            "0"), b
                        .s < 10 &&
                        (e = "0"),
                        f.push(d +
                            b.m), f
                        .push(e + b
                            .s), f.join(
                            ".")
                },
                setFlashStatusCodeMaps: function(
                    a) {
                    return a[
                        "_status_code_map[400]"
                    ] = 200, a[
                        "_status_code_map[401]"
                    ] = 200, a[
                        "_status_code_map[403]"
                    ] = 200, a[
                        "_status_code_map[404]"
                    ] = 200, a[
                        "_status_code_map[422]"
                    ] = 200, a[
                        "_status_code_map[500]"
                    ] = 200, a[
                        "_status_code_map[503]"
                    ] = 200, a[
                        "_status_code_map[504]"
                    ] = 200
                },
                responseHandler: function(
                    a, b) {
                    var c, d;
                    return d = SC.Helper
                        .JSON.parse(
                            a), c =
                        null,
                        d ? d.errors &&
                        (c = {
                            message: d
                                .errors &&
                                d
                                .errors[
                                    0
                                ]
                                .error_message
                        }) : b ? c = {
                            message: "HTTP Error: " +
                                b.status
                        } : c = {
                            message: "Unknown error"
                        }, {
                            json: d,
                            error: c
                        }
                },
                FakeStorage: function() {
                    return {
                        _store: {},
                        getItem: function(
                            a) {
                            return this
                                ._store[
                                    a
                                ] ||
                                null
                        },
                        setItem: function(
                            a,
                            b) {
                            return this
                                ._store[
                                    a
                                ] =
                                b
                                .toString()
                        },
                        removeItem: function(
                            a) {
                            return delete this
                                ._store[
                                    a
                                ]
                        }
                    }
                },
                JSON: {
                    parse: function(
                        string) {
                        return string[
                                0] !==
                            "{" &&
                            string[
                                0] !==
                            "[" ?
                            null :
                            window.JSON !=
                            null ?
                            window.JSON
                            .parse(
                                string
                            ) :
                            eval(
                                string
                            )
                    }
                }
            }, window.SC = SC.Helper.merge(
                SC || {}, {
                    _version: "1.1.5",
                    _baseUrl: "//connect.soundcloud.com",
                    options: {
                        site: "soundcloud.com",
                        baseUrl: "//connect.soundcloud.com"
                    },
                    connectCallbacks: {},
                    _popupWindow: void 0,
                    initialize: function(
                        a) {
                        var b, c, d;
                        a == null &&
                            (a = {}),
                            this.accessToken(
                                a
                                .access_token
                            );
                        for (b in a) {
                            if (!
                                __hasProp
                                .call(
                                    a,
                                    b
                                ))
                                continue;
                            c = a[b],
                                this
                                .options[
                                    b
                                ] =
                                c
                        }
                        return (d =
                                this
                                .options
                            ).flashXHR ||
                            (d.flashXHR =
                                (
                                    new XMLHttpRequest
                                ).withCredentials ===
                                void 0
                            ), this
                    },
                    hostname: function(
                        a) {
                        var b;
                        return b =
                            "", a !=
                            null &&
                            (b += a +
                                "."
                            ),
                            b +=
                            this.options
                            .site,
                            b
                    }
                }), window.SC = SC.Helper
            .merge(SC || {}, {
                _apiRequest: function(
                    a, b, c, d) {
                    var e, f;
                    d == null &&
                        (d = c,
                            c =
                            void 0
                        ), c ||
                        (c = {}),
                        f = SC.prepareRequestURI(
                            b,
                            c),
                        f.query
                        .format =
                        "json",
                        SC.options
                        .flashXHR ?
                        SC.Helper
                        .setFlashStatusCodeMaps(
                            f.query
                        ) :
                        f.query[
                            "_status_code_map[302]"
                        ] =
                        200;
                    if (a ===
                        "PUT" ||
                        a ===
                        "DELETE"
                    ) f.query
                        ._method =
                        a, a =
                        "POST";
                    return a !==
                        "GET" &&
                        (e = f.encodeParams(
                                f
                                .query
                            ),
                            f.query = {}
                        ), this
                        ._request(
                            a,
                            f,
                            "application/x-www-form-urlencoded",
                            e,
                            function(
                                a,
                                b
                            ) {
                                var
                                    c;
                                return c =
                                    SC
                                    .Helper
                                    .responseHandler(
                                        a,
                                        b
                                    ),
                                    c
                                    .json &&
                                    c
                                    .json
                                    .status ===
                                    "302 - Found" ?
                                    SC
                                    ._apiRequest(
                                        "GET",
                                        c
                                        .json
                                        .location,
                                        d
                                    ) :
                                    d(
                                        c
                                        .json,
                                        c
                                        .error
                                    )
                            })
                },
                _request: function(
                    a, b, c, d,
                    e) {
                    return SC.options
                        .flashXHR ?
                        this._flashRequest(
                            a,
                            b,
                            c,
                            d,
                            e) :
                        this._xhrRequest(
                            a,
                            b,
                            c,
                            d,
                            e)
                },
                _xhrRequest: function(
                    a, b, c, d,
                    e) {
                    var f;
                    return f =
                        new XMLHttpRequest,
                        f.open(
                            a,
                            b.toString(), !
                            0),
                        f.setRequestHeader(
                            "Content-Type",
                            c),
                        f.onreadystatechange =
                        function(
                            a) {
                            if (
                                a
                                .target
                                .readyState ===
                                4
                            )
                                return e(
                                    a
                                    .target
                                    .responseText,
                                    a
                                    .target
                                )
                        }, f.send(
                            d)
                },
                _flashRequest: function(
                    a, b, c, d,
                    e) {
                    return this
                        .whenRecordingReady(
                            function() {
                                return Recorder
                                    .request(
                                        a,
                                        b
                                        .toString(),
                                        c,
                                        d,
                                        function(
                                            a,
                                            b
                                        ) {
                                            return e(
                                                Recorder
                                                ._externalInterfaceDecode(
                                                    a
                                                ),
                                                b
                                            )
                                        }
                                    )
                            })
                },
                post: function(a, b,
                    c) {
                    return this
                        ._apiRequest(
                            "POST",
                            a,
                            b,
                            c)
                },
                put: function(a, b,
                    c) {
                    return this
                        ._apiRequest(
                            "PUT",
                            a,
                            b,
                            c)
                },
                get: function(a, b,
                    c) {
                    return this
                        ._apiRequest(
                            "GET",
                            a,
                            b,
                            c)
                },
                "delete": function(
                    a, b) {
                    return this
                        ._apiRequest(
                            "DELETE",
                            a, {},
                            b)
                },
                prepareRequestURI: function(
                    a, b) {
                    var c, d, e;
                    b == null &&
                        (b = {}),
                        d = new SC
                        .URI(a, {
                            decodeQuery:
                                !
                                0
                        });
                    for (c in b) {
                        if (!
                            __hasProp
                            .call(
                                b,
                                c
                            ))
                            continue;
                        e = b[c],
                            d.query[
                                c
                            ] =
                            e
                    }
                    return d.isRelative() &&
                        (d.host =
                            this
                            .hostname(
                                "api"
                            ),
                            d.scheme =
                            "http"
                        ), this
                        .accessToken() !=
                        null ?
                        (d.query
                            .oauth_token =
                            this
                            .accessToken(),
                            d.scheme =
                            "https"
                        ) : d.query
                        .client_id =
                        this.options
                        .client_id,
                        d
                },
                _getAll: function(a,
                    b, c, d) {
                    return d ==
                        null &&
                        (d = []),
                        c ==
                        null &&
                        (c = b,
                            b =
                            void 0
                        ), b ||
                        (b = {}),
                        b
                        .offset ||
                        (b.offset =
                            0),
                        b.limit ||
                        (b.limit =
                            50),
                        this.get(
                            a,
                            b,
                            function(
                                e,
                                f
                            ) {
                                return e
                                    .constructor ===
                                    Array &&
                                    e
                                    .length >
                                    0 ?
                                    (
                                        d =
                                        SC
                                        .Helper
                                        .merge(
                                            d,
                                            e
                                        ),
                                        b
                                        .offset +=
                                        b
                                        .limit,
                                        SC
                                        ._getAll(
                                            a,
                                            b,
                                            c,
                                            d
                                        )
                                    ) :
                                    c(
                                        d,
                                        null
                                    )
                            })
                }
            }), window.SC = SC.Helper.merge(
                SC || {}, {
                    _connectWindow: null,
                    connect: function(a) {
                        var b, c, d;
                        typeof a ==
                            "function" ?
                            d = {
                                connected: a
                            } : d =
                            a, c = {
                                client_id: d
                                    .client_id ||
                                    SC
                                    .options
                                    .client_id,
                                redirect_uri: d
                                    .redirect_uri ||
                                    SC
                                    .options
                                    .redirect_uri,
                                response_type: "code_and_token",
                                scope: d
                                    .scope ||
                                    "non-expiring",
                                display: "popup",
                                window: d
                                    .window,
                                retainWindow: d
                                    .retainWindow
                            };
                        if (c.client_id &&
                            c.redirect_uri
                        ) return b =
                            SC.dialog(
                                SC
                                .Dialog
                                .CONNECT,
                                c,
                                function(
                                    a
                                ) {
                                    if (
                                        a
                                        .error !=
                                        null
                                    )
                                        throw new Error(
                                            "SC OAuth2 Error: " +
                                            a
                                            .error_description
                                        );
                                    SC
                                        .accessToken(
                                            a
                                            .access_token
                                        ),
                                        d
                                        .connected !=
                                        null &&
                                        d
                                        .connected();
                                    if (
                                        d
                                        .callback !=
                                        null
                                    )
                                        return d
                                            .callback()
                                }
                            ),
                            this
                            ._connectWindow =
                            b.options
                            .window,
                            b;
                        throw "Options client_id and redirect_uri must be passed"
                    },
                    connectCallback: function() {
                        return SC.Dialog
                            ._handleDialogReturn(
                                SC._connectWindow
                            )
                    },
                    disconnect: function() {
                        return this
                            .accessToken(
                                null
                            )
                    },
                    _trigger: function(
                        a, b) {
                        if (this.connectCallbacks[
                                a] !=
                            null)
                            return this
                                .connectCallbacks[
                                    a
                                ](b)
                    },
                    accessToken: function(
                        a) {
                        var b, c;
                        return c =
                            "SC.accessToken",
                            b =
                            this.storage(),
                            a ===
                            void 0 ?
                            b.getItem(
                                c) :
                            a ===
                            null ?
                            b.removeItem(
                                c) :
                            b.setItem(
                                c,
                                a)
                    },
                    isConnected: function() {
                        return this
                            .accessToken() !=
                            null
                    }
                }), window.SC = SC.Helper
            .merge(SC || {}, {
                _dialogsPath: "/dialogs",
                dialog: function(a,
                    b, c) {
                    var d, e, f;
                    return d =
                        SC.Helper
                        .extractOptionsAndCallbackArguments(
                            b,
                            c),
                        f = d.options,
                        c = d.callback,
                        f.callback =
                        c, f.redirect_uri =
                        this
                        .options
                        .redirect_uri,
                        e = new SC
                        .Dialog[
                            a +
                            "Dialog"
                        ](f),
                        SC.Dialog
                        ._dialogs[
                            e.id
                        ] = e,
                        e.open(),
                        e
                },
                Dialog: {
                    ECHO: "Echo",
                    CONNECT: "Connect",
                    PICKER: "Picker",
                    ID_PREFIX: "SoundCloud_Dialog",
                    _dialogs: {},
                    _isDialogId: function(
                        a) {
                        return (
                            a ||
                            ""
                        ).match(
                            new RegExp(
                                "^" +
                                this
                                .ID_PREFIX
                            )
                        )
                    },
                    _getDialogIdFromWindow: function(
                        a) {
                        var b,
                            c;
                        return c =
                            new SC
                            .URI(
                                a
                                .location, {
                                    decodeQuery:
                                        !
                                        0,
                                    decodeFragment:
                                        !
                                        0
                                }
                            ),
                            b =
                            c.query
                            .state ||
                            c.fragment
                            .state,
                            this
                            ._isDialogId(
                                b
                            ) ?
                            b :
                            null
                    },
                    _handleDialogReturn: function(
                        a) {
                        var b,
                            c;
                        c =
                            this
                            ._getDialogIdFromWindow(
                                a
                            ),
                            b =
                            this
                            ._dialogs[
                                c
                            ];
                        if (b !=
                            null &&
                            b.handleReturn()
                        )
                            return delete this
                                ._dialogs[
                                    c
                                ]
                    },
                    _handleInPopupContext: function() {
                        var a;
                        if (
                            this
                            ._getDialogIdFromWindow(
                                window
                            ) &&
                            !
                            window
                            .location
                            .pathname
                            .match(
                                /\/dialogs\//
                            )) {
                            a =
                                navigator
                                .userAgent
                                .match(
                                    /OS 5(_\d)+ like Mac OS X/i
                                );
                            if (
                                a
                            )
                                return window
                                    .opener
                                    .SC
                                    .Dialog
                                    ._handleDialogReturn(
                                        window
                                    );
                            if (
                                window
                                .opener
                            )
                                return window
                                    .opener
                                    .setTimeout(
                                        function() {
                                            return window
                                                .opener
                                                .SC
                                                .Dialog
                                                ._handleDialogReturn(
                                                    window
                                                )
                                        },
                                        1
                                    );
                            if (
                                window
                                .top
                            )
                                return window
                                    .top
                                    .setTimeout(
                                        function() {
                                            return window
                                                .top
                                                .SC
                                                .Dialog
                                                ._handleDialogReturn(
                                                    window
                                                )
                                        },
                                        1
                                    )
                        }
                    },
                    AbstractDialog: AbstractDialog =
                        function() {
                            function a(
                                a) {
                                this
                                    .options =
                                    a !=
                                    null ?
                                    a : {},
                                    this
                                    .id =
                                    this
                                    .generateId()
                            }
                            return a
                                .prototype
                                .WIDTH =
                                456,
                                a.prototype
                                .HEIGHT =
                                510,
                                a.prototype
                                .ID_PREFIX =
                                "SoundCloud_Dialog",
                                a.prototype
                                .PARAM_KEYS = [
                                    "redirect_uri"
                                ],
                                a.prototype
                                .requiresAuthentication = !
                                1,
                                a.prototype
                                .generateId =
                                function() {
                                    return [
                                            this
                                            .ID_PREFIX,
                                            Math
                                            .ceil(
                                                Math
                                                .random() *
                                                1e6
                                            )
                                            .toString(
                                                16
                                            )
                                        ]
                                        .join(
                                            "_"
                                        )
                                },
                                a.prototype
                                .buildURI =
                                function(
                                    a
                                ) {
                                    var
                                        b,
                                        c,
                                        d,
                                        e;
                                    a
                                        ==
                                        null &&
                                        (
                                            a =
                                            new SC
                                            .URI(
                                                SC
                                                ._baseUrl
                                            )
                                        ),
                                        a
                                        .scheme =
                                        "http",
                                        a
                                        .path +=
                                        SC
                                        ._dialogsPath +
                                        "/" +
                                        this
                                        .name +
                                        "/",
                                        a
                                        .fragment = {
                                            state: this
                                                .id
                                        },
                                        this
                                        .requiresAuthentication &&
                                        (
                                            a
                                            .fragment
                                            .access_token =
                                            SC
                                            .accessToken()
                                        ),
                                        e =
                                        this
                                        .PARAM_KEYS;
                                    for (
                                        c =
                                        0,
                                        d =
                                        e
                                        .length; c <
                                        d; c++
                                    )
                                        b =
                                        e[
                                            c
                                        ],
                                        this
                                        .options[
                                            b
                                        ] !=
                                        null &&
                                        (
                                            a
                                            .fragment[
                                                b
                                            ] =
                                            this
                                            .options[
                                                b
                                            ]
                                        );
                                    return a
                                },
                                a.prototype
                                .open =
                                function() {
                                    var
                                        a;
                                    return this
                                        .requiresAuthentication &&
                                        SC
                                        .accessToken() ==
                                        null ?
                                        this
                                        .authenticateAndOpen() :
                                        (
                                            a =
                                            this
                                            .buildURI(),
                                            this
                                            .options
                                            .window !=
                                            null ?
                                            this
                                            .options
                                            .window
                                            .location =
                                            a :
                                            this
                                            .options
                                            .window =
                                            SC
                                            .Helper
                                            .openCenteredPopup(
                                                a, {
                                                    width: this
                                                        .WIDTH,
                                                    height: this
                                                        .HEIGHT
                                                }
                                            )
                                        )
                                },
                                a.prototype
                                .authenticateAndOpen =
                                function() {
                                    var
                                        a,
                                        b =
                                        this;
                                    return a =
                                        SC
                                        .connect({
                                            retainWindow:
                                                !
                                                0,
                                            window: this
                                                .options
                                                .window,
                                            connected: function() {
                                                return b
                                                    .options
                                                    .window =
                                                    a
                                                    .options
                                                    .window,
                                                    b
                                                    .open()
                                            }
                                        })
                                },
                                a.prototype
                                .paramsFromWindow =
                                function() {
                                    var
                                        a,
                                        b;
                                    return b =
                                        new SC
                                        .URI(
                                            this
                                            .options
                                            .window
                                            .location, {
                                                decodeFragment:
                                                    !
                                                    0,
                                                decodeQuery:
                                                    !
                                                    0
                                            }
                                        ),
                                        a =
                                        SC
                                        .Helper
                                        .merge(
                                            b
                                            .query,
                                            b
                                            .fragment
                                        )
                                },
                                a.prototype
                                .handleReturn =
                                function() {
                                    var
                                        a;
                                    return a =
                                        this
                                        .paramsFromWindow(),
                                        this
                                        .options
                                        .retainWindow ||
                                        this
                                        .options
                                        .window
                                        .close(),
                                        this
                                        .options
                                        .callback(
                                            a
                                        )
                                },
                                a
                        }(),
                    EchoDialog: EchoDialog =
                        function(a) {
                            function b() {
                                return b
                                    .__super__
                                    .constructor
                                    .apply(
                                        this,
                                        arguments
                                    )
                            }
                            return __extends(
                                    b,
                                    a
                                ),
                                b.prototype
                                .PARAM_KEYS = [
                                    "client_id",
                                    "redirect_uri",
                                    "hello"
                                ],
                                b.prototype
                                .name =
                                "echo",
                                b
                        }(
                            AbstractDialog
                        ),
                    PickerDialog: PickerDialog =
                        function(a) {
                            function b() {
                                return b
                                    .__super__
                                    .constructor
                                    .apply(
                                        this,
                                        arguments
                                    )
                            }
                            return __extends(
                                    b,
                                    a
                                ),
                                b.prototype
                                .PARAM_KEYS = [
                                    "client_id",
                                    "redirect_uri"
                                ],
                                b.prototype
                                .name =
                                "picker",
                                b
                                .prototype
                                .requiresAuthentication = !
                                0,
                                b.prototype
                                .handleReturn =
                                function() {
                                    var
                                        a,
                                        b =
                                        this;
                                    a
                                        =
                                        this
                                        .paramsFromWindow();
                                    if (
                                        a
                                        .action ===
                                        "logout"
                                    )
                                        return SC
                                            .accessToken(
                                                null
                                            ),
                                            this
                                            .open(), !
                                            1;
                                    if (
                                        a
                                        .track_uri !=
                                        null
                                    )
                                        return this
                                            .options
                                            .retainWindow ||
                                            this
                                            .options
                                            .window
                                            .close(),
                                            SC
                                            .get(
                                                a
                                                .track_uri,
                                                function(
                                                    a
                                                ) {
                                                    return b
                                                        .options
                                                        .callback({
                                                            track: a
                                                        })
                                                }
                                            ), !
                                            0
                                },
                                b
                        }(
                            AbstractDialog
                        ),
                    ConnectDialog: ConnectDialog =
                        function(a) {
                            function b() {
                                return b
                                    .__super__
                                    .constructor
                                    .apply(
                                        this,
                                        arguments
                                    )
                            }
                            return __extends(
                                    b,
                                    a
                                ),
                                b.prototype
                                .PARAM_KEYS = [
                                    "client_id",
                                    "redirect_uri",
                                    "client_secret",
                                    "response_type",
                                    "scope",
                                    "display"
                                ],
                                b.prototype
                                .name =
                                "connect",
                                b.prototype
                                .buildURI =
                                function() {
                                    var
                                        a;
                                    return a =
                                        b
                                        .__super__
                                        .buildURI
                                        .apply(
                                            this,
                                            arguments
                                        ),
                                        a
                                        .scheme =
                                        "https",
                                        a
                                        .host =
                                        "soundcloud.com",
                                        a
                                        .path =
                                        "/connect",
                                        a
                                        .query =
                                        a
                                        .fragment,
                                        a
                                        .fragment = {},
                                        a
                                },
                                b
                        }(
                            AbstractDialog
                        )
                }
            }), SC.Dialog._handleInPopupContext(),
            window.SC = SC.Helper
            .merge(SC || {}, {
                Loader: {
                    States: {
                        UNLOADED: 1,
                        LOADING: 2,
                        READY: 3
                    },
                    Package: function(
                        a, b) {
                        return {
                            name: a,
                            callbacks: [],
                            loadFunction: b,
                            state: SC
                                .Loader
                                .States
                                .UNLOADED,
                            addCallback: function(
                                a
                            ) {
                                return this
                                    .callbacks
                                    .push(
                                        a
                                    )
                            },
                            runCallbacks: function() {
                                var
                                    a,
                                    b,
                                    c,
                                    d;
                                d
                                    =
                                    this
                                    .callbacks;
                                for (
                                    b =
                                    0,
                                    c =
                                    d
                                    .length; b <
                                    c; b++
                                )
                                    a =
                                    d[
                                        b
                                    ],
                                    a
                                    .apply(
                                        this
                                    );
                                return this
                                    .callbacks = []
                            },
                            setReady: function() {
                                return this
                                    .state =
                                    SC
                                    .Loader
                                    .States
                                    .READY,
                                    this
                                    .runCallbacks()
                            },
                            load: function() {
                                return this
                                    .state =
                                    SC
                                    .Loader
                                    .States
                                    .LOADING,
                                    this
                                    .loadFunction
                                    .apply(
                                        this
                                    )
                            },
                            whenReady: function(
                                a
                            ) {
                                switch (
                                    this
                                    .state
                                ) {
                                    case SC
                                    .Loader
                                    .States
                                    .UNLOADED:
                                        return this
                                            .addCallback(
                                                a
                                            ),
                                            this
                                            .load();
                                    case SC
                                    .Loader
                                    .States
                                    .LOADING:
                                        return this
                                            .addCallback(
                                                a
                                            );
                                    case SC
                                    .Loader
                                    .States
                                    .READY:
                                        return a()
                                }
                            }
                        }
                    },
                    packages: {},
                    registerPackage: function(
                        a) {
                        return this
                            .packages[
                                a
                                .name
                            ] =
                            a
                    }
                }
            }), window.SC = SC.Helper.merge(
                SC || {}, {
                    oEmbed: function(a,
                        b, c) {
                        var d, e, f =
                            this;
                        return c ==
                            null &&
                            (c = b,
                                b =
                                void 0
                            ),
                            b || (b = {}),
                            b.url =
                            a, e =
                            new SC.URI(
                                "http://" +
                                SC.hostname() +
                                "/oembed.json"
                            ), e.query =
                            b, c.nodeType !==
                            void 0 &&
                            c.nodeType ===
                            1 && (d =
                                c,
                                c =
                                function(
                                    a
                                ) {
                                    return d
                                        .innerHTML =
                                        a
                                        .html
                                }),
                            this._request(
                                "GET",
                                e.toString(),
                                null,
                                null,
                                function(
                                    a,
                                    b
                                ) {
                                    var
                                        d;
                                    return d =
                                        SC
                                        .Helper
                                        .responseHandler(
                                            a,
                                            b
                                        ),
                                        c(
                                            d
                                            .json,
                                            d
                                            .error
                                        )
                                })
                    }
                }), window.SC = SC.Helper
            .merge(SC || {}, {
                _recorderSwfPath: "/recorder.js/recorder-0.9.0.swf",
                whenRecordingReady: function(
                    a) {
                    return SC.Loader
                        .packages
                        .recording
                        .whenReady(
                            a)
                },
                record: function(a) {
                    return a ==
                        null &&
                        (a = {}),
                        this.whenRecordingReady(
                            function() {
                                return Recorder
                                    .record(
                                        a
                                    )
                            })
                },
                recordStop: function(
                    a) {
                    return a ==
                        null &&
                        (a = {}),
                        Recorder
                        .stop()
                },
                recordPlay: function(
                    a) {
                    return a ==
                        null &&
                        (a = {}),
                        Recorder
                        .play(
                            a)
                },
                recordUpload: function(
                    a, b) {
                    var c, d;
                    return a ==
                        null &&
                        (a = {}),
                        d = SC.prepareRequestURI(
                            "/tracks",
                            a),
                        d.query
                        .format =
                        "json",
                        SC.Helper
                        .setFlashStatusCodeMaps(
                            d.query
                        ), c =
                        d.flattenParams(
                            d.query
                        ),
                        Recorder
                        .upload({
                            method: "POST",
                            url: "https://" +
                                this
                                .hostname(
                                    "api"
                                ) +
                                "/tracks",
                            audioParam: "track[asset_data]",
                            params: c,
                            success: function(
                                a
                            ) {
                                var
                                    c;
                                return c =
                                    SC
                                    .Helper
                                    .responseHandler(
                                        a
                                    ),
                                    b(
                                        c
                                        .json,
                                        c
                                        .error
                                    )
                            }
                        })
                }
            }), SC.Loader.registerPackage(
                new SC.Loader.Package(
                    "recording",
                    function() {
                        return Recorder
                            .flashInterface() ?
                            SC.Loader.packages
                            .recording.setReady() :
                            Recorder.initialize({
                                swfSrc: SC
                                    ._baseUrl +
                                    SC
                                    ._recorderSwfPath +
                                    "?" +
                                    SC
                                    ._version,
                                initialized: function() {
                                    return SC
                                        .Loader
                                        .packages
                                        .recording
                                        .setReady()
                                }
                            })
                    })), window.SC = SC
            .Helper.merge(SC || {}, {
                storage: function() {
                    return this
                        ._fakeStorage ||
                        (this._fakeStorage =
                            new SC
                            .Helper
                            .FakeStorage
                        )
                }
            }), window.SC = SC.Helper.merge(
                SC || {}, {
                    _soundmanagerPath: "/soundmanager2",
                    _soundmanagerScriptPath: "/soundmanager2.js",
                    whenStreamingReady: function(
                        a) {
                        return SC.Loader
                            .packages
                            .streaming
                            .whenReady(
                                a)
                    },
                    _prepareStreamUrl: function(
                        a) {
                        var b, c;
                        return a.toString()
                            .match(
                                /^\d.*$/
                            ) ? c =
                            "/tracks/" +
                            a : c =
                            a, b =
                            SC.prepareRequestURI(
                                c),
                            b.path.match(
                                /\/stream/
                            ) || (
                                b.path +=
                                "/stream"
                            ), b.toString()
                    },
                    _setOnPositionListenersForComments: function(
                        a, b,
                        c) {
                        var d, e, f,
                            g;
                        e = SC.Helper
                            .groupBy(
                                b,
                                "timestamp"
                            ), g = [];
                        for (f in e)
                            d = e[f],
                            g.push(
                                function(
                                    b,
                                    c,
                                    d
                                ) {
                                    return a
                                        .onposition(
                                            parseInt(
                                                b,
                                                10
                                            ),
                                            function() {
                                                return d(
                                                    c
                                                )
                                            }
                                        )
                                }(f,
                                    d,
                                    c
                                ));
                        return g
                    },
                    stream: function(a,
                        b, c) {
                        var d, e, f =
                            this;
                        return d =
                            SC.Helper
                            .extractOptionsAndCallbackArguments(
                                b,
                                c),
                            e = d.options,
                            c = d.callback,
                            SC.whenStreamingReady(
                                function() {
                                    var
                                        b,
                                        d;
                                    return e
                                        .id =
                                        "T" +
                                        a +
                                        "-" +
                                        Math
                                        .random(),
                                        e
                                        .url =
                                        f
                                        ._prepareStreamUrl(
                                            a
                                        ),
                                        b =
                                        function(
                                            a
                                        ) {
                                            var
                                                b;
                                            return b =
                                                soundManager
                                                .createSound(
                                                    a
                                                ),
                                                c !=
                                                null &&
                                                c(
                                                    b
                                                ),
                                                b
                                        },
                                        (
                                            d =
                                            e
                                            .ontimedcomments
                                        ) ?
                                        (
                                            delete e
                                            .ontimedcomments,
                                            SC
                                            ._getAll(
                                                e
                                                .url
                                                .replace(
                                                    "/stream",
                                                    "/comments"
                                                ),
                                                function(
                                                    a
                                                ) {
                                                    var
                                                        c;
                                                    return c =
                                                        b(
                                                            e
                                                        ),
                                                        f
                                                        ._setOnPositionListenersForComments(
                                                            c,
                                                            a,
                                                            d
                                                        )
                                                }
                                            )
                                        ) :
                                        b(
                                            e
                                        )
                                })
                    },
                    streamStopAll: function() {
                        if (window.soundManager !=
                            null)
                            return window
                                .soundManager
                                .stopAll()
                    }
                }), SC.Loader.registerPackage(
                new SC.Loader.Package(
                    "streaming",
                    function() {
                        var a;
                        return window.soundManager !=
                            null ? SC.Loader
                            .packages.streaming
                            .setReady() :
                            (a = SC._baseUrl +
                                SC._soundmanagerPath,
                                window.SM2_DEFER = !
                                0, SC.Helper
                                .loadJavascript(
                                    a +
                                    SC._soundmanagerScriptPath,
                                    function() {
                                        return window
                                            .soundManager =
                                            new SoundManager,
                                            soundManager
                                            .url =
                                            a,
                                            soundManager
                                            .flashVersion = 9,
                                            soundManager
                                            .useFlashBlock = !
                                            1,
                                            soundManager
                                            .useHTML5Audio = !
                                            1,
                                            soundManager
                                            .beginDelayedInit(),
                                            soundManager
                                            .onready(
                                                function() {
                                                    return SC
                                                        .Loader
                                                        .packages
                                                        .streaming
                                                        .setReady()
                                                }
                                            )
                                    }))
                    }))
    }.call(this);
