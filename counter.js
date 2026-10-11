/**
 * Coordinate Counter — same rules as Alep 2.1 desktop app.
 * - count = number of data rows (total rows minus header)
 * - first row must have at least 3 columns
 * - if the last two rows are identical, subtract one
 */

export function splitCsvLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += c;
    }
  }
  fields.push(current);
  return fields;
}

export function parseCsv(text) {
  return text
    .split(/\n/)
    .map((line) => line.replace(/\r$/, ""))
    .filter((line) => line.length > 0)
    .map(splitCsvLine);
}

export function countCoordinates(rows) {
  if (!rows.length || rows[0].length < 3) {
    return { ok: false, reason: "not_enough_columns" };
  }

  let count = rows.length - 1;
  if (
    count >= 2 &&
    rowsEqual(rows[rows.length - 1], rows[rows.length - 2])
  ) {
    count -= 1;
  }
  return { ok: true, count };
}

function rowsEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function formatClipboard(results) {
  if (!results.length) return "";
  const names = results.map((r) => r.filename).join("\n");
  const total = results.reduce((sum, r) => sum + r.count, 0);
  return `${names}\n\n${total}`.trim();
}

export function stemFilename(name) {
  const base = name.split(/[/\\]/).pop() || name;
  const dot = base.lastIndexOf(".");
  return dot > 0 ? base.slice(0, dot) : base;
}
