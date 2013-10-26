# 轻应用API规范

@liujunzhong @xiaowei @tongyao


> 为兼容系统原生webview，所有API均为异步模型。
> 对于存在阻塞的场景，均采用模拟阻塞的方式，在[Camera / 手机图库]的实现思路部分有详细说明

## version 1.0

	2013.10.27
	@todo defer & promise

## 命名空间
    clouda

## APP信息注册
	clouda.lightapp(apikey)

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


## Clouda-UI
	clouda.ui

> 具备自封装，Smart Tag, Declaritive Binding, CSS Scoped等能力的，符合Web Component规范的UI框架。

具体规范另设独立文档描述
***


### 启动语音识别 (voice to text)
  
    clouda.vtt.startCapture(options);
  
    options : {
      //识别成功后的回调
      onsuccess : function(resultString){
        
      },
      
      //用户取消了操作
      oncancel : function(){
      },
      
      //识别或上传失败的回调
      onfail : function(status){
        //statusCode  0x01:网络失败 0x02:识别失败
      }
    }
  

### 启动照相OCR 
  
    clouda.ocr.startCapture(options);
    
    options : {
      //识别成功后的回调
      onsuccess : function(resultString){
        
      },
      
      //用户取消了操作
      oncancel : function(){
      },
      
      //识别或上传失败的回调
      onfail : function(status){
        //statusCode  0x01:网络失败 0x02:识别失败
      }
    }  


### 启动文本转语音（Text To Speech）
  
    clouda.tts.say(text, options);
    
    options : {
      //语音播放完成的回调
      onfinish : function(){
        
      }
    }  


