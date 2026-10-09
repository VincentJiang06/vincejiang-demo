import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { toJpeg } from "html-to-image";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/600.css";
import {
  themes,
  bands,
  levels,
  metrics,
  newRecord,
  encodeRecord,
  decodeRecord,
} from "./model";

const STEPS = [0, 25, 50, 75, 100];
// Layout switches to the stacked composition at or below this canvas width.
const PORTRAIT_MAX = 560;
// Never shrink below these to fit the height; scroll instead.
const MIN_PORTRAIT_SCALE = 0.84;
const MIN_KNOB_WIDTH = 600;

function Icon({ kind, ...props }) {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {kind === "frequency" &&
        [24, 38, 52, 35, 22, 40].map((h, i) => (
          <path
            key={i}
            strokeWidth="6"
            strokeLinecap="butt"
            d={`M${10 + i * 15} 65v-${h}`}
          />
        ))}
      {kind === "dynamics" && (
        <path d="M4 38h12l7-10 5 13 10-23 8 54 9-65 9 50 11-33 10 25 4-11h10" />
      )}
      {kind === "transient" && <path d="M59 5 26 47h22l-5 28 31-42H55z" />}
      {kind === "soundstage" && (
        <>
          <circle cx="50" cy="43" r="12" fill="currentColor" stroke="none" />
          {[20, 28, 36, 44].map((r) => (
            <g key={r} strokeWidth={r === 20 ? 2.5 : 1.2}>
              <path
                d={`M${50 - r * 0.67} ${43 - r * 0.78}Q${50 - r * 1.5} 43 ${50 - r * 0.67} ${43 + r * 0.78}`}
              />
              <path
                d={`M${50 + r * 0.67} ${43 - r * 0.78}Q${50 + r * 1.5} 43 ${50 + r * 0.67} ${43 + r * 0.78}`}
              />
            </g>
          ))}
        </>
      )}
      {kind === "separation" &&
        [0, 18, 36].map((y) => (
          <path
            key={y}
            d={`M15 ${23 + y} 50 ${5 + y} 85 ${23 + y} 50 ${41 + y}z`}
          />
        ))}
      {kind === "resolution" &&
        [0, 1, 2].map((y) =>
          [0, 1, 2, 3, 4].map((x) => (
            <circle
              key={`${x}-${y}`}
              cx={17 + x * 16}
              cy={20 + y * 19}
              r={3 + x * 0.7}
              fill="currentColor"
              stroke="none"
            />
          )),
        )}
    </svg>
  );
}

// Arc path for one of the five dial positions (angles in SVG degrees).
function arc(angle) {
  const a = ((angle - 21) * Math.PI) / 180,
    b = ((angle + 21) * Math.PI) / 180;
  return `M${90 + 87 * Math.cos(a)} ${90 + 87 * Math.sin(a)} A87 87 0 0 1 ${90 + 87 * Math.cos(b)} ${90 + 87 * Math.sin(b)}`;
}

