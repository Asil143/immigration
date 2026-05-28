export type ItemType = "doc" | "form" | "fee" | "action" | "online";

export interface ChecklistItem {
  id: string;
  text: string;
  note?: string;
  type?: ItemType;
  link?: { label: string; url: string };
}

export interface Phase {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  colorText: string;
  colorBg: string;
  colorBorder: string;
  items: ChecklistItem[];
  alert?: string;
}

export interface KeyFact {
  label: string;
  value: string;
  sub: string;
  icon: string;
  color: string;
}

export interface ChecklistDef {
  slug: string;
  title: string;
  subtitle: string;
  emoji: string;
  cardColor: string;
  phases: Phase[];
  keyFacts: KeyFact[];
}
