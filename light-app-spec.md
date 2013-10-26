# 轻应用API规范

@liujunzhong @xiaowei @tongyao


> 为兼容系统原生webview，所有API均为异步模型。
> 对于存在阻塞的场景，均采用模拟阻塞的方式，在[Camera / 手机图库]的实现思路部分有详细说明

## version 1.0

	2013.10.22
	@todo defer & promise

## 命名空间
    clouda

## APP信息注册 
	clouda.lightapp(apikey)
	
	必须首先调用以完成APP注册，方可正常使用轻应用API

轻应用会自行检测，若未收到apikey注册，则阻止所有API调用

## 设备能力
	clouda.device
	
### Camera / 手机图库
	clouda.device.media
	
#### API

***

#####启动Camera / 读取手机图库
  
    clouda.device.media.getUserMedia(options);

* options

  * source
  
      	clouda.device.MEDIA_SOURCE.CAMERA // 相机
      	clouda.device.MEDIA_SOURCE_PHOTOALBUM //手机图库
      	
  * onsuccess 
  
  		//成功后的回调
  		function(data){
  			/**
        	data : {
        		source : //同options.source
        		url : //一个指向127.0.0.1的图片URL
        		info : {
        			mime_type : 'image/png',
        			extension : '.jpg',
        			width : 300, // integer in px
        			height : 300 // integer in px
        		}
        	}
        	*/
  		}
   * oncancel       
   
         //用户取消了操作
      	 function(){}

#####手动终止已经启动的相机 / 手机图库
  
    clouda.device.media.terminateCapture(options);

* options - 同getUserMedia被调用时的options
     

***
#### 实现说明
由于无法实现真正的阻塞，用户可能在调起相机/图库后使用任务管理器切回app本身。
因此由JS负责当getUserMedia被调起后，出现遮罩层提示正在拍摄/选取图片，并提供中止按钮。
用户点击中止按钮则调用oncancel，并同时手动调用关闭还在开启中的相机/图库

#### TODO
* 对Video的支持
* 对Audio录音的支持



***

### Geolocation
	clouda.device.geolocation

#### API

***
#####启动对地理位置的监听
  
    clouda.device.geolocation.startMoniterLocation(options);

* options
      	
  * onchange 
  
  		//每一次位置变动的回调
  		function(latitude, longitude){
  			
  		}

#####停止对地理位置的监听
  
    clouda.device.geolocation.stopMoniterLocation();


#####启动对大幅度地理位置变动的监听
  
    clouda.device.geolocation.startMoniterSignificantLocation(options);
    
options同上，相当于省电模式。
调用后立即触发一次回调报告当前位置，后续当发生明显变动时才通知。
明显变动的阈值暂定为20M，不提供可配置项


#####停止对大幅度地理位置变动的监听
  
    clouda.device.geolocation.stopMoniterSignificantLocation();

***
#### 实现说明
Geolocation属于监听类，当地点发生改变时随时触发开发者指定的回调函数，并传入最新的位置


***

### Reachablity
	clouda.device.reachability

#### API

***
#####网络状态标识

    clouda.device.REACHABILITY_STATUS.UNKNOWN // 未知
    clouda.device.REACHABILITY_STATUS.DISCONNECTED // 断开状态
    clouda.device.REACHABILITY_STATUS.WIFI // WIFI连通状态
    clouda.device.REACHABILITY_STATUS.MOBILE_DATA // 移动数据（2G / 3G）连通状态

#####初始化
	clouda.device.reachability.init(url)

* url 

	一个http或https的url，以该url是否可连接判断当前网络连通性。
不保证一定是正确的结果
	（如涉及wifi连接前认证的情况，该url可能被302）

#####获取当前的网络状态
  
    clouda.device.reachability.getActiveNetworkStatus();

* @return 返回当前网络状态标识符，如果未曾初始化则为UNKNOWN

#####启动对网络状态变动的监听
  
    clouda.device.reachability.startMoniterNetworkStatus(options);
    
* options
      	
  * onchange 
  
  		//每一次状态变动的回调
  		function(networkStatus){
  			
  		}



#####停止对网络状态的监听
  
    clouda.device.reachability.stopMoniterNetworkStatus();


***

#### TODO
* 是否要实现对所有连接状态的标志，比如3G+WIFI同时开启，Bluetooth，AirDrop，EDGE等
* 是否要实现对socket的支持

***


### Contacts
	clouda.device.contacts

#### API

***
#####联系人ref
	唯一ID用于标识通讯录中的一个联系人

#####联系人字段

    clouda.device.CONTACTS_COLUMN.LAST_NAME // 姓
    clouda.device.CONTACTS_COLUMN.FIRST_NAME // 名
    clouda.device.CONTACTS_COLUMN.PHONE // 电话（座机，手机等一视同仁）
    clouda.device.CONTACTS_COLUMN.EMAIL // Email