// Glows are drawn as wide translucent strokes instead of filters, and paint is
// set with presentation attributes: html-to-image drops class-based styles on
// SVG children, which left the gauges blank in the JPEG.
//
// Motion: the final angle always lives in the outer transform attribute (what
// the JPEG clones). An inner group plays a one-off WAAPI sweep from the old
// angle back to zero offset, so nothing mid-transition is ever persisted.
const angleOf = (value) => (value - 50) * 2.4;
const reducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
function Gauge({ value, onChange, label }) {
  const active = value / 25;
  const sweep = useRef(null);
  const previous = useRef(value);
  useLayoutEffect(() => {
    const from = previous.current;
    previous.current = value;
    const el = sweep.current;
    if (from === value || !el?.animate || reducedMotion()) return;
    el.getAnimations().forEach((a) => a.cancel());
    el.animate(
      [
        { transform: `rotate(${angleOf(from) - angleOf(value)}deg)` },
        { transform: "rotate(0deg)" },
      ],
      { duration: 360, easing: "cubic-bezier(0.3, 1.25, 0.5, 1)" },
    );
  }, [value]);
  return (
    <svg
      className="gauge"
      viewBox="0 0 180 175"
      role="group"
      aria-label={`${label}五档旋钮`}
    >
      <g fill="none" strokeLinecap="round">
        <circle cx="90" cy="90" r="70" stroke="#38383c" strokeWidth="3" />
        <circle
          className="gauge-face"
          cx="90"
          cy="90"
          r="57"
          fill="#08080a"
          stroke="#8d8d92"
          strokeWidth="4"
        />
        {[-210, -150, -90, -30, 30].map((angle, i) => (
          <path
            key={i}
            className="dial-glow"
            d={arc(angle)}
            stroke="rgba(var(--accent-rgb), 0.2)"
            strokeWidth="20"
            opacity={i === active ? 1 : 0}
          />
        ))}
        {[-210, -150, -90, -30, 30].map((angle, i) => (
          <g
            key={i}
            className="dial-position"
            role="button"
            tabIndex="0"
            aria-label={`${label}第${i + 1}档`}
            aria-pressed={i === active}
            onClick={() => onChange(i * 25)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChange(i * 25);
              }
            }}
          >
            <path d={arc(angle)} stroke="transparent" strokeWidth="25" />
            <path
              className="dial-arc"
              d={arc(angle)}
              stroke={i === active ? "var(--mint)" : "#2e2e32"}
              strokeWidth="9"
            />
          </g>
        ))}
        <g transform={`rotate(${angleOf(value)} 90 90)`}>
          <g className="needle-sweep" ref={sweep}>
            <path
              d="M90 78V33"
              stroke="rgba(var(--accent-rgb), 0.22)"
              strokeWidth="22"
            />
            <path
              d="M90 78V33"
              stroke="var(--mint)"
              strokeWidth="12"
              strokeLinecap="butt"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

// Approximate rendered width of the model name in em, so long names shrink
// before they are ellipsised. Oswald is condensed; CJK/emoji are full width.
function titleUnits(name) {
  let units = 0;
  for (const ch of name || "XXX") {
    if (/[⺀-￯]/.test(ch)) units += 1;
    else if (ch.codePointAt(0) > 0xffff) units += 1.1;
    else if (ch === " ") units += 0.24;
    else if (/[a-z]/.test(ch)) units += 0.45;
    else units += 0.53;
  }
  return Math.max(1, units).toFixed(2);
}

function displayDate(iso) {
  return iso.replaceAll("-", "/");
}

