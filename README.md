# dialog

## options

* type - 基本层类型 [`Number`]  
`defult`：0  
layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。 若你采用layer.open({type: 1})方式调用，则type为必填项（信息框除外）
  
* title - 标题 [`String/Array/Boolean`]  
`defult`：'信息'  
title支持三种类型的值，若你传入的是普通的字符串，如title :'我是标题'，那么只会改变标题文本；若你还需要自定义标题区域样式，那么你可以title: ['文本', 'font-size:18px;']，数组第二项可以写任意css样式；如果你不想显示标题栏，你可以title: false

* content - 内容 [`String/DOM/Array`]  
content可传入的值是灵活多变的，不仅可以传入普通的html内容，还可以指定DOM，更可以随着type的不同而不同。譬如：

        /!*
         如果是页面层
         */
        layer.open({
          type: 1, 
          content: '传入任意的文本或html' //这里content是一个普通的String
        });
        layer.open({
          type: 1,
          content: $('#id') //这里content是一个DOM
        });
        //Ajax获取
        $.post('url', {}, function(str){
          layer.open({
            type: 1,
            content: str //注意，如果str是object，那么需要字符拼接。
          });
        });
        
        /!*
         如果是iframe层
         */
        layer.open({
          type: 2, 
          content: 'http://sentsin.com' //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
        }); 
        
        /!*
         如果是用layer.open执行tips层
         */
        layer.open({
          type: 4,
          content: ['内容', '#id'] //数组第二项即吸附元素选择器或者DOM
        });        

* area - 宽高 [`String/Array`]  
`defult`：'auto'  
在默认状态下，layer是宽高都自适应的，但当你只想定义宽度时，你可以area: '500px'，高度仍然是自适应的。当你宽高都要定义时，你可以area: ['500px', '300px']

* btn - 按钮 [`String/Array`]  
`defult`：'确认'  
信息框模式时，btn默认是一个确认按钮，其它层类型则默认不显示，加载层和tips层则无效。当您只想自定义一个按钮时，你可以btn: '我知道了'，当你要定义两个按钮时，你可以btn: ['yes', 'no']。当然，你也可以定义更多按钮，比如：btn: ['按钮1', '按钮2', '按钮3', …]，按钮1和按钮2的回调分别是yes和cancel，而从按钮3开始，则回调为btn3: function(){}，例如

        //eg1     
        layer.confirm('纳尼？', {
          btn: ['按钮一', '按钮二', '按钮三'] //可以无限个按钮
          ,btn3: function(index, layero){
            //按钮【按钮三】的回调
          }
        }, function(index, layero){
          //按钮【按钮一】的回调
        }, function(index){
          //按钮【按钮二】的回调
        });
        
        //eg2
        layer.open({
          content: 'test'
          ,btn: ['按钮一', '按钮二', '按钮三']
          ,yes: function(index, layero){ //或者使用btn1
            //按钮【按钮一】的回调
          },cancel: function(index){ //或者使用btn2
            //按钮【按钮二】的回调
          },btn3: function(index, layero){
            //按钮【按钮三】的回调
          }
        });
      
* shade - 遮罩 [`String/Array/Boolean`]  
`defult`：'0.3'  
即弹层外区域。默认是0.3透明度的黑色背景（'#000'）。如果你想定义别的颜色，可以shade: [0.8, '#393D49']；如果你不想显示遮罩，可以shade: 0

* fix - 固定 [`Boolean`]  
`defult`：true  
即鼠标滚动时，层是否固定在可视区域。如果不想，设置fix: false即可

* scrollbar - 是否允许浏览器出现滚动条 [`Boolean`]
`defult`：true
    默认允许浏览器滚动，如果设定scrollbar: false，则屏蔽
        
* zIndex [`number`]  
  `defult`：'19900112'  
  这是一个 默认 的 z-index 基数