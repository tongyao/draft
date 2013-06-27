/**
 * ER (Enterprise RIA)
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 杂而乱的工具对象
 * @author otakustay, errorrik
 */
/**
 * 
 * Modified on June 2013
 * To fit in the Baidu mbaas JS SDK framework.
 * @author tongyao@baidu.com
 */


baidu.mbaas.util = {};

(function (namespace_) {
    
        var now = +new Date();

        /**
         * 工具模块，放一些杂七杂八的东西
         */
        var util = {};

        /**
         * 获取一个唯一的ID
         *
         * @return {number} 一个唯一的ID
         */
        util.guid = function () {
            return 'baidu_mbaas_' + now++;
        };

        /**
         * 混合多个对象
         *
         * @param {Object} source 源对象
         * @param {...Object} destinations 用于混合的对象
         * @return 返回混合了`destintions`属性的`source`对象
         */
        util.mix = function (source) {
            for (var i = 1; i < arguments.length; i++) {
                var destination = arguments[i];

                // 就怕有人传**null**之类的进来
                if (!destination) {
                    continue;
                }

                // 这里如果`destination`是字符串的话，会遍历出下标索引来，
                // 认为这是调用者希望的效果，所以不作处理
                for (var key in destination) {
                    if (destination.hasOwnProperty(key)) {
                        source[key] = destination[key];
                    }
                }
            }
            return source;
        };

        /**
         * 空函数
         *
         * @type {function}
         * @const
         */
        util.noop = function () {};


        /**
         * 将一段文本变为JSON对象
         *
         * @param {string} text 文本内容
         * @return {*} 对应的JSON对象
         */
        util.parseJSON = function (text) {
            if (window.JSON && typeof JSON.parse === 'function') {
                return JSON.parse(text);
            }
            else {
                return eval('(' + text + ')');
            }
        };

        var whitespace = /(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g;

        /**
         * 移除字符串前后空格字符
         *
         * @param {string} source 源字符串
         * @return {string} 移除前后空格后的字符串
         */
        util.trim = function (source) {
            return source.replace(whitespace, '');
        };

        /**
         * 对字符中进行HTML编码
         *
         * @param {string} 源字符串
         * @param {string} HTML编码后的字符串
         */
        util.encodeHTML = function (source) {
            source = source + '';
            return source
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        };


        /**
         * 将参数对象转换为URL字符串
         *
         * @param {Object} query 参数对象
         * @return {string} 转换后的URL字符串，相当于search部分
         */
        util.serializeURL = function (query) {
            if (!query) {
                return '';
            }

            var search = '';
            for (var key in query) {
                if (query.hasOwnProperty(key)) {
                    var value = query[key];
                    // 如果`value`是数组，其`toString`会自动转为逗号分隔的字符串
                    search += '&' + encodeURIComponent(key) 
                        + '=' + encodeURIComponent(value);
                }
            }

            return search.slice(1);
        };
        
        namespace_.util = util;
    }
)(baidu.mbaas);
