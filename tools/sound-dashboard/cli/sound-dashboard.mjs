#!/usr/bin/env node
import { parseArgs } from "node:util";
import { readFile, writeFile, access } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { makeRecord, makeResult, markdown } from "./profile.mjs";

const help = `sound-dashboard — 直接生成耳机声音仪表盘 JPEG、简介及分享链接

sound-dashboard --name "示例耳机" --bands 突出,均衡,均衡,突出,均衡 --steps 3,4,3,4,4 --jpeg card.jpg
sound-dashboard --input dashboard.json --jpeg card.jpg --format json
sound-dashboard --input dashboard.json --format markdown --output intro.md

必填：--name、--bands、--steps（或用 --input FILE，- 表示标准输入）
  bands 顺序：低频 / 中低频 / 中频 / 中高频 / 高频
  档位：突出=0、均衡=1、收敛=2，也可填英文 prominent/balanced/restrained
  steps 顺序：动态 / 瞬态 / 声场 / 分离度 / 解析度；每项 1–5
可选：--signature TEXT --date YYYY-MM-DD --theme mint|blue|purple|pink|amber|cyan
  --jpeg FILE       直接生成 JPEG（无需打开浏览器；省略则默认 sound-dashboard.jpg）
  --no-image        只生成文字和链接，不启动图片渲染器
  --format FORMAT   markdown（默认）/ json / url
  --output FILE     把文字结果写入文件（默认标准输出）
  --base-url URL    链接基址，默认 https://vincejiang.com/sound_dashboard/
  --copy            复制分享链接到剪贴板（macOS）
  --force           允许覆盖已有输出文件
  --install-browser 安装首次 JPEG 渲染所需的 Chromium

JSON 输入：{"name":"示例耳机","bands":[0,1,1,0,1],"steps":[3,4,3,4,4],"theme":"mint"}
也接受网页记录的 values:[0,25,50,75,100]，但不能同时提供 steps。
简介只复述输入档位，不根据耳机型号臆测听感。
`;
try {
  const { values: v } = parseArgs({
    options: Object.fromEntries([
      ...[
        "name",
        "bands",
        "steps",
        "signature",
        "date",
        "theme",
        "input",
        "jpeg",
        "format",
        "output",
        "base-url",
      ].map((k) => [k, { type: "string" }]),
      ...["help", "copy", "force", "no-image", "install-browser"].map((k) => [
        k,
        { type: "boolean" },
      ]),
    ]),
  });
  if (v.help) {
    process.stdout.write(help);
    process.exit(0);
  }
  if (v["install-browser"]) {
    const require = createRequire(import.meta.url);
    const p = spawnSync(
      process.execPath,
      [require.resolve("playwright/cli"), "install", "chromium"],
      { stdio: "inherit" },
    );
    process.exit(p.status ?? 1);
  }
  if (v.jpeg && v["no-image"])
    throw new Error("--jpeg 和 --no-image 不能同时使用");
  const format = v.format ?? "markdown";
  if (!["markdown", "json", "url"].includes(format))
    throw new Error("format 只能是 markdown、json 或 url");
  let input = {};
  if (v.input)
    input = JSON.parse(
      v.input === "-"
        ? await (async () => {
            let data = "";
            for await (const chunk of process.stdin) data += chunk;
            return data;
          })()
        : await readFile(v.input, "utf8"),
    );
  for (const k of ["name", "bands", "steps", "signature", "date", "theme"])
    if (v[k] !== undefined) input[k] = v[k];
  if (v.steps !== undefined) delete input.values;
  const record = makeRecord(input);
  const result = makeResult(record, v["base-url"]);
  const jpeg = v["no-image"] ? null : resolve(v.jpeg ?? "sound-dashboard.jpg");
  if (jpeg && v.output && jpeg === resolve(v.output))
    throw new Error("JPEG 和文字输出不能使用同一个文件");
  for (const file of [jpeg, v.output].filter(Boolean)) {
    if (!v.force) {
      try {
        await access(file);
        throw new Error(`文件已存在：${file}（用 --force 覆盖）`);
      } catch (e) {
        if (e.code !== "ENOENT") throw e;
      }
    }
  }
  if (jpeg) {
    const { renderJPEG } = await import("./render.mjs");
    const rendered = await renderJPEG(record, jpeg, { force: v.force });
    result.jpeg = rendered.path;
    result.jpegBytes = rendered.bytes;
  }
  const text =
    format === "json"
      ? JSON.stringify(result, null, 2) + "\n"
      : format === "url"
        ? result.url + "\n"
        : markdown(result);
  if (v.output) await writeFile(v.output, text, { flag: v.force ? "w" : "wx" });
  else process.stdout.write(text);
  if (v.copy) {
    if (process.platform !== "darwin")
      throw new Error("--copy 当前支持 macOS；链接已输出");
    const p = spawnSync("pbcopy", [], { input: result.url });
    if (p.status !== 0) throw new Error("复制剪贴板失败");
  }
} catch (e) {
  process.stderr.write(`sound-dashboard: ${e.message}\n`);
  process.exitCode = 1;
}
