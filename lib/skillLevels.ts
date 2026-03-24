/**
 * Skill level config – PLAB-style tiers (스타터/초급/중급 + Amateur → Pro → Elite).
 * Use for match create, match cards, profile, leaderboard, filters.
 */

export const SKILL_LEVEL_VALUES = ["STARTER", "ROOKIE", "AMATEUR", "SEMI_PRO", "PRO", "ELITE"] as const;
export type SkillLevelValue = (typeof SKILL_LEVEL_VALUES)[number];

export interface SkillLevelOption {
  value: SkillLevelValue;
  label: string;
  shortLabel: string;
  /** Main color for chips/badges */
  color: string;
  /** Background for chips (e.g. light tint) */
  bgColor: string;
  order: number;
}

/** PLAB-style: Starter → Beginner → Intermediate → Amateur → Semi-Pro → Pro → Elite */
export const SKILL_LEVELS: SkillLevelOption[] = [
  { value: "STARTER", label: "Starter", shortLabel: "Starter", color: "#eab308", bgColor: "#fef9c3", order: 0 },
  { value: "ROOKIE", label: "Beginner", shortLabel: "Beginner", color: "#16a34a", bgColor: "#dcfce7", order: 1 },
  { value: "AMATEUR", label: "Intermediate", shortLabel: "Intermediate", color: "#2563eb", bgColor: "#dbeafe", order: 2 },
  { value: "SEMI_PRO", label: "Amateur", shortLabel: "Amateur", color: "#ea580c", bgColor: "#ffedd5", order: 3 },
  { value: "PRO", label: "Pro", shortLabel: "Pro", color: "#dc2626", bgColor: "#fee2e2", order: 4 },
  { value: "ELITE", label: "Elite", shortLabel: "Elite", color: "#7c3aed", bgColor: "#ede9fe", order: 5 },
];

const byValue: Record<string, SkillLevelOption> = {};
SKILL_LEVELS.forEach((l) => { byValue[l.value] = l; });

export function getSkillLevelOption(level: string | undefined | null): SkillLevelOption | null {
  if (!level) return null;
  return byValue[level.toUpperCase()] ?? null;
}

export function getSkillLevelLabel(level: string | undefined | null): string {
  const opt = getSkillLevelOption(level);
  return opt ? opt.label : level ?? "—";
}

export function getSkillLevelShortLabel(level: string | undefined | null): string {
  const opt = getSkillLevelOption(level);
  return opt ? opt.shortLabel : level ?? "—";
}

export function getSkillLevelColor(level: string | undefined | null): string {
  const opt = getSkillLevelOption(level);
  return opt ? opt.color : "#6b7280";
}

export function getSkillLevelBgColor(level: string | undefined | null): string {
  const opt = getSkillLevelOption(level);
  return opt ? opt.bgColor : "#f3f4f6";
}
