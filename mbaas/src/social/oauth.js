/*
* baidu social oauth sdk
* @author tongyao@baidu.com
*/

/*
* Usage:
* 
* baidu.mbbas.weibo.onLoginSuccess = function(){
*     //do whatever you want.
* };
* baidu.mbaas.weibo.login();
* 
* 
*/

baidu.mbaas.social = {};

(function(namespace_){
    
    var weibo = {};
    
    weibo.login = function(){
        //call weibo sdk to redirect user
    };
    
    weibo.onLoginSuccess = function(status, data){
        if (status == 'success') {
            //local storage to save token
            //if need any network to work, simply call baidu.mbaas.jsonp or baidu.mbaas.ajax
            
            baidu.mbaas.jsonp.get('http://wwww.baidu.com', {}, function(){
                //done!
            });
        };
    };
    
    weibo.onLoginFail = function(status, data){
        
    };
    
    weibo.getInfo = function(token){
        //call weibo sdk to grab user info(username, mobile..)
        //return Weibo.getUserinfo(token);
    }
    
    weibo.logout = function(){
        
    }
    
    weibo.onLogoutSuccess = function(){
        
    };
    
    namespace_.social.weibo = weibo;
})(baidu.mbaas);