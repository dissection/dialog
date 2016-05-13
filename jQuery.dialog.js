/**
 * Created by Administrator on 2016/4/27 0027.
 */

;!function (window, undefined) {
    //准备对象
    var $, win,ready={
        btn: ['&#x786E;&#x5B9A;','&#x53D6;&#x6D88;'],
        //五种原始层模式
        type: ['dialog', 'page', 'iframe', 'loading', 'tips']
    };
    //缓存常用字符
    var LAYER_DOMS={
        uiLayer:'ui-layer',
        uilayerTitle:'ui-layer-title',       // 层 的 title
        uilayerMain:'ui-layer-main',
        uilayerDialog:'ui-layer-dialog',
        uilayerIframe:'ui-layer-iframe',
        uilayerContent:'ui-layer-content',
        uilayerBtn:'ui-layer-btn',
        uilayerClose:'ui-layer-close',

        uiLayerShade :'ui-layer-shade', //遮罩 层
        //Tips
        uiLayerTipsG:'ui-layer-TipsG',

        //属性层字符串 一般不更改
        uiLayerBorder:'ui-layer-border',
        uiLayerPadding:'ui-layer-padding',
        uiLayerLoading:'ui-layer-loading',

        uiLayerIco:'ui-layer-ico',
        uiLayerSetwin:'ui-layer-setwin',
        uiLayerMin:'ui-layer-min',
        uiLayerMax:'ui-layer-max',
        uiLayerMaxmin:'layui-layer-maxmin',

        uiLayerWrap:'layui-layer-wrap',
        //拖拽移动
        uiLayerMoves:'ui-layer-moves'
    },
    LAYER_ANIM= ['layui-anim', 'layui-anim-01', 'layui-anim-02', 'layui-anim-03', 'layui-anim-04', 'layui-anim-05', 'layui-anim-06'];
    var layer={
        version:'1.0.0',
        ie6: !!window.ActiveXObject && !window.XMLHttpRequest,
        ie7: /MSIE 7/.test(navigator.userAgent),
        index:0,
        // path:
        consfig:function () {
            
        },
        //各种快捷引用
        alert: function(content, options, yes){
            var type = typeof options === 'function';
            if(type) yes = options;
            return layer.open($.extend({
                content: content,
                yes: yes
            }, type ? {} : options));
        },

        confirm: function(content, options, yes, cancel){
            var type = typeof options === 'function';
            if(type){
                cancel = yes;
                yes = options;
            }
            return layer.open($.extend({
                content: content,
                btn: ready.btn,
                yes: yes,
                cancel: cancel
            }, type ? {} : options));
        },

        msg: function(content, options, end){ //最常用提示层
            var type = typeof options === 'function'/*, rskin = ready.config.skin;*/
            var skin = 'ui-layer-msg';
            // var shift = doms.anim.length - 1;
            if(type) end = options;
            return layer.open($.extend({
                content: content,
                time: 30000,
                shade: false,
                skin: skin,
                title: false,
                closeBtn: false,
                btn: false,
                end: end
            }, (type && !ready.config.skin) ? {
                skin: skin + ' layui-layer-hui',
                shift: shift
            } : function(){
                options = options || {};
                if(options.icon === -1 || options.icon === undefined /*&& !ready.config.skin*/){
                    options.skin = skin + ' ' + (options.skin||'ui-layer-hui');
                }
                return options;
            }()));
        },

        load: function(icon, options){
            return layer.open($.extend({
                type: 3,
                icon: icon || 0,
                shade: 0.01
            }, options));
        },

        tips: function(content, follow, options){
            return layer.open($.extend({
                type: 4,
                content: [content, follow],
                closeBtn: false,
                time: 3000,
                maxWidth: 210
            }, options));
        }
    };

    var Kernel = function(setings){
        var that = this;
        that.index = ++layer.index;
        that.config = $.extend({}, that.config, ready.config, setings);
        that.creat();
    };
    Kernel.pt = Kernel.prototype;

    //默认配置
    Kernel.pt.config = {
        type: 0,
        shade: 0.3,
        fix: true,
        move:LAYER_DOMS.uilayerTitle,
        title: '&#x4FE1;&#x606F;',          //默认为 “信息”  如果是 false 表示没有标题
        offset: 'auto',
        area: 'auto',
        closeBtn: 1,
        time: -1,                           //自动关闭的时间
        zIndex: 19900112,
        maxWidth: 360,
        shift: 0,
        icon: -1,
        scrollbar: true, //是否允许浏览器滚动条
        tips: 2,
        maxmin:!1,    //最大化最小化
        iframeUrl:'http://layer.layui.com'
    };

    //容器
    /**
     * @conType：
     * @callback：function(html,titleHtml)
     * */
    Kernel.pt.vessel = function(conType, callback){
        var that = this, times = that.index, config = that.config;
        var zIndex = config.zIndex + times, titype = typeof config.title === 'object';
        // 当config.maxmin == true 并且  type 是 1 或者 2 的时候 ,返回 true
        var ismax = config.maxmin && (config.type === 1 || config.type === 2);
            // 判断 标题 并且 保存 html 字符串
        var titleHTML = (config.title ? '<div class="'+ LAYER_DOMS.uilayerTitle +'" style="'+ (titype ? config.title[1] : '') +'">'
        + (titype ? config.title[0] : config.title)
        + '</div>' : '');

        // z-index 的值
        config.zIndex = zIndex;

        callback([
            //遮罩
            config.shade ? ('<div class="'+LAYER_DOMS.uiLayerShade+'" id="'+LAYER_DOMS.uiLayerShade+ times +'" times="'+ times +'" style="'+ ('z-index:'+ (zIndex-1) +'; background-color:'+ (config.shade[1]||'#000') +'; opacity:'+ (config.shade[0]||config.shade) +'; filter:alpha(opacity='+ (config.shade[0]*100||config.shade*100) +');') +'"></div>') : '',

            //主体
            '<div class="'+ LAYER_DOMS.uiLayer +' '+ (LAYER_ANIM[config.shift]||'') + (' ui-layer-'+ready.type[config.type]) + (((config.type == 0 || config.type == 2) && !config.shade) ? LAYER_DOMS.uiLayerBorder : '') + ' ' + (config.skin||'') +'" id="'+ LAYER_DOMS.uiLayer + times +'" type="'+ ready.type[config.type] +'" times="'+ times +'" showtime="'+ config.time +'" conType="'+ (conType ? 'object' : 'string') +'" style="z-index: '+ zIndex +'; width:'+ config.area[0] + ';height:' + config.area[1] + (config.fix ? '' : ';position:absolute;') +'">'
            + (conType && config.type != 2 ? '' : titleHTML)
            +'<div class="'+ LAYER_DOMS.uilayerContent + ((config.type == 0 && config.icon !== -1) ? ' '+ LAYER_DOMS.uiLayerPadding : config.type == 3 ? ' '+LAYER_DOMS.uiLayerLoading +config.icon : '') +'">'
            + (config.type == 0 && config.icon !== -1 ? '<i class="'+LAYER_DOMS.uiLayerIco+' '+LAYER_DOMS.uiLayerIco+ config.icon +'"></i>' : '')
            + (config.type == 1 && conType ? '' : (config.content||''))
            +'</div>'
            + '<span class="'+LAYER_DOMS.uiLayerSetwin+'">'+ function(){
                var closebtn = ismax ? '<a class="'+LAYER_DOMS.uiLayerMin+'" href="javascript:;"><cite></cite></a><a class="'+LAYER_DOMS.uiLayerIco+' '+LAYER_DOMS.uiLayerMax +'" href="javascript:;"></a>' : '';
                config.closeBtn && (closebtn += '<a class="'+LAYER_DOMS.uiLayerIco+' '+ LAYER_DOMS.uilayerClose +' '+ LAYER_DOMS.uilayerClose + (config.title ? config.closeBtn : (config.type == 4 ? '1' : '2')) +'" href="javascript:;"></a>');
                return closebtn;
            }() + '</span>'
            + (config.btn ? function(){
                var button = '';
                typeof config.btn === 'string' && (config.btn = [config.btn]);
                for(var i = 0, len = config.btn.length; i < len; i++){
                    button += '<a class="'+ LAYER_DOMS.uilayerBtn +''+ i +'">'+ config.btn[i] +'</a>'
                }
                return '<div class="'+ LAYER_DOMS.uilayerBtn +'">'+ button +'</div>'
            }() : '')
            +'</div>'
        ], titleHTML);
        return that;
    };
    //创建骨架
    Kernel.pt.creat = function(){
        var that = this, config = that.config, times = that.index, nodeIndex;
        var content = config.content, conType = typeof content === 'object';

        //设置宽高
        if(typeof config.area === 'string'){
            config.area = config.area === 'auto' ? ['', ''] : [config.area, ''];
        }

        switch(config.type){
            case 0:
                //判断是存在 btn
                config.btn = ('btn' in config) ? config.btn : ready.btn[0];
                layer.closeAll('dialog');
                break;
            case 2:
                var content = config.content = conType ? config.content : [config.content||config.iframeUrl, 'auto'];
                config.content = '<iframe scrolling="'+ (config.content[1]||'auto') +'" allowtransparency="true" id="'+ LAYER_DOMS.uilayerIframe + times +'" name="'+ LAYER_DOMS.uilayerIframe + times +'" onload="this.className=\'\';" class="'+LAYER_DOMS.uiLayerLoading+'" frameborder="0" src="' + config.content[0] + '"></iframe>';
                break;
            case 3:
                config.title = false;
                config.closeBtn = false;
                config.icon === -1 && (config.icon === 0);
                layer.closeAll('loading');
                break;
            case 4:
                conType || (config.content = [config.content, 'body']);
                config.follow = config.content[1]; //跟随的 元素
                config.content = config.content[0] + '<i class="'+LAYER_DOMS.uiLayerTipsG+'"></i>';
                config.title = false;
                config.shade = false;
                config.fix = false;
                config.tips = typeof config.tips === 'object' ? config.tips : [config.tips, true];
                // tipsMore 允许多个意味着不会销毁之前的tips层。通过tipsMore: true开启
                config.tipsMore || layer.closeAll('tips');
                break;
        }

        //建立容器
        that.vessel(conType, function(html, titleHTML){
            $('body').append(html[0]);
            conType ? function(){
                (config.type == 2 || config.type == 4) ? function(){
                    $('body').append(html[1]);
                }() : function(){
                    if(!content.parents('.'+ LAYER_DOMS.uiLayer)[0]){
                        content.show().addClass(LAYER_DOMS.uiLayerWrap).wrap(html[1]);
                        $('#'+ LAYER_DOMS.uiLayer + times).find('.'+LAYER_DOMS.uilayerContent).before(titleHTML);
                    }
                }();
            }() : $('body').append(html[1]);
            that.layero = $('#'+ LAYER_DOMS.uiLayer + times);
            //是否允许浏览器出现滚动条
            config.scrollbar || LAYER_DOMS.html.css('overflow', 'hidden').attr('layer-full', times);
        }).auto(times);

        config.type == 2 && layer.ie6 && that.layero.find('iframe').attr('src', content[0]);
        $(document).off('keydown', ready.enter).on('keydown', ready.enter);
        that.layero.on('keydown', function(e){
            $(document).off('keydown', ready.enter);
        });

        //坐标自适应浏览器窗口尺寸
        config.type == 4 ? that.tips() : that.coord();
        //滚动的时候 层是否固定在这个区域
        if(config.fix){
            win.on('resize', function(){
                //计算坐标
                that.coord();
                (/^\d+%$/.test(config.area[0]) || /^\d+%$/.test(config.area[1])) && that.auto(times);
                config.type == 4 && that.tips();
            });
        }
        //自动关闭的时间
        config.time <= 0 || setTimeout(function(){
            layer.close(that.index)
        }, config.time);
        //关闭弹出层 并且 回调函数
        that.move().callback();
    };


//自适应
    Kernel.pt.auto = function(index){
        var that = this, config = that.config, layero = $('#'+ LAYER_DOMS.uiLayer + index);
        if(config.area[0] === '' && config.maxWidth > 0){
            //为了修复IE7下一个让人难以理解的bug
            if(layer.ie7 && config.btn){
                layero.width(layero.innerWidth());
            }
            //最大宽度 不会超过 config.maxWidth
            layero.outerWidth() > config.maxWidth && layero.width(config.maxWidth);
        }
        var area = [layero.innerWidth(), layero.innerHeight()];
        var titHeight = layero.find('.'+LAYER_DOMS.uilayerTitle).outerHeight() || 0;
        var btnHeight = layero.find('.'+LAYER_DOMS.uilayerBtn).outerHeight() || 0;

        /**
         * @elem dom元素
         */
        function setHeight(elem){
            elem = layero.find(elem);
            elem.height(area[1] - titHeight - btnHeight - 2*(parseFloat(elem.css('padding'))| 0));
        }
        switch(config.type){
            case 2:
                setHeight('iframe');
                break;
            default:
                if(config.area[1] === ''){
                    if(config.fix && area[1] >= win.height()){
                        area[1] = win.height();
                        setHeight('.'+LAYER_DOMS.uilayerContent);
                    }
                } else {
                    setHeight('.'+LAYER_DOMS.uilayerContent);
                }
                break;
        }
        return that;
    };

//计算坐标
    Kernel.pt.coord = function(){
        var that = this, config = that.config, layero = that.layero;
        var area = [layero.outerWidth(), layero.outerHeight()];
        var type = typeof config.offset === 'object';
        that.offsetTop = (win.height() - area[1])/2;
        that.offsetLeft = (win.width() - area[0])/2;
        //如果 offset 是一个对象 ,则直接使用

        if(type){   
            that.offsetTop = config.offset[0];
            that.offsetLeft = config.offset[1]||that.offsetLeft;
        } else if(config.offset !== 'auto'){  //如果字符串 不是 auto , 那么 offset 字符串 必然是 高度

            that.offsetTop = config.offset;
            // 在这个情况里 有表示 'rb' 表示 右下角
            if(config.offset === 'rb'){
                that.offsetTop = win.height() - area[1];
                that.offsetLeft = win.width() - area[0];
            }
        }
        //如果不是 锁定在 固定区域
        if(!config.fix){
            //如果是 % , 如果是 百分比
            that.offsetTop = /%$/.test(that.offsetTop) ?
            win.height()*parseFloat(that.offsetTop)/100
                : parseFloat(that.offsetTop);
            that.offsetLeft = /%$/.test(that.offsetLeft) ?
            win.width()*parseFloat(that.offsetLeft)/100
                : parseFloat(that.offsetLeft);
            that.offsetTop += win.scrollTop();
            that.offsetLeft += win.scrollLeft();
        }
        layero.css({top: that.offsetTop, left: that.offsetLeft});
    };

//Tips
    Kernel.pt.tips = function(){
        var that = this, config = that.config, layero = that.layero;
        var layArea = [layero.outerWidth(), layero.outerHeight()], follow = $(config.follow);
        if(!follow[0]) follow = $('body');
        var goal = {
            width: follow.outerWidth(),
            height: follow.outerHeight(),
            top: follow.offset().top,
            left: follow.offset().left
        }, tipsG = layero.find('.'+LAYER_DOMS.uiLayerTipsG);

        var guide = config.tips[0];
        //如果 tips[1] 不存在 表示没有箭头下标
        config.tips[1] || tipsG.remove();
        //判断 【tips箭头】 的函数
        goal.autoLeft = function(){
            // 如果 目标的 left 坐标 + tips 层的宽度 超过了 屏幕宽度
            if(goal.left + layArea[0] - win.width() > 0){

                goal.tipLeft = goal.left + goal.width - layArea[0];
                tipsG.css({right: 12, left: 'auto'});
            } else {
                goal.tipLeft = goal.left;
            }
        };

        //辨别tips的方位
        //layui-layer-TipsB layui-layer-TipsT layui-layer-TipsL layui-layer-TipsR 判断小箭头的方向
        goal.where = [function(){ //上
            goal.autoLeft();
            goal.tipTop = goal.top - layArea[1] - 10;
            tipsG.removeClass('layui-layer-TipsB').addClass('layui-layer-TipsT').css('border-right-color', config.tips[1]);
        }, function(){ //右
            goal.tipLeft = goal.left + goal.width + 10;
            goal.tipTop = goal.top;
            tipsG.removeClass('layui-layer-TipsL').addClass('layui-layer-TipsR').css('border-bottom-color', config.tips[1]);
        }, function(){ //下
            goal.autoLeft();
            goal.tipTop = goal.top + goal.height + 10;
            tipsG.removeClass('layui-layer-TipsT').addClass('layui-layer-TipsB').css('border-right-color', config.tips[1]);
        }, function(){ //左
            goal.tipLeft = goal.left - layArea[0] - 10;
            goal.tipTop = goal.top;
            tipsG.removeClass('layui-layer-TipsR').addClass('layui-layer-TipsL').css('border-bottom-color', config.tips[1]);
        }];
        goal.where[guide]();

        /* 8*2为小三角形占据的空间 */
        //判断 根据 goal 元素的位置 判断 tips 所在的位置
        if(guide === 0){
            goal.top - (win.scrollTop() + layArea[1] + 8*2) < 0 && goal.where[2]();
        } else if(guide === 1){
            win.width() - (goal.left + goal.width + layArea[0] + 8*2) > 0 || goal.where[3]()
        } else if(guide === 2){
            (goal.top - win.scrollTop() + goal.height + layArea[1] + 8*2) - win.height() > 0 && goal.where[0]();
        } else if(guide === 3){
            layArea[0] + 8*2 - goal.left > 0 && goal.where[1]()
        }

        layero.find('.'+LAYER_DOMS.uilayerContent).css({
            'background-color': config.tips[1],
            'padding-right': (config.closeBtn ? '30px' : '')
        });
        layero.css({left: goal.tipLeft, top: goal.tipTop});
    };

//拖拽层
    Kernel.pt.move = function(){
    var that = this, config = that.config, conf = {
        setY: 0,
        moveLayer: function(){
            var layero = conf.layero, mgleft = parseInt(layero.css('margin-left'));
            var lefts = parseInt(conf.move.css('left'));
            mgleft === 0 || (lefts = lefts - mgleft);
            if(layero.css('position') !== 'fixed'){
                lefts = lefts - layero.parent().offset().left;
                conf.setY = 0;
            }
            layero.css({left: lefts, top: parseInt(conf.move.css('top')) - conf.setY});
        }
    };
    //查看 选取移动的元素
    var movedom = that.layero.find('.'+config.move);
    config.move && movedom.attr('move', 'ok');
    movedom.css({cursor: config.move ? 'move' : 'auto'});
    console.log(config.move)
        movedom.on('mousedown', function(M){
        M.preventDefault();
        if($(this).attr('move') === 'ok'){
            conf.ismove = true;
            conf.layero = $(this).parents('.'+ LAYER_DOMS.uiLayer);
            var xx = conf.layero.offset().left, yy = conf.layero.offset().top, ww = conf.layero.outerWidth() - 6, hh = conf.layero.outerHeight() - 6;
            if(!$('#'+LAYER_DOMS.uiLayerMoves)[0]){
                $('body').append('<div id="'+LAYER_DOMS.uiLayerMoves+'" class="'+LAYER_DOMS.uiLayerMoves+'" style="left:'+ xx +'px; top:'+ yy +'px; width:'+ ww +'px; height:'+ hh +'px; z-index:2147483584"></div>');
            }
            //移动 虚影移动的元素
            conf.move = $('#'+LAYER_DOMS.uiLayerMoves);
            config.moveType && conf.move.css({visibility: 'hidden'});
                
            conf.moveX = M.pageX - conf.move.position().left;
            conf.moveY = M.pageY - conf.move.position().top;
            conf.layero.css('position') !== 'fixed' || (conf.setY = win.scrollTop());
        }
    });
    /*思路
    * 虚影div 的 left  和 top ,
    * 如果有虚影 ： 在移动中显示 虚影，在抬起鼠标的时候 将虚影 的 left 和 top 赋值给 层
    * 如果没有虚影 ： 在移动中 执行 赋值 left  和  top  函数 */
    $(document).mousemove(function(M){
        if(conf.ismove){
            var offsetX = M.pageX - conf.moveX, offsetY = M.pageY - conf.moveY;
            M.preventDefault();

            //控制元素不被拖出窗口外
            if(!config.moveOut){
                conf.setY = win.scrollTop();
                var setRig = win.width() - conf.move.outerWidth(), setTop = conf.setY;
                offsetX < 0 && (offsetX = 0);
                offsetX > setRig && (offsetX = setRig);
                offsetY < setTop && (offsetY = setTop);
                offsetY > win.height() - conf.move.outerHeight() + conf.setY && (offsetY = win.height() - conf.move.outerHeight() + conf.setY);
            }

            conf.move.css({left: offsetX, top: offsetY});
            config.moveType && conf.moveLayer();
            // ？？？？？
            offsetX = offsetY = setRig = setTop = null;
        }
    }).mouseup(function(){
        try{
            if(conf.ismove){
                conf.moveLayer();
                conf.move.remove();
                //当移动结束 离开这个元素触发
                config.moveEnd && config.moveEnd();
            }
            conf.ismove = false;
        }catch(e){
            conf.ismove = false;
        }
    });
    return that;
};

//当层创建完毕的时候 回到函数
    Kernel.pt.callback = function(){
        var that = this, layero = that.layero, config = that.config;
        that.openLayer();
        // 如果 success 存在
        if(config.success){
            //如果 类型 type  是 iframe
            if(config.type == 2){
                layero.find('iframe').on('load', function(){
                    config.success(layero, that.index);
                });
            } else {
                config.success(layero, that.index);
            }
        }
        //如果是 ie6  select 需要做隐藏处理 【兼容处理】
        layer.ie6 && that.IE6(layero);

        //按钮
        layero.find('.'+ LAYER_DOMS.uilayerBtn).children('a').on('click', function(){
            var index = $(this).index();
            config['btn'+(index+1)] && config['btn'+(index+1)](that.index, layero);
            if(index === 0){
                config.yes ? config.yes(that.index, layero) : layer.close(that.index);
            } else if(index === 1){
                cancel();
            } else {
                config['btn'+(index+1)] || layer.close(that.index);
            }
        });

        //取消
        function cancel(){
            var close = config.cancel && config.cancel(that.index);
            close === false || layer.close(that.index);
        }

        //右上角关闭回调
        layero.find('.'+ LAYER_DOMS.uilayerClose).on('click', cancel);

        //点遮罩关闭
        if(config.shadeClose){
            $('#'+ LAYER_DOMS.uiLayerShade+ that.index).on('click', function(){
                layer.close(that.index);
            });
        }

        //最小化
        layero.find('.'+LAYER_DOMS.uiLayerMin).on('click', function(){
            layer.min(that.index, config);
            config.min && config.min(layero);
        });

        //全屏/还原
        layero.find('.'+LAYER_DOMS.uiLayerMax).on('click', function(){
            if($(this).hasClass(LAYER_DOMS.uiLayerMaxmin)){
                layer.restore(that.index);
                config.restore && config.restore(layero);
            } else {
                layer.full(that.index, config);
                config.full && config.full(layero);
            }
        });

        config.end && (ready.end[that.index] = config.end);
    };

    //for ie6 恢复select
    ready.reselect = function(){
        $.each($('select'), function(index , value){
            var sthis = $(this);
            if(!sthis.parents('.'+ LAYER_DOMS.uiLayer)[0]){
                (sthis.attr('layer') == 1 && $('.'+ LAYER_DOMS.uiLayer).length < 1) && sthis.removeAttr('layer').show();
            }
            sthis = null;
        });
    };

    Kernel.pt.IE6 = function(layero){
        var that = this, _ieTop = layero.offset().top;

        //ie6的固定与相对定位
        function ie6Fix(){
            layero.css({top : _ieTop + (that.config.fix ? win.scrollTop() : 0)});
        };
        ie6Fix();
        win.scroll(ie6Fix);

        //处理 ie6 隐藏select
        $('select').each(function(index , value){
            var sthis = $(this);
            if(!sthis.parents('.'+LAYER_DOMS.uiLayer)[0]){
                sthis.css('display') === 'none' || sthis.attr({'layer' : '1'}).hide();
            }
            sthis = null;
        });
    };

    //需依赖原型的对外方法
    Kernel.pt.openLayer = function(){
        var that = this;

        //置顶当前窗口
        layer.zIndex = that.config.zIndex;
        layer.setTop = function(layero){
            var setZindex = function(){
                layer.zIndex++;
                layero.css('z-index', layer.zIndex + 1);
            };
            layer.zIndex = parseInt(layero[0].style.zIndex);
            layero.on('mousedown', setZindex);
            return layer.zIndex;
        };
    };

    ready.record = function(layero){
        var area = [
            layero.outerWidth(),
            layero.outerHeight(),
            layero.position().top,
            layero.position().left + parseFloat(layero.css('margin-left'))
        ];
        layero.find('.'+ LAYER_DOMS.uiLayerMax).addClass('.'+ LAYER_DOMS.uiLayerMaxmin);
        layero.attr({area: area});
    };
    // 当全屏的时候 添加 限制高度
    ready.rescollbar = function(index){
        if(LAYER_DOMS.html.attr('layer-full') == index){
            if(LAYER_DOMS.html[0].style.removeProperty){
                LAYER_DOMS.html[0].style.removeProperty('overflow');
            } else {
                LAYER_DOMS.html[0].style.removeAttribute('overflow');
            }
            LAYER_DOMS.html.removeAttr('layer-full');
        }
    };

    /** 内置成员 */
    window.layer = layer;

    //获取子iframe的DOM
    layer.getChildFrame = function(selector, index){
        index = index || $('.'+LAYER_DOMS.uilayerIframe).attr('times');
        return $('#'+ LAYER_DOMS.uiLayer + index).find('iframe').contents().find(selector);
    };

    //得到当前iframe层的索引，子iframe时使用
    layer.getFrameIndex = function(name){
        return $('#'+ name).parents('.'+LAYER_DOMS.uilayerIframe).attr('times');
    };

    //iframe层自适应宽高
    layer.iframeAuto = function(index){
        if(!index) return;
        var heg = layer.getChildFrame('html', index).outerHeight();
        var layero = $('#'+ LAYER_DOMS.uiLayer + index);
        var titHeight = layero.find(LAYER_DOMS.uilayerTitle).outerHeight() || 0;
        var btnHeight = layero.find('.'+LAYER_DOMS.uilayerBtn).outerHeight() || 0;
        layero.css({height: heg + titHeight + btnHeight});
        layero.find('iframe').css({height: heg});
    };

    //重置iframe url
    layer.iframeSrc = function(index, url){
        $('#'+ LAYER_DOMS.uiLayer + index).find('iframe').attr('src', url);
    };

    //设定层的样式
    layer.style = function(index, options){
        var layero = $('#'+ LAYER_DOMS.uiLayer + index), type = layero.attr('type');
        var titHeight = layero.find(LAYER_DOMS.uilayerTitle).outerHeight() || 0;
        var btnHeight = layero.find('.'+LAYER_DOMS.uilayerBtn).outerHeight() || 0;
        if(type === ready.type[1] || type === ready.type[2]){
            layero.css(options);
            if(type === ready.type[2]){
                layero.find('iframe').css({
                    height: parseFloat(options.height) - titHeight - btnHeight
                });
            }
        }
    };

    //最小化
    layer.min = function(index, options){
        var layero = $('#'+ LAYER_DOMS.uiLayer + index);
        var titHeight = layero.find('.'+LAYER_DOMS.uilayerTitle).outerHeight() || 0;
        ready.record(layero);
        layer.style(index, {width: 180, height: titHeight, overflow: 'hidden'});
        layero.find('.'+LAYER_DOMS.uiLayerMin).hide();
        layero.attr('type') === 'page' && layero.find(LAYER_DOMS.uilayerIframe).hide();
        ready.rescollbar(index);
    };
//还原
    layer.restore = function(index){
        var layero = $('#'+ LAYER_DOMS.uiLayer + index), area = layero.attr('area').split(',');
        var type = layero.attr('type');
        layer.style(index, {
            width: parseFloat(area[0]),
            height: parseFloat(area[1]),
            top: parseFloat(area[2]),
            left: parseFloat(area[3]),
            overflow: 'visible'
        });
        layero.find('.'+LAYER_DOMS.uiLayerMin).removeClass(LAYER_DOMS.uiLayerMaxmin);
        layero.find('.'+LAYER_DOMS.uiLayerMin).show();
        layero.attr('type') === 'page' && layero.find(LAYER_DOMS.uilayerIframe).show();
        ready.rescollbar(index);
    };
//全屏
    layer.full = function(index){
        var layero = $('#'+ LAYER_DOMS.uiLayer + index), timer;
        ready.record(layero);
        if(!LAYER_DOMS.html.attr('layer-full')){
            LAYER_DOMS.html.css('overflow','hidden').attr('layer-full', index);
        }
        clearTimeout(timer);
        timer = setTimeout(function(){
            var isfix = layero.css('position') === 'fixed';
            layer.style(index, {
                top: isfix ? 0 : win.scrollTop(),
                left: isfix ? 0 : win.scrollLeft(),
                width: win.width(),
                height: win.height()
            });
            layero.find('.layui-layer-min').hide();
        }, 100);
    };

//改变title
    layer.title = function(name, index){
        var title = $('#'+ LAYER_DOMS.uiLayer + (index||layer.index)).find('.'+LAYER_DOMS.uilayerTitle);
        title.html(name);
    };
    
//关闭layer总方法
    layer.close = function(index){
        var layero = $('#'+ LAYER_DOMS.uiLayer + index), type = layero.attr('type');
        if(!layero[0]) return;
        if(type === ready.type[1] && layero.attr('conType') === 'object'){
            layero.children(':not(.'+ LAYER_DOMS.uilayerContent +')').remove();
            for(var i = 0; i < 2; i++){
                layero.find('.layui-layer-wrap').unwrap().hide();
            }
        } else {
            //低版本IE 回收 iframe
            if(type === ready.type[2]){
                try {
                    var iframe = $('#'+LAYER_DOMS.uilayerIframe+index)[0];
                    iframe.contentWindow.document.write('');
                    iframe.contentWindow.close();
                    layero.find('.'+LAYER_DOMS.uilayerContent)[0].removeChild(iframe);
                } catch(e){}
            }
            layero[0].innerHTML = '';
            layero.remove();
        }
        $('#layui-layer-moves, #layui-layer-shade' + index).remove();
        layer.ie6 && ready.reselect();
        ready.rescollbar(index);
        $(document).off('keydown', ready.enter);
        typeof ready.end[index] === 'function' && ready.end[index]();
        delete ready.end[index];
    };

//关闭所有层
    layer.closeAll = function(type){
        $.each($('.'+LAYER_DOMS.uiLayer), function(){
            var othis = $(this);
            var is = type ? (othis.attr('type') === type) : 1;
            is && layer.close(othis.attr('times'));
            is = null;
        });
    };

    //主入口
    ready.run = function(){
        $ = jQuery;
        win = $(window);
        LAYER_DOMS.html = $('html');
        layer.open = function(deliver){
            var o = new Kernel(deliver);
            return o.index;
        };
    };
    console.log(ready.run);
    ready.run();

}(window);