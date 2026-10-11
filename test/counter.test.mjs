import assert from "node:assert/strict";
import {
  parseCsv,
  countCoordinates,
  formatClipboard,
  stemFilename,
} from "../counter.js";

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (err) {
    console.error(`not ok - ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

test("empty rows => not enough columns", () => {
  assert.deepEqual(countCoordinates([]), {
    ok: false,
    reason: "not_enough_columns",
  });
});

test("short header => not enough columns", () => {
  assert.deepEqual(countCoordinates([["a", "b"]]), {
    ok: false,
    reason: "not_enough_columns",
  });
});

test("header only => 0", () => {
  assert.deepEqual(countCoordinates([["lat", "lon", "alt"]]), {
    ok: true,
    count: 0,
  });
});

test("counts data rows minus header", () => {
  const rows = [
    ["lat", "lon", "alt"],
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
  ];
  assert.deepEqual(countCoordinates(rows), { ok: true, count: 3 });
});

test("duplicate trailing rows subtract one", () => {
  const rows = [
    ["lat", "lon", "alt"],
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["4", "5", "6"],
  ];
  assert.deepEqual(countCoordinates(rows), { ok: true, count: 2 });
});

test("parseCsv handles quotes", () => {
  const rows = parseCsv('a,b,c\n"1,2",3,4\n');
  assert.deepEqual(rows[0], ["a", "b", "c"]);
  assert.deepEqual(rows[1], ["1,2", "3", "4"]);
});

test("formatClipboard matches desktop shape", () => {
  assert.equal(
    formatClipboard([
      { filename: "alpha", count: 2 },
      { filename: "beta", count: 3 },
    ]),
    "alpha\nbeta\n\n5",
  );
});

test("stemFilename strips extension", () => {
  assert.equal(stemFilename("flight_01.csv"), "flight_01");
});
