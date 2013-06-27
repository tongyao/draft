MBAAS JS API
============

## Overview

### Design Principle

* 设计上只考虑移动设备的modern browser，桌面的陈旧浏览器（IE7以下等）不特别支持
* 使用统一命名空间，在命名空间下区分不同产品
* 各模块独立工作，支持开发者根据自身需要自行选择custom build
* 所有的网络场景都认为是跨域的，涉及cors的需要server测配置Access-Control-Allow-Origin:*
* 考虑到实际用户加载性能，不提供异步loader
* 所有模块需要统一使用框架提供的网络访问接口，用于未来兼容nodejs等其他平台
* 所有子API不应该包含任何对BOM & DOM对象的访问和操作
* 按较小的功能粒度切分文件，每个product在src目录下拥有独立目录
* 除public api外，不在window对象上挂载任何全局变量，代码使用闭包包装
* public api统一遵循namespace，挂接于baidu.mbaas之下

### Namespace

    baidu.mbaas.[product]

### 目录说明

* bin - 编译产出目录
* build - 编译脚本
* sample - 用于存放API使用Sample
* src - 源代码
* test - 单元测试
* mbaas.js - 依赖关系描述 / Debug用的SDK入口文件

### 开发流程

1. git clone
1. 执行npm install安装所需node_modules(用于编译脚本）
1. 在src目录中开发源代码 / test目录中开发单元测试 / sample中存放示例
1. 在根目录执行build/mbaas build 执行编译

## API List

### General

#### AJAX (CORS)

GET
	baidu.mbaas.ajax.get(url, data, {
	
		callback : function(data){},	//optional
		onerror : function(xhr, error){} //optional
	
	});
	
GET JSON
	baidu.mbaas.ajax.getJSON(url, data, {
	
		callback : function(data){},	//optional
		onerror : function(xhr, error){} //optional
	
	});
	
POST
	baidu.mbaas.ajax.post(url, data, 'json', {
	
		callback : function(data){},	//optional
		onerror : function(xhr, error){} //optional
	
	});


#### JSONP

用于短链接请求所有跨域HTTP请求

JSONP配置
    
    baidu.mbaas.jsonp.init({
    
        error : function(ex){}, //统一的错误处理方法
    
        callbackName : 'customCallbackName' //JSONP的回调方法名
    })
    
发起JSONP请求
    
    baidu.mbaas.jsonp.get('url.php', {paramA : 1, paramB : 2}, function(data){
        //do something with data, which is the JSON object you should retrieve from someUrl.php
    }, function(ex){ 
        //something goes wrong. optional
    });
    
    //generates: 
    //http://url.php?paramA=1&paramB=2&callback=baidu_mbaas_callback_json1
    
    //server should return
    //baidu_mbaas_callback_json1({data : 'abcdefg'})
    

### Social Login

### Channel

### Mobile Stat

### PCS + PSS + BCS + BSS
