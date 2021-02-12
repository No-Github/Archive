Skroll = function(opt){
    var mSettings = $.extend({
        mobile:false
    },opt)
    var _this = this;
    this.elements = [];
    this.inViewport = function(elem,settings){
        var win = $(window);
        var elementTop = elem.data("skrollData").offset.top;
        var elementBottom = elementTop + elem.outerHeight();
        var viewportTop = win.scrollTop() + win.height()*settings.triggerTop;
        var viewportBottom = win.scrollTop() + win.height()*settings.triggerBottom;
        return (elementBottom > viewportTop && elementTop < viewportBottom);
    }
    this.getScrollStatus = function(elem,settings){
        if(this.inViewport(elem,settings)){
            elem.data("skrollData").inView = true;
            return {action:"enter",data:elem.data("skrollData")};
        }else{
            if(elem.data("skrollData").inView){
                elem.data("skrollData").inView = false;
                return {action:"leave",data:elem.data("skrollData")};;
            }
            return {action:"idle",data:elem.data("skrollData")};
        }
    }
    this.add = function(el,options){
        var settings = $.extend({
            triggerTop:.2,
            triggerBottom:.8,
            delay:0,
            duration:500,
            animation:"zoomIn",
            easing:"ease",
            wait:0,
            repeat:false,
            onEnter:false,
            onLeave:false
        },options);
        _this.elements.push({
            element:el,
            settings:settings
        });
        return _this;
    }
    this.recalcPosition = function(){
        $.each(_this.elements,function(key,val){
            $(val.element).each(function(i,e){
                var $el = $(e);
                if(!$el.data("skrollData").shown){
                    var t = $el.css("transform");
                    $el.css("transform","none");
                    $el.data("skrollData").offset = $el.offset();
                    $el.css("transform",t);
                }
            })
        })
    }
    this.throttle = function(fn,threshhold,scope){
        threshhold || (threshhold = 250);
        var last,deferTimer;
        return function () {
            var context = scope || this;
            var now = +new Date,
            args = arguments;
            if(last && now < last + threshhold){
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function(){
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            }else{
                last = now;
                fn.apply(context, args);
            }
        };
    }
    this.addAnimation = function(name,property){
        _this.animations[name] = property;
        return _this;
    }
    this.init = function(){
        if(!mSettings.mobile && $(window).width() < 600) return _this;
        $.each(_this.elements,function(key,val){
            $(val.element).each(function(i,e){
                $(e).data("skrollData",{
                    inView:false,
                    shown:false,
                    offset:$(e).offset()
                })
                if(typeof(val.settings.animation) == "string" && val.settings.animation != "none"){
                    if(!_this.animations[val.settings.animation]){
                        console.warn("The requested animation '%s' was not found switching to default zoomIn",val.settings.animation);
                        console.trace();
                        val.settings.animation = "zoomIn";
                    }
                    _this.animations[val.settings.animation].start(e);
                }else if(typeof(val.settings.animation) == "object"){
                    if(val.settings.animation.start != undefined){
                        val.settings.animation.start(e);
                    }
                }
            })
        })
        $(window).on("resize scroll",this.throttle(function(){
            $.each(_this.elements,function(key,val){
                var tDelay = val.settings.wait;
                $(val.element).each(function(i,e){
                    var element = $(e);
                    var sStat = _this.getScrollStatus(element,val.settings);
                    if(sStat.action == "idle") return;
                    if(sStat.action == "enter" && !sStat.data.shown){
                        if(typeof(val.settings.animation) == "string" && val.settings.animation != "none"){
                            element.css("transition","all "+val.settings.duration+"ms "+val.settings.easing).delay(tDelay).queue(function(next){
                                    _this.animations[val.settings.animation].end(e);
                                    element.data("skrollData").shown = true;
                                    next();
                                })
                        }else if(typeof(val.settings.animation) == "object"){
                            if(val.settings.animation.end != undefined){
                                element.css("transition","all "+val.settings.duration+"ms "+val.settings.easing).delay(tDelay).queue(function(next){
                                        val.settings.animation.end(e);
                                        element.data("skrollData").shown = true;
                                        next();
                                    })
                            }
                        }
                        tDelay+= val.settings.delay;
                        
                    }else if(sStat.action == "leave" && sStat.data.shown){
                        if(val.settings.repeat){
                            if(typeof(val.settings.animation) == "string" && val.settings.animation != "none"){
                                if(_this.animations[val.settings.animation]){
                                    element.css("transition","all "+val.settings.duration+"ms "+val.settings.easing).delay(tDelay).queue(function(next){
                                            _this.animations[val.settings.animation].start(e);
                                            element.data("skrollData").shown = false;
                                            next();
                                        })
                                }
                            }else if(typeof(val.settings.animation) == "object"){
                                if(val.settings.animation.end != undefined){
                                    element.css("transition","all "+val.settings.duration+"ms "+val.settings.easing).delay(tDelay).queue(function(next){
                                            val.settings.animation.start(e);
                                            element.data("skrollData").shown = false;
                                            next();
                                        })
                                }
                            }
                            tDelay+= val.settings.delay;
                        }
                    }
                    if(sStat.action == "enter"){ 
                        if(val.settings.onEnter) val.settings.onEnter(i,e);
                    }else if(sStat.action == "leave"){
                        if(val.settings.onLeave) val.settings.onLeave(i,e);
                    }
                })
            })
        },150));
        $(window).scroll();
        $(window).resize(this.recalcPosition());
        return _this;
    }
    this.animations = {
        zoomIn:{
            start:function(el){
                $(el).css({
                    transform:"scale(.1,.1)",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"scale(1,1)",
                    opacity:1
                })
            }
        },
        fadeInLeft:{
            start:function(el){
                $(el).css({
                    transform:"translate(-50%,0)",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"translate(0,0)",
                    opacity:1
                })
            }
        },
        fadeInRight:{
            start:function(el){
                $(el).css({
                    transform:"translate(50%,0)",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"translate(0,0)",
                    opacity:1
                })
            }
        },
        fadeInLeftBig:{
            start:function(el){
                $(el).css({
                    transform:"translate(-100%,0)",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"translate(0,0)",
                    opacity:1
                })
            }
        },
        fadeInRightBig:{
            start:function(el){
                $(el).css({
                    transform:"translate(100%,0)",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"translate(0,0)",
                    opacity:1
                })
            }
        },
        fadeInUp:{
            start:function(el){
                $(el).css({
                    transform:"translate(0,50%)",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"translate(0,0)",
                    opacity:1
                })
            }
        },
        fadeInDown:{
            start:function(el){
                $(el).css({
                    transform:"translate(0,-50%)",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"translate(0,0)",
                    opacity:1
                })
            }
        },
        slideInLeft:{
            start:function(el){
                $(el).css({
                    transform:"translate(-50%,0) scale(.8,.8)",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"translate(0,0) scale(1,1)",
                    opacity:1
                })
            }
        },
        slideInLeftBig:{
            start:function(el){
                $(el).css({
                    transform:"translate(-100%,0) scale(.8,.8)",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"translate(0,0) scale(1,1)",
                    opacity:1
                })
            }
        },
        slideInRight:{
            start:function(el){
                $(el).css({
                    transform:"translate(50%,0) scale(.8,.8)",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"translate(0,0) scale(1,1)",
                    opacity:1
                })
            }
        },
        slideInRightBig:{
            start:function(el){
                $(el).css({
                    transform:"translate(-100%,0) scale(.8,.8)",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"translate(0,0) scale(1,1)",
                    opacity:1
                })
            }
        },
        flipInX:{
            start:function(el){
                $(el).css({
                    transform:"rotateX(90deg)",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"rotateX(0deg)",
                    opacity:1
                })
            }
        },
        flipInY:{
            start:function(el){
                $(el).css({
                    transform:"rotateY(90deg)",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"rotateY(0deg)",
                    opacity:1
                })
            }
        },
        rotateRightIn:{
            start:function(el){
                $(el).css({
                    transform:"rotate(45deg)",
                    transformOrigin:"0 100%",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"rotate(0deg)",
                    opacity:1
                })
            }
        },
        rotateLeftIn:{
            start:function(el){
                $(el).css({
                    transform:"rotate(-45deg)",
                    transformOrigin:"0 100%",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"rotate(0deg)",
                    opacity:1
                })
            }
        },
        growInLeft:{
            start:function(el){
                $(el).css({
                    transform:"translate(-100%,0) scale(.1,.1)",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"translate(0,0) scale(1,1)",
                    opacity:1
                })
            }
        },
        growInRight:{
            start:function(el){
                $(el).css({
                    transform:"translate(100%,0) scale(.1,.1)",
                    opacity:0
                });
            },
            end:function(el){
                $(el).css({
                    transform:"translate(0,0) scale(1,1)",
                    opacity:1
                })
            }
        }
    }
}