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


## API List

### Social Login

### Channel

### Mobile Stat

### PCS + PSS + BCS + BSS
