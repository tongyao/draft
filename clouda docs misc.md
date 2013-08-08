##Handlebars的语法增强API

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

##自定义Manifest离线缓存文件

Clouda框架会将各个package.js中描述的JS和CSS资源自动写入manifest文件形成离线缓存。
如果对于图片，音乐等其他文件也有离线缓存需求，可通过建立app.manifest文件进行描述。
在app.manifest中描述过的资源，Clouda框架在启动时会一并写入整体manifest文件中。

app.manifest文件应该建立在如下位置，与controller,publish等目录平级：
    app目录/app.manifest

app.manifest文件的格式与w3c规定的manifest文件格式一致，见：[http://www.whatwg.org/specs/web-apps/current-work/multipage/offline.html]

但目前暂不支持SETTINGS:域

一个示例：

    CACHE MANIFEST
	# the above line is required
	
	# this is a comment
	# there can be as many of these anywhere in the file
	# they are all ignored
	  # comments can have spaces before them
	  # but must be alone on the line
	
	# blank lines are ignored too
	
	# these are files that need to be cached they can either be listed
	# first, or a "CACHE:" header could be put before them, as is done
	# lower down.
	images/sound-icon.png
	images/background.png
	# note that each file has to be put on its own line
	
	# here is a file for the online whitelist -- it isn't cached, and
	# references to this file will bypass the cache, always hitting the
	# network (or trying to, if the user is offline).
	NETWORK:
	comm.cgi
	
	# here is another set of files to cache, this time just the CSS file.
	CACHE:
	style/default.css
	
## router的外部处理器

如果您使用backbone等第三方框架，或是存在已有代码根据URL的变化执行一些逻辑，那么这些需求，都可以通过注册一个router的外部处理器使其保持正常工作。

一个外部处理器的写法：
	var processor = function(path){
		//do something
		return true;
	}

添加一个外部处理器：
	sumeru.router.externalProcessor.add(processor);
	
执行顺序：
URL匹配将按如下顺序执行

 1. 检查所有通过sumeru.router.add添加的规则，如果有，执行对应controller，不再向下寻找；如果没有匹配，进入下一步
 2. 读取所有通过sumeru.router.externalProcessor.add添加的外部处理器，按照添加顺序逐个传入当前path，如果遇到返回true，则终止查找；如果遇到返回false，则继续执行下一个外部处理器。
 3. 若通过以上两步执行后仍然没有匹配项，则执行默认Controller。如未设置默认Controller，抛出异常。

添加一个backbone的外部处理器：
	sumeru.router.externalProcessor.add(Backbone.Router.extend());

##view模板的路径定义

如果你的view模板没有放在app目录/view/中，可以通过如下命令修改视图的目录位置：

	sumeru.config.view.set('path', 'path/to/');

则Clouda会在如下目录中加载视图：

	app目录/path/to/view/

注意，即使是修改viewpath的情况下，在最内一侧仍然需要有一层view文件夹，如上面路径的最后部分
