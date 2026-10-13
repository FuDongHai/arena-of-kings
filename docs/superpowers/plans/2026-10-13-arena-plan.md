# 峡谷之战 Implementation Plan

**Goal:** 完成可玩的浏览器 MOBA 与静态发布包。
**Architecture:** core.js 管理状态、AI、战斗；render.js 绘制世界；app.js 管理 UI、输入与音频。无依赖原生 JavaScript。

- [ ] 核心：先写 Node 行为测试，再实现 Game、tick、cast、buy、damage，运行 npm test。
- [ ] 视图：创建 index.html、style.css、render.js、app.js；Canvas 按窗口适配，英雄与建筑按纵深排序，HUD 显示实际状态。
- [ ] 验证：长时间模拟、语法检查、浏览器开局与技能操作；修复问题。
- [ ] 发布：生成仅包含运行文件的静态包；收到 CDN 入口后上传并检查 HTTP 页面与资源。
