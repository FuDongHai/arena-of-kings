# 峡谷之战 · Arena of Kings

非官方浏览器 MOBA 玩法演示。包含李白、铠、貂蝉、孙尚香、孙悟空的英雄选择页、原画与 3D 旋转预览。

战场形象采用 Three.js 独立重建，具有专属服饰与武器、八方向与行走／攻击姿态；不是官方游戏模型。动作帧已预先导出，战斗不要求 WebGL，3D 预览支持时按需创建角色。五位英雄拥有独立战斗属性与简化技能。

运行：`npm start`，访问 http://127.0.0.1:4173 。测试：`npm test`。

玩法：5v5 人机战斗、三路兵线、防御塔、水晶、野怪、装备、升级、死亡复活。摧毁敌方水晶获胜。

WASD / 方向键移动，右键指定目的地，鼠标指向技能方向，J / 空格 / 左键普攻，Q 突进、E 范围剑气、R 大招，C 恢复、Shift 闪现、F 回城、B 商店、Esc 暂停。手机建议横屏，左侧摇杆移动，右侧按钮施法。手机技能方向跟随摇杆方向。

## GitHub Pages

将整个项目上传仓库，保留 assets/、vendor/ 与根目录所有 HTML、CSS、JS 文件。仓库 Settings → Pages → Deploy from a branch → main / root。没有构建步骤；运行时资源均本地托管。

这是单机 Canvas 原型，不包括真人联网、商业游戏级角色模型、账号与匹配系统。

## 素材来源

角色原画与头像来自腾讯《王者荣耀》公开英雄展示页面：https://pvp.qq.com/web201605/herolist.shtml ，图片资源位于 https://game.gtimg.cn/images/yxzj/img201606/ 。相关角色与图片权益归腾讯及相应权利人所有，不授予再使用许可。此项目不是官方产品。

Three.js r160：MIT，许可见 vendor/THREE-LICENSE.txt。

## 浏览器检查

安装 Playwright 后，启动 npm start，再运行 node tests/hero-browser-check.cjs。可通过 CHROME_PATH 指定已安装 Chrome，通过 GAME_URL 指定公网版本。测试覆盖五位选将、筛选、3D、HUD、技能、重新选将与手机布局。