##### 通讯录中的总条目数
	clouda.device.contacts.getCount(function(total){
		//total >= 0
	});
	
#####选择联系人
  弹出系统控件进行联系人选择
  
    clouda.device.contacts.pickContact(options);
    
* options
      	
  * onsuccess
  		
  		//选择结束后返回被选择人的ref
  		function(contactRef){
  			
  		}
  * oncancel       
   
         //用户取消了操作
      	 function(){}

##### 读取某一个联系人的字段信息
	var columns = [clouda.device.CONTACTS_COLUMN.LAST_NAME, clouda.device.CONTACTS_COLUMN.PHONE];
	
	clouda.device.contacts.resolve(ref, columns, function(data){
		//data中包含所有请求的columns的信息，其中phone和email有可能返回数组
	});

#####读取任意一个联系人
  
    clouda.device.contact.getCursor(cursorOffset, function(ref){ //读取指定位移的cursor
		//越界时ref返回null
    }); 
    
    clouda.device.contact.nextCursor(function(ref){ //读取下一个cursor
    	//越界时ref返回null
    });

***
#### 实现说明
* 在读通讯录的请求被执行前，需要由node.js负责给出提示，明示某一个应用要读取用户的通讯录

#### TODO
* 考虑到权限和安全问题，下一阶段再实现联系人的写操作

***



### Push / Notification
	clouda.device.notification

#### API

***

##### 注册Push的状态码
	clouda.device.NOTIFICATION_STATUS.GRANTED //成功获得授权
	clouda.device.NOTIFICATION_STATUS.USER_DENIED //用户拒绝
	clouda.device.NOTIFICATION_STATUS.ILLGAL_API_KEY //非法APP KEY
	clouda.device.NOTIFICATION_STATUS.UNKNOWN_ERROR //未知系统错误
	

##### Push消息的JSON结构体
	
	{
		msg : 'foo bar',
		payload : {} //自定义传输数据
	}	
	
##### 注册接收Push消息，并允许唤起
	clouda.device.notification.registerForRemoteNotification(options);

调用后显示系统提示框，提示用户是否授权。	
	
* options
      	
  * handleURL 
  	
  	声明唤起时使用的URL，要求与当前html文件的domain一致
  
  * onsuccess
  		
  		//注册成功
  		function(token){
  			//获得该设备的Token
  		}
  * onfail       
   
         //注册失败
      	 function(status){
      	 	//status为注册Push的状态码
      	 }	
      	 
      	 
##### 停止接收Push消息
	clouda.device.notification.unregisterForRemoteNotification(options);
	
  无需用户确认，直接进行解绑操作
    
* options
      	
  * onsuccess
  		
  		//解绑成功
  		function(){}
  * onfail
   
         //解绑失败
      	 function(){}

#####被唤起时的事件响应
  
如果被唤起的handleURL中存在该方法，则会被触发。
如果没有也不影响该URL被正常调起。
 
    clouda.device.notification.onReceive(function(json){
    	//json为Push时携带的结构体
    }); 

***
#### 实现说明
* 需要考虑如何禁止开发者死循环要求用户授权接收Push的场景，但允许开发者在用户不授权Push时自己用界面提示无法提供服务。

#### TODO
* 本地scheduled的local notification

***


### Key Value Storage
	clouda.device.localStorage

#### API

***	

> HTML5 webstorage http://dev.w3.org/html5/webstorage/

	interface Storage {
  		readonly attribute unsigned long length;
  		DOMString? key(unsigned long index);
  		getter DOMString? getItem(DOMString key);
  		setter creator void setItem(DOMString key, DOMString value);
  		deleter void removeItem(DOMString key);
  		void clear();
	};


##### 保存一个Key Value配对（实际为异步实现）
	
	clouda.device.localStorage.setItem(key, value)
	
##### 读取一个Key Value配对
	clouda.device.localStorage.getItem(key, function(value){});
	
##### 读取所有Key的数量
	clouda.device.localStorage.getLength(function(length){});
	
##### 按Key的Offset读取Value
	clouda.device.localStorage.getByKey(offset, function(value){});
	
##### 删除所有数据
	clouda.device.localStorage.clean();

***
#### 实现说明
* 需要考虑如何禁止开发者死循环要求用户授权接收Push的场景，但允许开发者在用户不授权Push时自己用界面提示无法提供服务。

#### TODO
* 这套API可以同步化，但可能涉及内存和LocalStorage的自动同步，存在丢失数据的风险

***



### 文件管理 / FS
	clouda.device.fs

并不提供实际FS的读写，只是可以管理与node.js的交互中所产生的文件（如拍照的照片，相册中选择的图片）

#### API

***
##### 文件上传
  
    clouda.device.fs.postFile(file_url, target, options);
  