function initialState() {
  if (location.hash.startsWith("#review=")) {
    try {
      return { record: decodeRecord(location.hash), warning: "" };
    } catch {
      return {
        record: newRecord(),
        warning: "分享链接无效或不完整，已打开新评价。",
      };
    }
  }
  return { record: newRecord(), warning: "" };
}
export function App() {
  const [initial] = useState(initialState);
  const [record, setRecord] = useState(initial.record);
  const [notice, setNotice] = useState(initial.warning);
  const [busy, setBusy] = useState(false);
  const [exported, setExported] = useState(null);
  const [manualLink, setManualLink] = useState("");
  // Only the control the user just changed plays its selection animation,
  // so loading or restoring a link doesn't flash every selected item.
  const [pulse, setPulse] = useState("");
  const main = useRef(null);
  const poster = useRef(null);
  const nameInput = useRef(null);
  const theme = themes[record.theme];
  const themeStyle = { "--mint": theme.color, "--accent-rgb": theme.rgb };

  // Show the name on one line, or two when it wraps; beyond that it scrolls.
  function sizeName() {
    const el = nameInput.current;
    if (!el) return;
    el.rows = 1;
    if (el.scrollHeight > el.clientHeight + 1) el.rows = 2;
  }
  useLayoutEffect(sizeName, [record.name]);

  // Width picks the composition; height first tightens spacing (--d, 0→1),
  // and only then zooms the whole card, never below a readable floor.
  useLayoutEffect(() => {
    const root = main.current;
    let frame;
    let viewportHeight = window.innerHeight;
    let viewportWidth = document.documentElement.clientWidth;
    const set = (name, value) => root.style.setProperty(name, value);
    const fit = () => {
      const card = poster.current;
      const width = document.documentElement.clientWidth;
      // Keep the composition stable while a mobile keyboard is open.
      if (
        !document.activeElement?.matches("input, textarea") ||
        width !== viewportWidth
      ) {
        viewportHeight = window.innerHeight;
      }
      viewportWidth = width;
      const layoutWidth = Math.min(
        1080,
        Math.max(280, width - (width > 760 ? 48 : 16)),
      );
      const target = viewportHeight - 16;
      set("--layout-width", `${layoutWidth}px`);
      set("--fit-scale", "1");
      set("--d", "0");
      sizeName();
      const relaxed = card.offsetHeight;
      let d = 0;
      if (relaxed > target) {
        set("--d", "1");
        const compact = card.offsetHeight;
        d =
          relaxed > compact
            ? Math.min(1, (relaxed - target) / (relaxed - compact))
            : 1;
        set("--d", d.toFixed(3));
        sizeName();
      }
      const natural = card.offsetHeight;
      const minScale =
        layoutWidth <= PORTRAIT_MAX
          ? MIN_PORTRAIT_SCALE
          : Math.min(1, MIN_KNOB_WIDTH / layoutWidth);
      const scale = Math.min(1, Math.max(minScale, target / natural));
      set("--fit-scale", scale.toFixed(4));
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(poster.current);
    observer.observe(root);
    window.addEventListener("resize", schedule);
    document.fonts.ready.then(schedule);
    fit();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  useEffect(() => {
    const url = new URL(location.href);
    url.hash = `review=${encodeRecord(record)}`;
    history.replaceState(null, "", url.href);
  }, [record]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5500);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    const read = () => {
      if (!location.hash.startsWith("#review=")) return;
      try {
        setRecord(decodeRecord(location.hash));
      } catch {
        setNotice("分享链接无效或不完整");
      }
    };
    window.addEventListener("hashchange", read);
    window.addEventListener("popstate", read);
    return () => {
      window.removeEventListener("hashchange", read);
      window.removeEventListener("popstate", read);
    };
  }, []);
  function update(patch) {
    setExported(null);
    setRecord((prev) => ({ ...prev, ...patch }));
  }
  function setBand(col, row) {
    if (record.bands[col] !== row) setPulse(`b${col}-${row}`);
    update({ bands: record.bands.map((v, i) => (i === col ? row : v)) });
  }
  function setValue(index, value) {
    if (record.values[index] !== value) setPulse(`m${index}-${value}`);
    update({ values: record.values.map((v, j) => (j === index ? value : v)) });
  }
  async function share() {
    const url = new URL(location.href);
    url.hash = `review=${encodeRecord(record)}`;
    try {
      await navigator.clipboard.writeText(url.href);
      setNotice("分享链接已复制，包含当前评价快照");
    } catch {
      setManualLink(url.href);
    }
  }
  async function exportJPEG() {
    if (busy) return;
    setBusy(true);
    let host;
    try {
      await document.fonts.ready;
      // Let any running selection animation settle before cloning.
      await Promise.all(
        poster.current
          .getAnimations?.({ subtree: true })
          .map((a) => a.finished.catch(() => {})) ?? [],
      );
      host = document.createElement("div");
      host.className = "export-host";
      const clone = poster.current.cloneNode(true);
      clone.querySelectorAll("input, textarea").forEach((el) => {
        if (el.type === "range") {
          el.remove();
          return;
        }
        const text = document.createElement("span");
        text.className = `${el.className}${el.value ? "" : " is-placeholder"}`;
        text.textContent = el.value || el.placeholder;
        el.replaceWith(text);
      });
      // The clone holds final values in attributes/classes and the export
      // host disables animation, so the JPEG never shows a mid-transition.
      host.appendChild(clone);
      document.body.appendChild(host);
      await Promise.all(
        [...clone.querySelectorAll("img")].map((img) => img.decode()),
      );
      const url = await toJpeg(clone, {
        pixelRatio: 1,
        quality: 0.82,
        backgroundColor: "#000",
        cacheBust: false,
        filter: (node) => !node.classList?.contains("no-export"),
      });
      const a = document.createElement("a");
      a.download = `${(record.name || "声音仪表盘").replace(/[\\/:*?"<>|\n]/g, "-")}-${record.date}.jpg`;
      a.href = url;
      setExported({ url, name: a.download });
      a.click();
      setNotice("JPEG 已导出 · 1518 px 轻量图片");
    } catch (e) {
      console.error(e);
      setNotice("JPEG 导出失败，请重试");
    } finally {
      host?.remove();
      setBusy(false);
    }
  }
  return (
    <div className="workspace" style={themeStyle}>
      <main className="main" ref={main}>
        <div className="canvas">
          <article
            className="poster"
            ref={poster}
            style={{ ...themeStyle, "--title-units": titleUnits(record.name) }}
            aria-label="声音仪表盘"
          >
            <header className="poster-top">
              <div
                className="brand-lockup"
                role="img"
                aria-label="声音仪表盘 SOUND DASHBOARD"
              >
                <div className="brand-cn">
                  {[..."声音仪表盘"].map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
                <div className="brand-en">
                  {[..."SOUND DASHBOARD"].map((c, i) => (
                    <span key={i}>{c.trim()}</span>
                  ))}
                </div>
              </div>
              <span className="model-title" title={record.name}>
                {record.name || "XXX"}
              </span>
            </header>
            <section className="metadata panel" aria-label="评价信息">
              <div className="field name-field">
                <span className="field-label">耳机名称：</span>
                <textarea
                  ref={nameInput}
                  className="name-value"
                  aria-label="耳机名称"
                  maxLength={80}
                  value={record.name}
                  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                  onChange={(e) =>
                    update({ name: e.target.value.replace(/\s*\n\s*/g, " ") })
                  }
                  placeholder="XXX"
                />
                <button
                  className="theme-chip no-export"
                  type="button"
                  aria-label={`切换主题色，当前${theme.name}`}
                  title={`当前${theme.name} · 点击切换下一种颜色`}
                  onClick={() =>
                    update({ theme: (record.theme + 1) % themes.length })
                  }
                />
              </div>
              <div className="meta-row">
                {/* Read-only: new records stamp today; shared links keep theirs. */}
                <div className="field">
                  <span className="field-label">评价日期：</span>
                  <time className="meta-value" dateTime={record.date}>
                    {displayDate(record.date)}
                  </time>
                </div>
                <label className="field">
                  <span className="field-label">签名：</span>
                  <input
                    className="meta-value"
                    aria-label="签名"
                    value={record.signature}
                    maxLength={80}
                    onChange={(e) => update({ signature: e.target.value })}
                    placeholder="XXXX"
                  />
                </label>
              </div>
            </section>
            <div className="dashboard-body panel">
              <div className="frequency-title">
                <Icon kind="frequency" />
                <h1>
                  频段分布 <span>FREQUENCY DISTRIBUTION</span>
                </h1>
              </div>
              <section className="frequency-grid" aria-label="频段分布">
                <div className="level-labels" aria-hidden="true">
                  {levels.map((l) => (
                    <span key={l}>
                      <i />
                      {l}
                    </span>
                  ))}
                </div>
                {bands.map((band, col) => (
                  <div
                    className="band-column"
                    key={band}
                    role="radiogroup"
                    aria-label={band}
                  >
                    {levels.map((l, row) => (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={record.bands[col] === row}
                        tabIndex={record.bands[col] === row ? 0 : -1}
                        aria-label={`${band} ${l}`}
                        title={`${band} · ${l}`}
                        key={l}
                        className={`frequency-dot${record.bands[col] === row ? " selected" : ""}${pulse === `b${col}-${row}` ? " pulse" : ""}`}
                        onClick={() => setBand(col, row)}
                        onKeyDown={(e) => {
                          const step = {
                            ArrowUp: 2,
                            ArrowLeft: 2,
                            ArrowDown: 1,
                            ArrowRight: 1,
                          }[e.key];
                          if (!step) return;
                          e.preventDefault();
                          const next = (record.bands[col] + step) % 3;
                          setBand(col, next);
                          e.currentTarget.parentElement.children[next].focus();
                        }}
                      />
                    ))}
                    <div className="band-name">{band}</div>
                  </div>
                ))}
              </section>
              <section className="metrics" aria-label="听感特性">
                {metrics.map((m, i) => (
                  <div className="metric" key={m.name}>
                    <div className="dial">
                      <Gauge
                        value={record.values[i]}
                        label={m.name}
                        onChange={(value) => setValue(i, value)}
                      />
                      <input
                        className="dial-input"
                        type="range"
                        min="0"
                        max="100"
                        step="25"
                        aria-label={`${m.name}旋钮`}
                        aria-valuetext={`第 ${record.values[i] / 25 + 1} 档，共 5 档`}
                        title={`第 ${record.values[i] / 25 + 1} 档 / 5 档`}
                        value={record.values[i]}
                        onChange={(e) => setValue(i, +e.target.value)}
                      />
                    </div>
                    <div className="metric-ends">
                      <span>{m.ends[0]}</span>
                      <span>{m.ends[1]}</span>
                    </div>
                    <div className="metric-marker" />
                    <div className="metric-caption">
                      <Icon kind={m.icon} />
                      <div>
                        <h2>
                          {m.name.split(/(?<=\/)/).map((part) => (
                            <span className="name-part" key={part}>
                              {part}
                            </span>
                          ))}
                        </h2>
                        <span className="metric-en">{m.en}</span>
                      </div>
                    </div>
                    <div className="mobile-slider">
                      <div
                        className="segments"
                        role="radiogroup"
                        aria-label={`${m.name}五档`}
                      >
                        {STEPS.map((value, k) => (
                          <button
                            type="button"
                            key={value}
                            role="radio"
                            aria-label={`${m.name}第${k + 1}档`}
                            aria-checked={record.values[i] === value}
                            tabIndex={record.values[i] === value ? 0 : -1}
                            title={`第 ${k + 1} 档`}
                            className={`${record.values[i] === value ? "chosen" : ""}${pulse === `m${i}-${value}` ? " pulse" : ""}`}
                            onClick={() => setValue(i, value)}
                            onKeyDown={(e) => {
                              const step = { ArrowLeft: -1, ArrowRight: 1 }[
                                e.key
                              ];
                              if (!step) return;
                              e.preventDefault();
                              const next = Math.min(
                                4,
                                Math.max(0, record.values[i] / 25 + step),
                              );
                              setValue(i, next * 25);
                              e.currentTarget.parentElement.children[
                                next
                              ].focus();
                            }}
                          >
                            <span />
                          </button>
                        ))}
                      </div>
                      <span>{m.ends[0]}</span>
                      <span>{m.ends[1]}</span>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </article>
        </div>
        <footer className="workspace-footer">
          <p className="footer-status">
            <i className="save-dot" />
            全部信息已同步到网址<span className="footer-divider">·</span>
            收藏链接即可返回
            {exported && (
              <a
                className="download-link"
                href={exported.url}
                download={exported.name}
              >
                再次下载 JPEG
              </a>
            )}
          </p>
          <div className="actions">
            <button type="button" onClick={share}>
              复制分享链接 <span aria-hidden="true">↗</span>
            </button>
            <button
              type="button"
              className="primary"
              onClick={exportJPEG}
              disabled={busy}
            >
              {busy ? "正在导出…" : "导出 JPEG"}{" "}
              <span aria-hidden="true">↓</span>
            </button>
          </div>
        </footer>
      </main>
      {notice && (
        <div role="status" className="toast">
          {notice}
        </div>
      )}
      {manualLink && (
        <div className="modal-backdrop">
          <section
            role="dialog"
            aria-modal="true"
            aria-label="复制分享链接"
            className="modal"
          >
            <h2>复制分享链接</h2>
            <p>浏览器未允许自动复制，请手动复制下方链接。</p>
            <textarea
              readOnly
              aria-label="分享链接"
              value={manualLink}
              onFocus={(e) => e.target.select()}
            />
            <button type="button" onClick={() => setManualLink("")}>
              完成
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
