/**
 * Created by Administrator on 2016/4/27 0027.
 */

;!function (window, undefined) {
    //准备对象
    var $, win,ready={
        btn: ['&#x786E;&#x5B9A;','&#x53D6;&#x6D88;'],
        //五种原始层模式
        type: ['dialog', 'page', 'iframe', 'loading', 'tips'],
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
        uiLayerTipsG:'layui-layer-TipsG',

        //属性层字符串 一般不更改
        uiLayerBorder:'ui-layer-border',
        uiLayerPadding:'ui-layer-padding',
        uiLayerLoading:'ui-layer-loading',

        uiLayerIco:'ui-layer-ico',
        uiLayerSetwin:'ui-layer-setwin',
        uiLayerMin:'ui-layer-min',
        uiLayerMax:'ui-layer-max',

        uiLayerWrap:'layui-layer-wrap'


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
            var type = typeof options === 'function', rskin = ready.config.skin;
            var skin = (rskin ? rskin + ' ' + rskin + '-msg' : '')||'layui-layer-msg';
            var shift = doms.anim.length - 1;
            if(type) end = options;
            return layer.open($.extend({
                content: content,
                time: 3000,
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
                if(options.icon === -1 || options.icon === undefined && !ready.config.skin){
                    options.skin = skin + ' ' + (options.skin||'layui-layer-hui');
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
        move: ready.doms[1],
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
            '<div class="'+ LAYER_DOMS.uiLayer +' '+ (LAYER_ANIM[config.shift]||'') + ('ui-layer-'+ready.type[config.type]) + (((config.type == 0 || config.type == 2) && !config.shade) ? LAYER_DOMS.uiLayerBorder : '') + ' ' + (config.skin||'') +'" id="'+ LAYER_DOMS.uiLayer + times +'" type="'+ ready.type[config.type] +'" times="'+ times +'" showtime="'+ config.time +'" conType="'+ (conType ? 'object' : 'string') +'" style="z-index: '+ zIndex +'; width:'+ config.area[0] + ';height:' + config.area[1] + (config.fix ? '' : ';position:absolute;') +'">'
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
        config.type == 4 ? that.tips() : that.offset();
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
        if(type){   
            that.offsetTop = config.offset[0];
            that.offsetLeft = config.offset[1]||that.offsetLeft;
        } else if(config.offset !== 'auto'){
            that.offsetTop = config.offset;
            if(config.offset === 'rb'){ //右下角
                that.offsetTop = win.height() - area[1];
                that.offsetLeft = win.width() - area[0];
            }
        }
        if(!config.fix){
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

    window.layer = layer;


//关闭layer总方法
    layer.close = function(index){
        var layero = $('#'+ doms[0] + index), type = layero.attr('type');
        if(!layero[0]) return;
        if(type === ready.type[1] && layero.attr('conType') === 'object'){
            layero.children(':not(.'+ doms[5] +')').remove();
            for(var i = 0; i < 2; i++){
                layero.find('.layui-layer-wrap').unwrap().hide();
            }
        } else {
            //低版本IE 回收 iframe
            if(type === ready.type[2]){
                try {
                    var iframe = $('#'+doms[4]+index)[0];
                    iframe.contentWindow.document.write('');
                    iframe.contentWindow.close();
                    layero.find('.'+doms[5])[0].removeChild(iframe);
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
        $.each($('.'+doms[0]), function(){
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
    console.log(ready.run)
    ready.run();

}(window);