* file_url 之前获得的127.0.0.1的文件URL地址
* target 要POST到的目标，如http://some.host/foo
* options
      	
  * params POST的同时携带的其他信息
  		
  		{
  		key : value,
  		...
  		}
  * onsuccess
  		
  		 function(data){}
  * onfail
   
      	 function(){}

##### 移除一个文件
  
    clouda.device.fs.remove(file_url);
    
仅能移除属于其appkey下的文件


##### 删除所有文件
  
    clouda.device.fs.empty();
    
仅能移除属于其appkey下的文件


##### 文件数量
  
    clouda.device.fs.getCount(function(total){});
    
##### 获取某一个文件信息
    
    //通过本地url
    clouda.device.fs.getInfo(url, function(info){})
  
    //通过index
    clouda.device.fs.getInfo(index, function(info){
    	/*
    	info : {
    		url : url,
  			mime_type : 'image/png',
  			extension : '.jpg',
  			width : 300, // only for image
  			height : 300 // only for image
  		}
       	*/
    });

***   


### Web Socket
	clouda.device.websocket

#### API

***	

> HTML5 websocket http://dev.w3.org/html5/websockets/

	interface WebSocket : EventTarget {
	  readonly attribute DOMString url;
	
	  // ready state
	  const unsigned short CONNECTING = 0;
	  const unsigned short OPEN = 1;
	  const unsigned short CLOSING = 2;
	  const unsigned short CLOSED = 3;
	  readonly attribute unsigned short readyState;
	  readonly attribute unsigned long bufferedAmount;
	
	  // networking
      attribute EventHandler onopen;
      attribute EventHandler onerror;
      attribute EventHandler onclose;
	  readonly attribute DOMString extensions;
	  readonly attribute DOMString protocol;
	  void close([Clamp] optional unsigned short code, optional DOMString reason);
	
	  // messaging
      attribute EventHandler onmessage;
      attribute BinaryType binaryType;
	  void send(DOMString data);
	  void send(Blob data);
	  void send(ArrayBuffer data);
	  void send(ArrayBufferView data);
	};


##### 新建一个WS通道
	
	var handler = clouda.device.websocket.create('ws://xxx');
@return handler	
	
##### 连接情况的事件
	handler.onopen = function(){};
	handler.onerror = function(){};
	handler.onclose = function(){};
	
##### 接受消息
	handler.onmessage = function(msg){};
	
##### 发送消息
	handler.send(msg);
	
##### 关闭连接
	handler.close();

***




## Clouda-UI
	clouda.ui

> 具备自封装，Smart Tag, Declaritive Binding, CSS Scoped等能力的，符合Web Component规范的UI框架。

具体规范另设独立文档描述
***


## MBAAS 
	clouda.mbaas


### 语音识别 / VTT
	clouda.mbaas.vtt

#### API

***
##### 语音识别的状态码
	clouda.mbaas.VTT_STATUS.NETWORK_FAILURE //网络失败
	clouda.mbaas.VTT_STATUS.FAIL //识别失败
	clouda.mbaas.VTT_STATUS.UNKNOWN_ERROR //未知系统错误
	

##### 启动语音识别 (voice to text)
  
    clouda.mbaas.vtt.startCapture(options);
  
    options : {
      //识别成功后的回调
      onsuccess : function(result){
        
      },
      
      //用户取消了操作
      oncancel : function(){
      },
      
      //识别或上传失败的回调
      onfail : function(status){
        //状态码
      }
    }

##### 手动终止已经启动的语音识别
  
    clouda.mbaas.vtt.terminateCapture(options);

* options - 同startCapture时的options
***
#### 实现说明
* 同样存在模拟阻塞的需求，详细说明见设备能力 - Camera中的实现说明描述

***   


### 二维码生成与识别 / QR Code Scan
	clouda.mbaas.qr

#### API

***
##### 二维码扫描的状态码
	clouda.mbaas.QR_STATUS.NETWORK_FAILURE //网络失败
	clouda.mbaas.QR_STATUS.FAIL //识别失败
	clouda.mbaas.QR_STATUS.UNKNOWN_ERROR //未知系统错误

由于二维码扫描过程中，只有发现二维码才会继续下一步，因此不存在未找到二维码图像的错误码	

##### 启动二维码扫描与识别
  
    clouda.mbaas.qr.startCapture(options);
  
    options : {
      //识别成功后的回调
      onsuccess : function(result){
        
      },
      
      //用户取消了操作
      oncancel : function(){
      },
      
      //识别或上传失败的回调
      onfail : function(status){}
    }

##### 手动终止已经启动的二维码扫描
  
    clouda.mbaas.qr.terminateCapture(options);

* options - 同startCapture时的options


