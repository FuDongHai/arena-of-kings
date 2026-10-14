# 人物模型资源核对

当前战斗角色仍是独立重建的简化模型。以下是实际找到并核对过外观的公开上传资源，并非腾讯官方提供的模型下载。

| 角色 | 资源 | 上传者 | 页面标注许可 | 动画 |
| --- | --- | --- | --- | --- |
| 李白 | [Chinese game characters libai](https://sketchfab.com/3d-models/chinese-game-characters-libai-840cedeb4ca242c6826cd84b1d2ad729) | noyou | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | 1 个片段 |
| 貂蝉 | [DiaoChan_Honor of Kings](https://sketchfab.com/3d-models/77cf4b2113114331ace05750ecff3037) | h3896302 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | 无动画 |
| 孙尚香 | [1111_SunShangXiang_LOD1](https://sketchfab.com/3d-models/491ba51b5e37486eb72ef7d76c643907) | uknown | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) | 12 个片段 |

外观已通过资源页面的模型缩略图核对：李白为棕发白衣剑士，貂蝉为粉白莲花服饰，孙尚香为绿色服饰与大型金色火炮。铠、孙悟空尚未找到可获取且匹配原作外观的资源；没有用其他作品的角色冒充。

## 获取限制

三份资源均标为可下载，但 Sketchfab 官方下载接口要求登录；匿名请求返回 `Authentication credentials were not provided.`。没有下载、提取受保护的模型包。公开 Viewer API 在当前导出环境返回 `No Hardware Support for Webgl`，因此也未生成或替换战斗动画图集。

登录资源页面后，可使用 Download 3D Model 下载 GLB、glTF 或原始格式。需要完整模型包，包括贴图及已有骨骼／动画，不需要提供账号密码或令牌。后续接入需保留作者、来源和许可署名；孙尚香资源限非商业用途。

## 接入方式

获取模型包后，将真实网格与贴图用于选将页 3D 预览；战斗继续使用离线导出的八方向角色图集，避免手机在交战时现场烘焙或同时加载多个 3D 场景。有动画的模型使用实际动作片段；没有对应动作的模型需要补充绑定和动画，不把静态摆动冒称为官方动作。
