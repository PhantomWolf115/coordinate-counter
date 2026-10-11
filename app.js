import {
  parseCsv,
  countCoordinates,
  formatClipboard,
  stemFilename,
} from "./counter.js";

const fileInput = document.getElementById("file-input");
const copyBtn = document.getElementById("copy-btn");
const resultsBody = document.getElementById("results-body");
const toast = document.getElementById("toast");

/** @type {{ filename: string, count: number }[]} */
let results = [];

fileInput.addEventListener("change", async () => {
  const files = Array.from(fileInput.files || []).filter((f) =>
    f.name.toLowerCase().endsWith(".csv"),
  );

  if (!files.length) {
    showToast("Please select one or more .csv files.", "err");
    return;
  }

  const next = [];
  for (const file of files) {
    try {
      const text = await file.text();
      const rows = parseCsv(text);
      const outcome = countCoordinates(rows);
      if (!outcome.ok) {
        showToast(`File ${file.name} does not have enough columns`, "err");
        continue;
      }
      next.push({ filename: stemFilename(file.name), count: outcome.count });
    } catch (err) {
      showToast(`Error processing ${file.name}: ${err.message || err}`, "err");
    }
  }

  results = next;
  renderResults();
  fileInput.value = "";
});

copyBtn.addEventListener("click", async () => {
  if (!results.length) return;
  const text = formatClipboard(results);
  try {
    await navigator.clipboard.writeText(text);
    showToast("Results copied to clipboard!", "ok");
  } catch {
    // Fallback for older WebViews / insecure contexts
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    showToast(
      ok ? "Results copied to clipboard!" : "Could not copy to clipboard.",
      ok ? "ok" : "err",
    );
  }
});

function renderResults() {
  resultsBody.replaceChildren();
  copyBtn.disabled = results.length === 0;

  if (!results.length) {
    const row = document.createElement("tr");
    row.className = "empty";
    row.innerHTML = `<td colspan="2">No files selected yet.</td>`;
    resultsBody.appendChild(row);
    return;
  }

  let total = 0;
  for (const item of results) {
    total += item.count;
    resultsBody.appendChild(makeRow(item.filename, String(item.count)));
  }

  const spacer = document.createElement("tr");
  spacer.className = "spacer";
  spacer.innerHTML = `<td colspan="2"></td>`;
  resultsBody.appendChild(spacer);
  resultsBody.appendChild(makeRow("Total", String(total), true));
}

function makeRow(name, count, isTotal = false) {
  const row = document.createElement("tr");
  if (isTotal) row.className = "total";
  const nameCell = document.createElement("td");
  nameCell.textContent = name;
  const countCell = document.createElement("td");
  countCell.className = "num";
  countCell.textContent = count;
  row.append(nameCell, countCell);
  return row;
}

let toastTimer;
function showToast(message, kind) {
  toast.hidden = false;
  toast.textContent = message;
  toast.className = `toast ${kind || ""}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 3200);
}
