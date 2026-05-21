export const statusConfig: Record<string, { color: string; bg: string }> = {
  "説明会":                  { color: "#9399a8", bg: "rgba(147,153,168,0.12)" },
  "IS内定":                  { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },  // ②アンバー
  "IS不合格":                { color: "#94a3b8", bg: "rgba(148,163,184,0.12)" }, // ③スレートグレー
  "ES提出":                  { color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  "一次面接/カジュアル面談": { color: "#22d3ee", bg: "rgba(34,211,238,0.12)" },
  "二次面接":                { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  "三次面接以降":            { color: "#c084fc", bg: "rgba(192,132,252,0.12)" },
  "最終面接":                { color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
  "内定":                    { color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  "入社検討候補":            { color: "#34d399", bg: "rgba(52,211,153,0.2)" },
  "辞退":                    { color: "#fb923c", bg: "rgba(251,146,60,0.12)" },
  "本選考不合格":            { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

export const fallbackCfg = { color: "#9399a8", bg: "rgba(147,153,168,0.12)" };
