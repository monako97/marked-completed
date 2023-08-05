# marked completed

该插件来自于对 [marked](https://marked.js.org) 的二次开发, 增加对以下语法的支持

- [x] TOC `[TOC]`
- [x] emoji `:small:`
- [x] mark `==mark==`
- [x] sup `^sup^`
- [x] sub `~sub~`
- [x] ins `++ins++`
- [x] s `~~s~~`
- [x] inline katex `$\underbrace{a+b+\dots+n}_{m2}$`
- [x] katex `$$\underbrace{a+b+\dots+n}_{m2}$$`
- [x] colorFont `\color{red}{红色文字}`、 `\color{red|4|黑体|0.4}{红色文字4号黑体字40%透明度}`、`\color{red||黑体}{红色文字黑体}`、

添加配置项

- [x] `emojiSource` 自定义展示的emoji图片源, 比如设置为 `xxx.com/img/`, 当你输入 `:small:` 时, 则通过 `xxx.com/img/small.png` 显示对应的emoji
- [x] `emoji` 匹配到emoji时, emoji的映射表, 比如 `{small:'😊'}`, 当你输入 `:small:` 则渲染出 😊
- [x] `langLineNumber` 添加一个标注于显示代码行号的类名, 比如设置为 `true`
- [x] `langToolbar` 在代码块的输出中添加一个功能栏, 比如设置为 `['copy']`
