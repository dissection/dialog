# dialog

## options

* title - 标题 [`String/Array/Boolean`]  
`defult`：'信息'  
title支持三种类型的值，若你传入的是普通的字符串，如title :'我是标题'，那么只会改变标题文本；若你还需要自定义标题区域样式，那么你可以title: ['文本', 'font-size:18px;']，数组第二项可以写任意css样式；如果你不想显示标题栏，你可以title: false

* zIndex [`number`]  
  `defult`：'19900112'  
  这是一个 默认 的 z-index 基数

* shade - 遮罩 [`String/Array/Boolean`]  
`defult`：'0.3'  
即弹层外区域。默认是0.3透明度的黑色背景（'#000'）。如果你想定义别的颜色，可以shade: [0.8, '#393D49']；如果你不想显示遮罩，可以shade: 0

* area - 宽高 [`String/Array`]  
`defult`：'auto'  
在默认状态下，layer是宽高都自适应的，但当你只想定义宽度时，你可以area: '500px'，高度仍然是自适应的。当你宽高都要定义时，你可以area: ['500px', '300px']