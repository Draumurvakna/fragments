# 恋人絮语展馆

罗兰·巴特《恋人絮语》的网页展馆。门厅是一条 3D 走廊，九个展厅按一段恋情的顺序排开，80 个 figure 各有一幅画像、一篇导读和边注。

## 展厅

| 厅 | 名称 | 布展 |
|---|---|---|
| I | 相遇与心动 | 标准厅：画架横移 |
| II | 缺席与夜 | 特展厅：暗房，光标停留后画像显影 |
| III | 身体与接触 | 标准厅 |
| IV | 语言的困境 | 特展厅：涂写，释义被划掉、画像一行行手写出来 |
| V | 嫉妒与第三人 | 标准厅 |
| VI | 伤口与阴影 | 标准厅 |
| VII | 深渊 | 特展厅：往下沉，深度计、气泡、景深模糊 |
| VIII | 信与痴 | 标准厅 |
| IX | 出口 | 特展厅：一扇扇门走向光，出口回到博客 |

另有藏品总目（80 张可翻面的卡片，按法文字母序，可按厅筛选）。

## 文件

- `index.html` 入口
- `css/style.css` 样式
- `js/data.js` 目录：展厅、figure 编号、中法文名、释义、参照名画
- `js/guides.js` 展品文字：画像 scene、导读 guide、边注 notes。改文字只改这个文件
- `js/painter.js` 每幅画像的代码画
- `js/app.js` 交互：路由、门厅、各展厅、近看、总目、小地图、转场、安装按钮
- `manifest.webmanifest`、`sw.js`、`icons/` 让网站可以安装成 App 并离线打开

纯静态，没有构建步骤，不依赖任何框架。参照名画直接引用 Wikimedia Commons 原图，加载不到时自动换成代码画。

- `css/fonts.css`、`fonts/` 字体随网站一起托管，不依赖 Google Fonts，国内也能正常显示，离线也能用：
  - 霞鹜文楷 GB 屏幕版（正文、画像、导读）
  - 站酷小薇（标题）
  - IM Fell French Canon（法文）
  - Courier Prime（编号）
  - 龙藏体、志莽行书、Reenie Beanie（第 IV 厅涂写）
  字体按网站用到的字裁剪过，另带约 3700 个常用字的备用文件。以后改文字用到了生僻字，那个字会用系统字体显示，不影响阅读。

## 发布到 GitHub Pages

1. 在 `draumurvakna` 账号下新建公开仓库，名字用 `fragments`（取自原书书名 Fragments d’un discours amoureux）。仓库名就是网址的路径，改名的话网址和博客里的链接要一起改。
2. 把本文件夹里的全部文件放在仓库根目录（`index.html` 在最外层），推到 `main` 分支。
3. 仓库 Settings → Pages → Source 选 `Deploy from a branch`，分支 `main`，目录 `/ (root)`，保存。
4. 一两分钟后访问 `https://draumurvakna.github.io/fragments/`。

所有路径都是相对路径，不用改。

## 安装成 App

网站本身就是一个 PWA，上线后可以直接装到手机或电脑上，有独立图标，全屏打开，看过的内容离线也能看。

- 安卓手机：用 Chrome 或 Edge 打开网址，点页面右上角的“安装 App”，或者浏览器菜单里的“安装应用 / 添加到主屏幕”。手机自带浏览器没有这个选项时，换 Chrome 或 Edge。
- iPhone / iPad：用 Safari 打开，点底部“分享”，选“添加到主屏幕”。页面上的“安装 App”按钮会给出同样的提示。
- 电脑：Chrome 或 Edge 地址栏右侧会出现安装图标，点它即可。

改了内容之后，把 `sw.js` 第一行附近的 `VERSION` 改个数字（例如 `fragments-v2`），已经装好的 App 下次打开就会换成新版本。

## 和博客打通

- 展馆顶栏的“回到博客”和第 IX 厅的出口都指向 `https://draumurvakna.github.io/`（在 `js/data.js` 的 `blog` 字段改）。
- 博客那边可以在 Hexo 主题的 `_config.yml` 菜单里加一项，例如：

```yaml
menu:
  恋人絮语展馆: /fragments/
```

- 也可以写一篇导览文章，链接到展馆或某个展厅，例如 `/fragments/#hall-2`（暗房）、`/fragments/#fig-attente`（直接打开“等待”）。

## 链接格式

- 门厅 `#lobby`，藏品总目 `#index`
- 第 N 厅 `#hall-N`
- 单幅近看 `#fig-<id>`，id 见 `js/data.js`
