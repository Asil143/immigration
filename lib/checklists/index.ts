import { opt } from "./data/opt";
import { stemOpt } from "./data/stem-opt";
import { h1b } from "./data/h1b";
import { h4 } from "./data/h4";
import { greenCard } from "./data/green-card";
import { j1 } from "./data/j1";
import { l1 } from "./data/l1";
import { o1 } from "./data/o1";
import { tn } from "./data/tn";
import type { ChecklistDef } from "./types";

export const allChecklists: ChecklistDef[] = [
  opt, stemOpt, h1b, h4, greenCard, j1, l1, o1, tn,
];

export const checklistMap: Record<string, ChecklistDef> = Object.fromEntries(
  allChecklists.map(c => [c.slug, c])
);

export * from "./types";
