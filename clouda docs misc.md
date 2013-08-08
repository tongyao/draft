Handlebars的语法增强API

Handlebars的语法非常易用，但为了更快的开发视图代码，Clouda还额外提供了便捷的工具方法

foreach 
用于快速遍历一个对象或数组

语法：
    {{#foreach}}{{/foreach}}

用法示例：

    <p id="test-foreach-caseB">  
        {{#foreach customObj}}
            {{key}} : {{value}}
        {{/foreach}}
    </p>


compare
比较两个对象

语法：

    {{#compare a operator b}}
    {{else}}
    {{/compare}}

可以的operator：

 * ==
 * ===
 * !=
 * !==
 * <
 * <=
 * >
 * >=
 * typeof

用法示例：

    {{#compare a "<" b}}
		a < b
	{{else}}
		a >= b
	{{/compare}}

    {{#compare a "typeof" "undefined"}}
		undefined
	{{/compare}}

当省略operator时，系统默认使用操作符 ==：

    {{#compare 1 1}}
		1 == 1
	{{/compare}}


