---
title: 管线自测(可删)
description: 验证 md→blog 发布管线的临时文章,验完即删。
tags: [test]
---

这是一篇**临时测试文章**,用来端到端验证 vincejiang.com 的博客发布管线:

- commit 不含「发布」时,它应当**不出现**在线上;
- 之后一次带「发布」的 commit 触碰它,它就应当**上线**;
- 删除后即下线。

如果你在 `https://vincejiang.com/blog/test-post/` 看到这篇,说明发布这一步生效了。验完就会删掉。
