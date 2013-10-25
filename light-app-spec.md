# 轻应用API规范


### API命名空间
    clouda

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


