
//版本:1.0.1
//作者:niewei

"use strict";

; (function (w, d, u) {
    function nwScroll(sourceDoms, outerParams) {
        var api_objs = [];
        function initScroll(sourceDom) {
            /*
            **参数核心
            */

            //外部控制参数
            var params = {
                yShow: true,
                xShow: false,
                autoHide: false,
                wheelRatio: 8,
                btnsRatio: 4,
                cnHeight: "100%",
                cnWidth: "100%"
            };

            //合并外部控制参数
            for (var key in outerParams) {
                params[key] = outerParams[key];
            }

            //内部控制参数
            var currentDoms = u, animate_ctl = false, drag_ctl = false, btns_timer = u,
                hide_timer = u, bar_site = 0, m_site = 0, old_site = 0, axis_dir = "";

            /*
            **API核心
            */

            api_objs.push({
                refresh: function () {
                    autoShow(currentDoms), dynamicSize(currentDoms);
                },
                selfDoms: function () {
                    return currentDoms;
                },
                toMax: function (axis) {
                    rollToEdge(axis, 1);
                },
                toMin: function (axis) {
                    rollToEdge(axis, -1);
                }
            });

            /*
            **View核心
            */

            //View主体框架
            function initView(dom) {
                //用于全局实例唯一标识
                w.sign = (w.sign || 0) + 1;

                //定义所有div
                var doms = { sc_cn: null, sc_m: null },
                    yDoms = { sc_r: null, sc_r_t: null, sc_r_c: null, sc_r_b: null, sc_r_c_bar: null },
                    xDoms = { sc_b: null, sc_b_l: null, sc_b_c: null, sc_b_r: null, sc_b_c_bar: null };

                //按需导入div
                if (params.yShow) {
                    for (var key in yDoms) {
                        doms[key] = yDoms[key];
                    }
                }
                if (params.xShow) {
                    for (var key in xDoms) {
                        doms[key] = xDoms[key];
                    }
                }

                //生成所有div,并为所有div增加class和标识
                for (var key in doms) {
                    doms[key] = d.createElement("div");
                    doms[key].className = key;
                }

                //设置容器特定的class和属性
                doms.sc_cn.className = "sc_cn " + "nwScroll_" + w.sign, w.addEventListener ? doms.sc_cn.setAttribute("tabIndex", w.sign) : doms.sc_cn.tabIndex = w.sign;

                //设置容器宽高
                doms.sc_cn.style.height = params.cnHeight, doms.sc_cn.style.width = params.cnWidth;

                //组建容器
                doms.sc_cn.appendChild(doms.sc_m);
                params.yShow && (doms.sc_cn.appendChild(doms.sc_r), doms.sc_r.appendChild(doms.sc_r_t), doms.sc_r.appendChild(doms.sc_r_c), doms.sc_r.appendChild(doms.sc_r_b),
                    doms.sc_r_c.appendChild(doms.sc_r_c_bar));
                params.xShow && (doms.sc_cn.appendChild(doms.sc_b), doms.sc_b.appendChild(doms.sc_b_l), doms.sc_b.appendChild(doms.sc_b_c), doms.sc_b.appendChild(doms.sc_b_r),
                    doms.sc_b_c.appendChild(doms.sc_b_c_bar));
                dom.parentNode.insertBefore(doms.sc_cn, dom);
                doms.sc_m.appendChild(dom);

                //设置计算性参数
                dynamicSize(doms);

                //按需定制界面
                params.yShow && (doms.sc_r_t.innerHTML = "▴", doms.sc_r_b.innerHTML = "▾");
                params.xShow && (doms.sc_b_l.innerHTML = "◂", doms.sc_b_r.innerHTML = "▸");

                //显示控制
                params.autoHide && (doms.sc_r && (doms.sc_r.style.visibility = "hidden"), doms.sc_b && (doms.sc_b.style.visibility = "hidden"));
                autoShow(doms);

                //实例赋值
                currentDoms = doms;
            }

            //计算性参数
            function dynamicSize(doms) {
                params.yShow && (
                    doms.sc_r_c.style.height = doms.sc_r.clientHeight - 2 * doms.sc_r_t.clientHeight + "px",
                    doms.sc_r_c_bar.style.height = doms.sc_cn.clientHeight / doms.sc_m.clientHeight * doms.sc_r_c.clientHeight + "px",
                    doms.sc_r.clientWidth && parseFloat(doms.sc_r_c_bar.style.top) && (resetSite({ clientName: "clientHeight", aim: "top", cName: "sc_r_c", barName: "sc_r_c_bar" }, doms))
                );
                params.xShow && (
                    doms.sc_b.style.left = doms.sc_r && !!doms.sc_r.clientWidth ? doms.sc_r.clientWidth + "px" : "3%",
                    doms.sc_b.style.width = doms.sc_r && !!doms.sc_r.clientWidth ? doms.sc_cn.clientWidth - 2 * doms.sc_r.clientWidth + "px" : "94%",
                    doms.sc_b_c.style.width = doms.sc_b.clientWidth - 2 * doms.sc_b_l.clientWidth + "px",
                    doms.sc_b_c_bar.style.width = doms.sc_cn.clientWidth / doms.sc_m.clientWidth * doms.sc_b_c.clientWidth + "px",
                    doms.sc_b.clientWidth && parseFloat(doms.sc_b_c_bar.style.left) && (resetSite({ clientName: "clientWidth", aim: "left", cName: "sc_b_c", barName: "sc_b_c_bar" }, doms))
                );
            }

            //位置重置
            function resetSite(obj, doms) {
                var _maxSite = -(doms.sc_m[obj.clientName] - doms.sc_cn[obj.clientName]),
                    toSite = 0, _toSite = parseFloat(doms.sc_m.style[obj.aim]);

                _toSite < _maxSite && (_toSite = _maxSite);
                toSite = -_toSite / doms.sc_m[obj.clientName] * doms[obj.cName][obj.clientName];
                doms.sc_m.style[obj.aim] = _toSite + "px";
                doms[obj.barName].style[obj.aim] = toSite + "px";
            }

            //自动隐藏滚动条
            function autoShow(doms) {
                params.yShow && (doms.sc_cn.clientHeight / doms.sc_m.clientHeight >= 1 && (doms.sc_r.style.display = "none", doms.sc_m.style.top = "0px") || (doms.sc_r.style.display = ""));
                params.xShow && (doms.sc_cn.clientWidth / doms.sc_m.clientWidth >= 1 && (doms.sc_b.style.display = "none", doms.sc_m.style.left = "0px") || (doms.sc_b.style.display = ""));
            }

            /*
            **滚动核心
            */

            //滚动前准备
            function beforeRoll(barName, aim) {
                bar_site = parseFloat(currentDoms[barName].style[aim]) || 0;
                m_site = parseFloat(currentDoms.sc_m.style[aim]) || 0;
            }

            //基本滚动,需准备
            function roll(axis, gap, doms) {
                var maxSite = 0, _maxSite = 0, toSite = 0, _toSite = 0,
                    cName = "sc_r_c", barName = "sc_r_c_bar", aim = "top", clientName = "clientHeight";
                axis == "x" && (cName = "sc_b_c", barName = "sc_b_c_bar", aim = "left", clientName = "clientWidth");

                maxSite = doms[cName][clientName] - doms[barName][clientName];
                _maxSite = -(doms.sc_m[clientName] - doms.sc_cn[clientName]);

                toSite = bar_site + gap;
                _toSite = m_site + gap / maxSite * _maxSite;

                toSite < 0 && (toSite = _toSite = 0);
                toSite > maxSite && (toSite = maxSite, _toSite = _maxSite);

                doms[barName].style[aim] = toSite + "px";
                doms.sc_m.style[aim] = _toSite + "px";
            }

            //长距离动画滚动,需准备
            function animateRoll(axis, gap, doms) {
                animate_ctl = true;
                var roll_ceil = gap / 30, _gap = 0;
                var timer = setInterval(function () {
                    _gap += roll_ceil;
                    Math.abs(_gap) >= Math.abs(gap) && (_gap = gap);
                    roll(axis, _gap, doms);
                    _gap == gap && !clearInterval(timer) && (animate_ctl = false);
                }, 10);
            }

            //滚动到边界
            function rollToEdge(axis, axis_dir) {
                var obj = axis == "y" ? { edge: currentDoms.sc_r_c.clientHeight * axis_dir, barName: "sc_r_c_bar", aim: "top" } :
                    { edge: currentDoms.sc_b_c.clientWidth * axis_dir, barName: "sc_b_c_bar", aim: "left" };
                obj.edge && (beforeRoll(obj.barName, obj.aim), animateRoll(axis, obj.edge, currentDoms));
            }

            /*
            **事件核心
            */

            //事件主体框架
            function initEvent() {
                var eventCreator = d.addEventListener ? "addEventListener" : "attachEvent", prefix = d.addEventListener ? "" : "on",
                    eventWheel = navigator.userAgent.indexOf("Firefox") != -1 ? "DOMMouseScroll" : "mousewheel", doms = currentDoms;

                //纵向事件
                if (doms.sc_r) {
                    doms.sc_r_c_bar[eventCreator](prefix + "mousedown", function (e) {
                        barsMouseDown(e, { axis: "y", aim: "top", axisVal: "clientY", barName: "sc_r_c_bar" });
                    });

                    doms.sc_r_c_bar[eventCreator](prefix + "mouseup", function (e) {
                        e = e || w.event;
                        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                        if (getEBtn(e) != 0) { return }
                        drag_ctl = false;
                    });

                    doms.sc_r_c[eventCreator](prefix + "mousedown", function (e) {
                        cMouseDown(e, { axis: "y", barName: "sc_r_c_bar", aim: "top", clientName: "clientHeight", axisVal: "clientY" });
                    });

                    doms.sc_r_t[eventCreator](prefix + "mousedown", function (e) {
                        e = e || w.event;
                        var src = e.target || e.srcElement;
                        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                        if (getEBtn(e) != 0) { return }
                        btnsMouseDown({ axis: "y", cName: "sc_r_c", barName: "sc_r_c_bar", aim: "top", clientName: "clientHeight" });
                    });

                    doms.sc_r_t[eventCreator](prefix + "mouseup", function (e) {
                        e = e || w.event;
                        if (getEBtn(e) != 0) { return }
                        clearInterval(btns_timer);
                        btns_timer = u;
                    });

                    doms.sc_r_t[eventCreator](prefix + "mouseleave", function () {
                        btnsMouseLeave();
                    });

                    doms.sc_r_b[eventCreator](prefix + "mousedown", function (e) {
                        e = e || w.event;
                        var src = e.target || e.srcElement;
                        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                        if (getEBtn(e) != 0) { return }
                        btnsMouseDown({ axis: "y", cName: "sc_r_c", barName: "sc_r_c_bar", aim: "top", clientName: "clientHeight", is_br: 1 });
                    });

                    doms.sc_r_b[eventCreator](prefix + "mouseup", function (e) {
                        e = e || w.event;
                        if (getEBtn(e) != 0) { return }
                        clearInterval(btns_timer);
                        btns_timer = u;
                    });

                    doms.sc_r_b[eventCreator](prefix + "mouseleave", function () {
                        btnsMouseLeave();
                    });

                    doms.sc_r[eventCreator](prefix + "contextmenu", function (e) {
                        e = e || w.event;
                        e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    });

                }

                //横向事件
                if (doms.sc_b) {
                    doms.sc_b_c_bar[eventCreator](prefix + "mousedown", function (e) {
                        barsMouseDown(e, { axis: "x", aim: "left", axisVal: "clientX", barName: "sc_b_c_bar" });
                    });

                    doms.sc_b_c_bar[eventCreator](prefix + "mouseup", function (e) {
                        e = e || w.event;
                        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                        if (getEBtn(e) != 0) { return }
                        drag_ctl = false;
                    });

                    doms.sc_b_c[eventCreator](prefix + "mousedown", function (e) {
                        cMouseDown(e, { axis: "x", barName: "sc_b_c_bar", aim: "left", clientName: "clientWidth", axisVal: "clientX" });
                    });

                    doms.sc_b_l[eventCreator](prefix + "mousedown", function (e) {
                        e = e || w.event;
                        var src = e.target || e.srcElement;
                        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                        if (getEBtn(e) != 0) { return }
                        btnsMouseDown({ axis: "x", cName: "sc_b_c", barName: "sc_b_c_bar", aim: "left", clientName: "clientWidth" });
                    });

                    doms.sc_b_l[eventCreator](prefix + "mouseup", function (e) {
                        e = e || w.event;
                        if (getEBtn(e) != 0) { return }
                        clearInterval(btns_timer);
                        btns_timer = u;
                    });

                    doms.sc_b_l[eventCreator](prefix + "mouseleave", function () {
                        btnsMouseLeave();
                    });

                    doms.sc_b_r[eventCreator](prefix + "mousedown", function (e) {
                        e = e || w.event;
                        var src = e.target || e.srcElement;
                        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                        if (getEBtn(e) != 0) { return }
                        btnsMouseDown({ axis: "x", cName: "sc_b_c", barName: "sc_b_c_bar", aim: "left", clientName: "clientWidth", is_br: 1 });
                    });

                    doms.sc_b_r[eventCreator](prefix + "mouseup", function (e) {
                        e = e || w.event;
                        if (getEBtn(e) != 0) { return }
                        clearInterval(btns_timer);
                        btns_timer = u;
                    });

                    doms.sc_b_r[eventCreator](prefix + "mouseleave", function () {
                        btnsMouseLeave();
                    });

                    doms.sc_b[eventCreator](prefix + "contextmenu", function (e) {
                        e = e || w.event;
                        e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    });
                }

                //全局事件
                doms.sc_cn[eventCreator](prefix + "keydown", function (e) {
                    e = e || w.event;
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    var obj = { axis: "y", cName: "sc_r_c", barName: "sc_r_c_bar", aim: "top", clientName: "clientHeight", is_br: 1 },
                        _obj = { axis: "x", cName: "sc_b_c", barName: "sc_b_c_bar", aim: "left", clientName: "clientWidth", is_br: 1 };

                    switch (e.keyCode) {
                        case 32:
                            params.yShow && btnsMouseDown(obj);
                            break;
                        case 37:
                            params.xShow && (_obj.is_br = 0, btnsMouseDown(_obj));
                            break;
                        case 38:
                            params.yShow && (obj.is_br = 0, btnsMouseDown(obj));
                            break;
                        case 39:
                            params.xShow && btnsMouseDown(_obj);
                            break;
                        case 40:
                            params.yShow && btnsMouseDown(obj);
                            break;
                    }
                });

                doms.sc_cn[eventCreator](prefix + "keyup", function (e) {
                    clearInterval(btns_timer), btns_timer = u;
                });

                doms.sc_cn[eventCreator](prefix + "mouseenter", function () {
                    doms.sc_cn.focus();

                    if (params.autoHide) {
                        if (hide_timer != u) {
                            clearInterval(hide_timer), hide_timer = u;
                            return
                        }
                        params.yShow && (doms.sc_r.style.visibility = "visible");
                        params.xShow && (doms.sc_b.style.visibility = "visible");
                    }
                });
                doms.sc_cn[eventCreator](prefix + "mouseleave", function () {
                    doms.sc_cn.blur();
                    btns_timer && (clearInterval(btns_timer), btns_timer = u);

                    params.autoHide && (hide_timer = setInterval(function () {
                        if (!drag_ctl && !animate_ctl) {
                            params.yShow && (doms.sc_r.style.visibility = "hidden");
                            params.xShow && (doms.sc_b.style.visibility = "hidden");
                            clearInterval(hide_timer);
                            hide_timer = u;
                        }
                    }, 10));
                });

                doms.sc_cn[eventCreator](prefix + eventWheel, function (e) {
                    e = e || w.event;
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;

                    if (animate_ctl || drag_ctl || btns_timer != u) { return }

                    var ratio = 0;
                    e.wheelDelta ? ratio = -e.wheelDelta / 120 : ratio = e.detail / 3;

                    if (params.yShow && doms.sc_r.style.display != "none") {
                        cnMouseWheel({
                            ratio: ratio, cnName: "sc_r", barName: "sc_r_c_bar", clientName: "clientHeight", aim: "top", axis: "y", cName: "sc_r_c"
                        });
                    }
                    else if (params.xShow && doms.sc_b.style.display != "none") {
                        cnMouseWheel({
                            ratio: ratio, cnName: "sc_b", barName: "sc_b_c_bar", clientName: "clientWidth", aim: "left", axis: "x", cName: "sc_b_c"
                        });
                    }
                });

                d[eventCreator](prefix + "mousemove", function (e) {
                    if (drag_ctl) {
                        e = e || w.event;
                        e.preventDefault ? e.preventDefault() : e.returnValue = false;

                        if (getEBtn(e) != 0) { return }

                        var new_site = axis_dir == "y" ? e.clientY : e.clientX;
                        roll(axis_dir, new_site - old_site, doms);
                    }
                });

                d[eventCreator](prefix + "mouseup", function (e) {
                    e = e || w.event;
                    getEBtn(e) == 0 && (drag_ctl = false, btns_timer && (clearInterval(btns_timer), btns_timer = u));
                });
            }

            //主体框滚轮事件实现
            function cnMouseWheel(obj) {
                if ((obj.ratio < 0 && !parseFloat(currentDoms[obj.barName].style[obj.aim])) ||
                    (obj.ratio > 0 && (currentDoms[obj.cName][obj.clientName] - currentDoms[obj.barName][obj.clientName]) == (parseFloat(currentDoms[obj.barName].style[obj.aim]) || 0))) {
                    return
                }
                var gap = obj.ratio * (currentDoms[obj.cnName][obj.clientName] - currentDoms[obj.barName][obj.clientName]) * params.wheelRatio / 50;
                beforeRoll(obj.barName, obj.aim);
                animateRoll(obj.axis, gap, currentDoms);
            }

            //上下左右按钮mousedown事件实现
            function btnsMouseDown(obj) {
                var edge = obj.is_br ? currentDoms[obj.cName][obj.clientName] - currentDoms[obj.barName][obj.clientName] : 0,
                    origin = parseFloat(currentDoms[obj.barName].style[obj.aim]) || 0;

                if (animate_ctl || origin == edge || btns_timer != u || drag_ctl) { return }
                var maxGap = (currentDoms[obj.cName][obj.clientName] - currentDoms[obj.barName][obj.clientName]) * (obj.is_br ? 1 : -1),
                    roll_ceil = maxGap * params.btnsRatio / 400, _gap = 0;

                beforeRoll(obj.barName, obj.aim);
                btns_timer = setInterval(function () {
                    _gap += roll_ceil;
                    ((_gap > 0 && _gap > maxGap) || (_gap < 0 && _gap < maxGap)) && (_gap = maxGap);
                    roll(obj.axis, _gap, currentDoms);
                    _gap == maxGap && (clearInterval(btns_timer), btns_timer = u);
                }, 10);
            }

            //上下左右按钮mouseleave事件实现
            function btnsMouseLeave() {
                btns_timer != u && (clearInterval(btns_timer), btns_timer = u);
            }

            //滑块mousedown事件实现
            function barsMouseDown(e, obj) {
                e = e || w.event;
                var src = e.target || e.srcElement;
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                e.preventDefault ? e.preventDefault() : e.returnValue = false;

                if (getEBtn(e) != 0 || animate_ctl) { return }

                drag_ctl = true;
                axis_dir = obj.axis;
                old_site = e[obj.axisVal];

                //调用roll()前的准备
                beforeRoll(obj.barName, obj.aim);
            }

            //滑块容器mousedown事件实现
            function cMouseDown(e, obj) {
                e = e || w.event;
                var src = e.target || e.srcElement;
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;

                if (getEBtn(e) != 0 || animate_ctl) { return }

                //调用animateRoll()前的准备
                beforeRoll(obj.barName, obj.aim);

                var _gap = e[obj.axisVal] - src.getBoundingClientRect()[obj.aim] - parseFloat(currentDoms[obj.barName].style[obj.aim] || 0);
                _gap > 0 && (_gap = _gap - currentDoms[obj.barName][obj.clientName]);
                animateRoll(obj.axis, _gap, currentDoms);
            }

            //获取鼠标点击按钮
            function getEBtn(e) {
                var ua = w.navigator.userAgent.toLowerCase(), ie_btn = u;
                ua.indexOf("msie") != -1 && (ua.match(/msie\s\d+/)[0].match(/\d+/)[0] || ua.match(/trident\s?\d+/)[0]) < 9 && (ie_btn = { 1: 0, 2: 2, 4: 1 }[e.button]);
                return ie_btn == u ? e.button : ie_btn;
            }

            /*
            **初始化
            */

            //初始化视图
            initView(sourceDom);

            //初始化事件
            initEvent();
        }

        if (sourceDoms.length === u) {
            initScroll(sourceDoms);
            return api_objs[0];
        }
        else {
            for (var i = 0; i < sourceDoms.length; i++) {
                initScroll(sourceDoms[i]);
            }
            return api_objs;
        }
    }
    w.nw = w.nw || {}, w.nw.scroll = nwScroll;
})(window, document, undefined);