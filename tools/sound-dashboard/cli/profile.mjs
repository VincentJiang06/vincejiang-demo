import {
  bands,
  levels,
  themes,
  metrics,
  validateRecord,
  encodeRecord,
} from "../src/model.js";

export const BASE_URL = "https://vincejiang.com/sound_dashboard/";
export const themeIds = ["mint", "blue", "purple", "pink", "amber", "cyan"];
export function today() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(
    new Date(),
  );
}
function list(value, label) {
  const result = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",").map((v) => v.trim())
      : [];
  if (result.length !== 5 || result.some((v) => v === "" || v === null))
    throw new Error(`${label} 必须明确填写五项，不能用默认档位代替未知信息`);
  return result;
}
export function makeRecord(input) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("输入必须是 JSON 对象");
  const name = input.name;
  if (typeof name !== "string" || !name.trim())
    throw new Error("请填写耳机名称 --name");
  const selectedBands = list(input.bands, "bands").map((v) => {
    if (typeof v === "number" || /^[0-2]$/.test(v)) return Number(v);
    const aliases = {
      prominent: 0,
      balanced: 1,
      restrained: 2,
      突出: 0,
      均衡: 1,
      收敛: 2,
    };
    if (!Object.hasOwn(aliases, v)) throw new Error(`未知频段档位：${v}`);
    return aliases[v];
  });
  if (input.steps !== undefined && input.values !== undefined)
    throw new Error("steps（1–5）与 values（0/25/50/75/100）不能同时提供");
  let values;
  if (input.steps !== undefined)
    values = list(input.steps, "steps").map((v) => {
      if (!/^[1-5]$/.test(String(v)))
        throw new Error("steps 只能是 1、2、3、4、5");
      return (Number(v) - 1) * 25;
    });
  else
    values = list(input.values, "values").map((v) => {
      if (!/^(0|25|50|75|100)$/.test(String(v)))
        throw new Error("values 只能是 0、25、50、75、100");
      return Number(v);
    });
  let theme = input.theme ?? 0;
  if (typeof theme === "string") {
    const i = themeIds.indexOf(theme);
    const named = themes.findIndex((t) => t.name === theme);
    theme =
      i >= 0
        ? i
        : named >= 0
          ? named
          : /^[0-5]$/.test(theme)
            ? Number(theme)
            : -1;
  }
  const date = input.date ?? today();
  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) ||
    new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date
  )
    throw new Error("日期必须是有效的 YYYY-MM-DD");
  return validateRecord({
    name,
    date,
    signature: input.signature ?? "",
    theme,
    bands: selectedBands,
    values,
  });
}
const terms = [
  ["温和", "偏温和", "适中", "偏强劲", "强劲"],
  ["缓慢", "偏缓慢", "适中", "偏迅速", "迅速"],
  ["紧凑", "偏紧凑", "适中", "偏宏大", "宏大"],
  ["融合", "偏融合", "适中", "偏分明", "分明"],
  ["低", "偏低", "中等", "偏高", "高"],
];
const englishBands = ["bass", "low mids", "mids", "upper mids", "treble"];
const englishLevels = ["prominent", "balanced", "restrained"];
const englishTerms = [
  ["gentle", "slightly gentle", "moderate", "slightly forceful", "forceful"],
  ["slow", "slightly slow", "moderate", "slightly fast", "fast"],
  [
    "compact",
    "slightly compact",
    "moderate",
    "slightly expansive",
    "expansive",
  ],
  ["blended", "slightly blended", "moderate", "slightly distinct", "distinct"],
  ["low", "slightly low", "moderate", "slightly high", "high"],
];
export function describe(record) {
  const r = validateRecord(record);
  return {
    zh: `${r.name}：${bands.map((b, i) => b + levels[r.bands[i]]).join("、")}；${metrics.map((m, i) => m.name + terms[i][r.values[i] / 25]).join("，")}。`,
    en: `${r.name}: ${englishBands.map((b, i) => `${b} ${englishLevels[r.bands[i]]}`).join(", ")}; ${metrics.map((m, i) => `${m.en.toLowerCase()} ${englishTerms[i][r.values[i] / 25]}`).join(", ")}.`,
  };
}
export function makeResult(record, base = BASE_URL) {
  const url = new URL(base);
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error("base-url 必须是不含凭据的 HTTP(S) URL");
  url.hash = `review=${encodeRecord(record)}`;
  const { id, ...data } = record;
  return { url: url.href, description: describe(record), record: data };
}
export function markdown(result) {
  const name = result.record.name
    .replace(/[\\\[\]_*`<>#]/g, "\\$&")
    .replace(/[\r\n]+/g, " ");
  return `## ${name}\n\n${result.description.zh}\n\n${result.description.en}\n\n[声音仪表盘](${result.url})\n${result.jpeg ? `\nJPEG: ${result.jpeg}\n` : ""}`;
}
