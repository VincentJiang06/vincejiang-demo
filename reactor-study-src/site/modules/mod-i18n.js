/* REACTOR · mod-i18n.js — 交互模块的极简 i18n（gettext 式：中文原文即 key）。
   中文页 t() 原样返回（零查表、零分配）；英文页查字典，缺条目自动回落中文。
   语种在模块加载时定死，之后不会变，所以 t 直接绑成两个不同的函数体。 */
import { DICT } from "/modules/mod-dict.js";

const IS_EN = (document.documentElement.lang || "zh").toLowerCase().startsWith("en");

/* t(中文) → 英文页查字典（缺则回落中文），中文页原样返回。纯查表，零运行时开销。 */
export const t = IS_EN ? (zh => DICT[zh] || zh) : (zh => zh);

/* tf(带 {} 占位的中文, ...值) → 把值依次填回占位符。
   给「已观察 {}%」这类内嵌数值的句子用：整句进字典，中英语序各自成立，
   而不是把句子切碎成拼不回去的片段。占位符多于实参时原样留着，不会抛错。 */
export function tf(zh, ...vals) {
  let i = 0;
  return t(zh).replace(/\{\}/g, () => (i < vals.length ? vals[i++] : "{}"));
}
