import { createServer } from "node:http";
import { readFile, stat, open } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { encodeRecord } from "../src/model.js";

// Render only the bundled app over loopback: no external site or user browser is opened.
export async function renderJPEG(record, output, { force = false } = {}) {
  const root = fileURLToPath(new URL("../dist/client/", import.meta.url));
  try {
    await stat(resolve(root, "index.html"));
  } catch {
    throw new Error("缺少仪表盘构建文件，请先在项目目录运行 npm run build");
  }
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".css": "text/css",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".json": "application/json",
  };
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      if (!url.pathname.startsWith("/sound_dashboard/")) {
        res.writeHead(404).end();
        return;
      }
      const relative =
        decodeURIComponent(url.pathname.slice("/sound_dashboard/".length)) ||
        "index.html";
      const file = resolve(root, relative);
      if (!file.startsWith(root.endsWith(sep) ? root : root + sep)) {
        res.writeHead(403).end();
        return;
      }
      const data = await readFile(file);
      res
        .writeHead(200, {
          "Content-Type": types[extname(file)] || "application/octet-stream",
        })
        .end(data);
    } catch {
      res.writeHead(404).end();
    }
  });
  let browser;
  try {
    await new Promise((ok, bad) => {
      server.once("error", bad);
      server.listen(0, "127.0.0.1", ok);
    });
    const { chromium } = await import("playwright");
    try {
      browser = await chromium.launch({ headless: true });
    } catch {
      throw new Error(
        "JPEG 渲染器尚未安装。运行 sound-dashboard --install-browser 后重试",
      );
    }
    const page = await browser.newPage({
      viewport: { width: 1518, height: 2200 },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    const local = `http://127.0.0.1:${server.address().port}`;
    await page.route("**/*", (route) =>
      route
        .request()
        .url()
        .startsWith(local + "/")
        ? route.continue()
        : route.abort(),
    );
    await page.goto(`${local}/sound_dashboard/#review=${encodeRecord(record)}`);
    await page.getByRole("button", { name: "导出 JPEG", exact: true }).click();
    const downloadLink = page.getByRole("link", {
      name: "再次下载 JPEG",
      exact: true,
    });
    await downloadLink.waitFor({ timeout: 45000 });
    const uri = await downloadLink.getAttribute("href");
    if (!uri?.startsWith("data:image/jpeg;base64,"))
      throw new Error("未生成有效 JPEG");
    const bytes = Buffer.from(uri.split(",")[1], "base64");
    const file = await open(output, force ? "w" : "wx");
    try {
      await file.writeFile(bytes);
    } finally {
      await file.close();
    }
    return { path: resolve(output), bytes: bytes.length };
  } finally {
    await browser?.close();
    await new Promise((ok) => server.close(ok));
  }
}
