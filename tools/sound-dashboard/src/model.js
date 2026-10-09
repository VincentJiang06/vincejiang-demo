export const themes = [
  { name: "薄荷绿", color: "#72c9ac", rgb: "114, 201, 172" },
  { name: "冰蓝", color: "#77baff", rgb: "119, 186, 255" },
  { name: "薰衣草", color: "#b69afa", rgb: "182, 154, 250" },
  { name: "玫瑰粉", color: "#ee94b5", rgb: "238, 148, 181" },
  { name: "琥珀", color: "#e9b76f", rgb: "233, 183, 111" },
  { name: "青碧", color: "#66d3d7", rgb: "102, 211, 215" },
];
export const bands = ["低频", "中低频", "中频", "中高频", "高频"];
export const levels = ["突出", "均衡", "收敛"];
export const metrics = [
  { name: "动态", en: "DYNAMICS", ends: ["温和", "强劲"], icon: "dynamics" },
  { name: "瞬态", en: "TRANSIENT", ends: ["缓慢", "迅速"], icon: "transient" },
  {
    name: "声场",
    en: "SOUNDSTAGE",
    ends: ["紧凑", "宏大"],
    icon: "soundstage",
  },
  {
    name: "分离度",
    en: "SEPARATION",
    ends: ["融合", "分明"],
    icon: "separation",
  },
  {
    name: "解析度/信息量",
    en: "RESOLUTION",
    ends: ["低", "高"],
    icon: "resolution",
  },
];
export function newRecord() {
  return {
    id: crypto.randomUUID(),
    name: "NM10",
    theme: 0,
    date: new Date().toLocaleDateString("en-CA"),
    signature: "",
    bands: [0, 1, 1, 0, 1],
    values: [50, 75, 50, 75, 75],
  };
}
export function validateRecord(v) {
  if (
    !v ||
    typeof v.name !== "string" ||
    (v.theme !== undefined &&
      (!Number.isInteger(v.theme) ||
        v.theme < 0 ||
        v.theme >= themes.length)) ||
    v.name.length > 80 ||
    typeof v.signature !== "string" ||
    v.signature.length > 80 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(v.date) ||
    !Array.isArray(v.bands) ||
    v.bands.length !== 5 ||
    !v.bands.every((x) => Number.isInteger(x) && x >= 0 && x <= 2) ||
    !Array.isArray(v.values) ||
    v.values.length !== 5 ||
    !v.values.every(
      (x) => Number.isFinite(x) && x >= 0 && x <= 100 && x % 25 === 0,
    )
  )
    throw new Error("评价数据无效");
  return {
    id: typeof v.id === "string" ? v.id : crypto.randomUUID(),
    name: v.name,
    theme: v.theme ?? 0,
    date: v.date,
    signature: v.signature,
    bands: [...v.bands],
    values: [...v.values],
  };
}
export function encodeRecord(record) {
  const { id, ...data } = validateRecord(record);
  return btoa(
    String.fromCharCode(...new TextEncoder().encode(JSON.stringify(data))),
  )
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}
export function decodeRecord(hash) {
  if (hash.length > 5000) throw new Error("分享链接过长");
  const data = hash
    .replace(/^#review=/, "")
    .replaceAll("-", "+")
    .replaceAll("_", "/");
  return validateRecord(
    JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(data), (x) => x.charCodeAt(0)),
      ),
    ),
  );
}
