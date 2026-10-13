# 峡谷之战 · Arena of Kings

原创浏览器 MOBA 原型，受移动 MOBA 的经典玩法启发，非《王者荣耀》官方作品。没有使用官方素材。

运行：`npm start`，访问 http://127.0.0.1:4173 。测试：`npm test`。

玩法：5v5 人机战斗、三路兵线、防御塔、水晶、野怪、装备、升级、死亡复活。摧毁敌方水晶获胜。

WASD / 方向键移动，右键指定目的地，鼠标指向技能方向，J / 空格 / 左键普攻，Q 突进、E 范围剑气、R 大招，C 恢复、D 闪现、F 回城、B 商店、Esc 暂停。手机建议横屏，左侧摇杆移动，右侧按钮施法。手机技能方向跟随摇杆方向。

## GitHub Pages

将 index.html、style.css、core.js、render.js、app.js 与 .nojekyll 放在仓库根目录。仓库 Settings → Pages → Deploy from a branch → main / root。没有构建步骤或外部依赖。

这是单机 Canvas 原型，不包括真人联网、官方英雄内容、商业游戏级 3D 模型、账号与匹配系统。
