// two-lines-past-self — make.fun bounty u-suga-two-lines-to-your-past-self-f36c83ca
// Program (program/v1): writes exactly two lines to /output/entry.txt.
// Line 1 warns my past self about one specific moment, in a single sentence.
// Line 2 says in one sentence why that moment mattered and what changed.
// Gate: entry.txt must be UTF-8 text of 1 to 280 characters, not only whitespace.
import { mkdirSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const LINE_1 =
  "Don't trade your grandfather's old film camera for a new phone at the school fair.";
const LINE_2 =
  "The phone died within a year, but the camera held the only photographs of your grandfather, and no shop on earth sells those back.";

const entry = `${LINE_1}\n${LINE_2}\n`;

// The sealed scorer counts every character of entry.txt (1-280, not only
// whitespace), so validate the exact bytes we are about to write.
if (entry.length < 1 || entry.length > 280) {
  throw new Error(`entry is ${entry.length} characters, outside the 1-280 gate`);
}
if (entry.trim().length === 0) {
  throw new Error("entry is only whitespace");
}
const lines = entry.trimEnd().split("\n");
if (lines.length !== 2) {
  throw new Error(`entry must be exactly two lines, got ${lines.length}`);
}
// Each line is one sentence: exactly one sentence-ending mark per line,
// so line 1 is a single warning and line 2 a single reason.
for (const [i, line] of lines.entries()) {
  const stops = (line.match(/[.!?]/g) ?? []).length;
  if (stops !== 1 || !/[.!?]$/.test(line)) {
    throw new Error(`line ${i + 1} must be exactly one sentence`);
  }
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
// Never remove the output directory itself: the grader mounts it root-owned.
// Clear only its contents, then write the single entry file.
mkdirSync(outDir, { recursive: true });
for (const name of readdirSync(outDir)) {
  rmSync(join(outDir, name), { recursive: true, force: true });
}
writeFileSync(join(outDir, "entry.txt"), entry, "utf8");
console.log(`wrote ${entry.length} characters to ${join(outDir, "entry.txt")}`);
