// Study is public. Assignment solutions and their mirrors stay in the local course collection.
import path from 'node:path';

const mirrors = new Set(['T07-P2-双带偶回文', 'T07-P3-二进制串反转']);

export function localAssignment(key) {
  const name = path.posix.basename(key).replace(/\.(?:html|md)$/i, '');
  return /^(?:HW|Ex\d|Exercise|Sp(?:\d|-)|PA\d)/i.test(name)
    || /(?:^|\/)exercise\//i.test(key) || mirrors.has(name);
}

function assignmentSection(title, body) {
  if (/^#{2,6}\s+.*(?:\bHW\s*\d|今年 HW|本学期作业对应方法|从 HW5 找到|本学期作业解析|作业演练（非讲义)/i.test(title)) return true;
  if (/作业\/往年题演练/.test(title)) {
    // Mixed exam/homework appendices identify the actual exercise in the source block.
    return /(?:\bHW\s*\d|作业\/HW|Homework\s*\d|作业与历年)/i.test(title + '\n' + body.slice(0, 800));
  }
  return false;
}

export function publicStudySections(text) {
  const lines = text.split('\n');
  const kept = [];
  const privateAnchors = new Set();
  let fence = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const mark = line.match(/^\s*(`{3,}|~{3,})/);
    if (mark) {
      if (!fence) fence = mark[1]; else if (mark[1].startsWith(fence)) fence = '';
    }
    const heading = !fence && line.match(/^(#{2,6})\s+/);
    if (heading && assignmentSection(line, lines.slice(i + 1, i + 12).join('\n'))) {
      let next = i + 1;
      for (; next < lines.length; next++) {
        const h = lines[next].match(/^(#{1,6})\s+/);
        if (h && h[1].length <= heading[1].length) break;
      }
      for (const match of lines.slice(i, next).join('\n').matchAll(/<a (?:name|id)="([^"]+)"><\/a>/g)) {
        privateAnchors.add(match[1]);
      }
      i = next - 1;
      continue;
    }
    if (/^<a id="hw5-q[1-4]"><\/a>$/.test(line)) continue;
    if (/^\*\*本学期作业（A 级，HW/.test(line)) continue;
    kept.push(line.replace(/\[([^\]\n]*)\]\(([^)\n]+)\)/g, (link, label, target) => {
      let file;
      try { file = decodeURIComponent(target.split('#')[0]); } catch { return link; }
      return /\.(?:md|html)$/i.test(file) && localAssignment(file) ? label + '（本地）' : link;
    }));
  }
  return kept.filter(line => !/^\d+\. \[HW\d/i.test(line))
    .map(line => line.replace(/\[([^\]\n]+)\]\(#([^)]+)\)/g, (link, label, id) =>
      privateAnchors.has(id) ? '作业解析见本地笔记' : link))
    .join('\n');
}
