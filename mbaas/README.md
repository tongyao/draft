MBAAS JS API
============

## Overview

### Design Principle

* 使用统一命名空间，在命名空间下区分不同产品
* 各模块独立工作，支持开发者根据自身需要自行选择custom build
* 所有的网络场景都认为是跨域的
* 考虑到实际用户加载性能，不提供异步loader
* 所有模块需要统一使用框架提供的网络访问接口，用于未来兼容nodejs等其他平台
* 所有子API不应该包含任何对BOM & DOM对象的访问和操作

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

### Social Login

### Channel

### Mobile Stat

### PCS + PSS + BCS + BSS
