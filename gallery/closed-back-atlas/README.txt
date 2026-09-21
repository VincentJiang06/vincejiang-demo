封闭式监听耳机坐标（178 款，其中 3 款其实并非全封闭）

（网站版同目录下的 README.txt 即本文件）

打开方式：双击 index.html，用浏览器打开即可，不需要联网（联网时字体更好看）。
分享方式：把整个文件夹打包成 zip 发给别人，对方解压后同样双击 index.html 打开。

目录
  index.html               坐标图、筛选、三张排行榜、多款曲线对比工具（标注人头麦/台架，混合台架时会警告）、每款的频响曲线、摘要与完整评测报告（右上角可切换浅色/深色）
                           链接后加 #型号 id（如 index.html#akg-k371）可直接打开某一款的报告；右上角"指标说明"有全部定义
  reports/*.html           每款耳机的完整评测报告单页版（index.html 里已内嵌全部报告，这里是可单独分享的版本）
  curves/<型号>/*.csv      原始频响曲线（frequency,raw 两列），共 339 条；178 款里有 24 款有本型号自己的 B&K 5128 曲线
  data/headphones.csv      全部指标汇总表（Excel 可直接打开）
  data/headphones.json     同一批型号的完整记录（字段比 CSV 多：每条曲线的元数据、来源、勘误标记等；偏差范围在这里叫 ref_dev_range = [最小, 最大]）
  data/curves_manifest.csv 每条曲线的来源、台架（rig / rig_key）、身份 identity（本型号 exact / 同声学 same-acoustics / 代理 sibling）、类型 kind（常规 / 换垫 / 佩戴位置 / 代理…）、is_5128、所用参考 ref；scoring_grade = 按复核标准够格作为打分依据，agent_used_when_scoring = 研究 agent 当时打分时参考过（两者不是一回事）；identity 还可能是 unverified（没有复核记录）、是否用于打分、与参考曲线的偏差、原始 URL、复核备注

证据等级分布：{"measured": 82, "measured-twin": 6, "proxy-measured": 20, "measured-image": 43, "consensus": 18, "prior-only": 9}
  measured        有本型号的数值频响曲线
  measured-twin   曲线量的是厂方确认声学相同的兄弟 SKU（差别只在附件 / 线材 / 麦克风 / 限幅器）
  proxy-measured  只有兄弟 / 前代 / 有线版等代理型号的曲线
  measured-image  只找到测量图，拿不到数值
  consensus       只有评测共识
  prior-only      只有规格与同系列先验
  （前三档按实际存下来并逐条复核过的曲线判定；measured-image 只看存档里有没有测量图链接，consensus / prior-only 沿用研究记录）

口径
  headphones.csv 里的 rank（以及 headphones.json 里的 list_score / tuning_x）是作者最初那份清单的先验排名和打分，只作为先验保留，页面上的分数和榜单不以它为准。
  打分优先级：B&K 5128 > GRAS 45BC/45CA > GRAS 43AG > HMS II.3 > 其他台架 > 测量图 > 主观共识。
  与参考曲线的偏差（ref_dev_min / ref_dev_max）= 本型号各条常规测量与其台架参考曲线的 RMS 偏差（60 Hz-10 kHz）的最小和最大值；
  ref_dev_n 是曲线条数，ref_dev_rigs 是涉及的台架。同一副耳机换台架可差 1-3 dB 以上，请不要拿它给耳机排名。
  挑错度 / 音质 / 听歌适配为 0-100 主观分，由各研究 agent 按同一套锚点给出，不是实测值。
  好推度由阻抗与灵敏度计算（110 dB SPL 所需电压 0.1-4 V、功率 1-200 mW，按对数映射后取较低分）。
  性价比 = 综合分（音质与听歌均值）减去同价位趋势线预期。
  挑错能力 = 0.55 × 挑错度 + 0.45 × 音质。
  曲线图中各曲线以 500 Hz-2 kHz 均值对齐到 0 dB，仅用于比较形状。
  原始曲线数据版权归各测量者所有，引用时请注明来源（见 curves_manifest.csv）。