##### 生成二维码
  
    clouda.mbaas.qr.generate(content, width, height, options);
    
  * options
      	
	  * onsuccess
  		
  			//生成成功
  			function(file_url){}
	  * onfail
   
         	//生成失败
      	 	function(){}


    
***
#### 实现说明
* 同样存在模拟阻塞的需求，详细说明见设备能力 - Camera中的实现说明描述

***   


### 二维码识别 / QR Code Scan
	clouda.mbaas.qr

#### API

***
##### 二维码扫描的状态码
	clouda.mbaas.QR_STATUS.NETWORK_FAILURE //网络失败
	clouda.mbaas.QR_STATUS.FAIL //识别失败
	clouda.mbaas.QR_STATUS.UNKNOWN_ERROR //未知系统错误

由于二维码扫描过程中，只有发现二维码才会继续下一步，因此不存在未找到二维码图像的错误码	

##### 启动二维码扫描与识别
  
    clouda.mbaas.qr.startCapture(options);
  
    options : {
      //识别成功后的回调
      onsuccess : function(result){
        
      },
      
      //用户取消了操作
      oncancel : function(){
      },
      
      //识别或上传失败的回调
      onfail : function(status){}
    }

##### 手动终止已经启动的二维码扫描
  
    clouda.mbaas.qr.terminateCapture(options);

* options - 同startCapture时的options
***
#### 实现说明
* 同样存在模拟阻塞的需求，详细说明见设备能力 - Camera中的实现说明描述

***   



### Social Login / 社会化登录
	clouda.mbaas.oauth

#### API

***	

##### 使用社会化登录
  
    clouda.mbaas.oauth.login(options);
  
    options : {
      
      platform : 'baidu', //'sinaweibo','qqweibo','renren','kaixin'
    
      //登录成功后的回调
      onsuccess : function(platform, token){
        
      },
      
      //用户取消操作
      oncancel : function(){
      }
    }

***
#### 实现说明
* 屏蔽所有Server端, REST API, Callback等oAuth逻辑，以异步方式直接提供登录事件

***   


### Social Share / 社会化分享
	clouda.mbaas.share

#### API

***	

此类含UI组件直接接入Clouda-UI中

***   




### Payment / 支付
	clouda.mbaas.payment

#### API

***	

##### 创建一个交易
  
    clouda.mbaas.payment.createTransaction(options);
  
   * options : 
   		
   		{
      
	      order_id : 201308219922,
	      
	      currency : 'CNY',
	      
	      description : '商品描述',
	      
	      amount : 12.70,
	    
	      //支付成功后的回调
	      onsuccess : function(order_id, status){
	        
	      },
	      
	      //用户取消操作
	      oncancel : function(){
	      }
	    }

##### 验证一个支付状态

待定

***
#### TODO
* 如何保证支付结果在仅有客户端的情况下不被篡改

***   



### Cloud KV Storage / 云端KV存储
	clouda.mbaas.kvstorage

#### API

***	

##### 保存一个Key Value配对
	
	clouda.mbaas.kvstorage.setItem(key, value)
	
##### 读取一个Key Value配对
	clouda.mbaas.kvstorage.getItem(key, function(value){});
	
##### 读取所有Key的数量
	clouda.mbaas.kvstorage.getLength(function(length){});
	
##### 按Key的Offset读取Value
	clouda.mbaas.kvstorage.getByKey(offset, function(value){});
	
##### 删除所有数据
	clouda.mbaas.kvstorage.clean();

***
#### TODO

***   


### Cloud File Storage / 云端文件存储
	clouda.mbaas.filestorage

#### API

***	

##### 上传文件
  
    clouda.mbaas.filestorage.upload(file_url, options);
  
* file_url 之前获得的127.0.0.1的文件URL地址
* options
      	
  * onsuccess
  		function(file_token){}
  * onfail
      	 function(){}
      	 
##### 下载文件
  
    clouda.mbaas.filestorage.download(file_url, options);
  
* options
      	
  * onsuccess
  		function(file_url){
  			//file_url是下载后本地的url
  		}
  * onfail
      	 function(){}

##### 移除一个文件
  
    clouda.mbaas.filestorage.delete(file_token);
    
仅能移除属于其appkey下的文件


##### 删除所有文件
  
   clouda.mbaas.filestorage.empty();
    
仅能移除属于其appkey下的文件


##### 文件数量
  
    clouda.mbaas.filestorage.getCount(function(total){});
    
##### 获取某一个文件信息
    
    //通过token
    clouda.mbaas.filestorage.getInfo(token, function(info){})
  
    //通过index
    clouda.mbaas.filestorage.getInfo(index, function(info){
    	/*
    	info : {
    		url : url,
  			mime_type : 'image/png',
  			extension : '.jpg',
  			width : 300, // only for image
  			height : 300 // only for image
  		}
       	*/
    });


***
#### TODO

***   
