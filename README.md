# vincejiang-demo

[vincejiang.com](https://vincejiang.com) 的源码 —— 一个放各种产品 demo 的纯静态站。

## 更新网站

把改动 push 到 `main` 即可,全自动构建并部署。**1–2 分钟后线上生效。**

## 加一个 demo

1. 仓库根目录建文件夹 `my-demo/`,放 `index.html`(及其静态资源)。
2. 在根 `index.html` 的列表里加一行链接到 `/my-demo/`。
3. `git push`。

> 完整部署/架构/排障说明见 **[SPEC.md](SPEC.md)**。改部署逻辑请同步更新它。

## Dots 云朵书桌

`https://dots.vincejiang.com`：每日 HN 精读、每周歌单、归档与匿名反馈。公开内容在 `dots/content/index.json`；反馈汇总在同仓库 `dots-feedback` 分支的 `feedback/latest.json`。沿用本仓库 CI/CD，无新凭证。内容发布、Mac 同步和接口约定见 [SPEC §14](SPEC.md#14-dots--mandy-的云朵书桌2026-10-01)。

## Study 课程笔记

[`/study/2026T1/`](https://vincejiang.com/study/2026T1/) 按 CSCI3130、CSCI3150、CSCI3160、CSCI3230 收录课程伴读、作业题解与实验解析。Markdown 在构建时转成 HTML，公式使用本地 KaTeX，原始课件不发布。同步命令、范围和验证见 [SPEC §15](SPEC.md#15-study-课程笔记)。
