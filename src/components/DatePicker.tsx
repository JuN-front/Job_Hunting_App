"use client";

import { useState } from "react";

type Props = {
  name: string;
  defaultValue?: string; // YYYY-MM-DD
};

const selectStyle: React.CSSProperties = {
  background: "var(--bg-3)", border: "1px solid var(--border-2)",
  borderRadius: "8px", padding: "9px 10px", fontSize: "13px",
  color: "var(--text)", outline: "none", cursor: "pointer",
};

export default function DatePicker({ name, defaultValue }: Props) {
  const today = new Date();
  const init = defaultValue ? defaultValue.split("-") : ["", "", ""];

  const [year, setYear]   = useState(init[0] ?? "");
  const [month, setMonth] = useState(init[1] ? String(Number(init[1])) : "");
  const [day, setDay]     = useState(init[2] ? String(Number(init[2])) : "");

  // hidden inputに渡す値（年月日が揃っていれば YYYY-MM-DD、そうでなければ空）
  const value = year && month && day
    ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    : "";

  // 選択した年月の最終日を求める
  const maxDay = year && month ? new Date(Number(year), Number(month), 0).getDate() : 31;

  // 年の選択肢：現在年から5年後まで・過去10年分
  const currentYear = today.getFullYear();
  const years = Array.from({ length: 16 }, (_, i) => currentYear - 10 + i);

  // 月が変わって日がはみ出たらリセット
  function handleMonthChange(m: string) {
    setMonth(m);
    if (day && m && year) {
      const max = new Date(Number(year), Number(m), 0).getDate();
      if (Number(day) > max) setDay("");
    }
  }

  function handleYearChange(y: string) {
    setYear(y);
    if (day && month && y) {
      const max = new Date(Number(y), Number(month), 0).getDate();
      if (Number(day) > max) setDay("");
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {/* hidden input: Server Actionに渡る */}
      <input type="hidden" name={name} value={value} />

      {/* 年 */}
      <select value={year} onChange={e => handleYearChange(e.target.value)} style={{ ...selectStyle, width: "90px" }}>
        <option value="">年</option>
        {years.map(y => <option key={y} value={String(y)}>{y}年</option>)}
      </select>

      {/* 月 */}
      <select value={month} onChange={e => handleMonthChange(e.target.value)} style={{ ...selectStyle, width: "72px" }}>
        <option value="">月</option>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
          <option key={m} value={String(m)}>{m}月</option>
        ))}
      </select>

      {/* 日 */}
      <select value={day} onChange={e => setDay(e.target.value)} style={{ ...selectStyle, width: "72px" }}>
        <option value="">日</option>
        {Array.from({ length: maxDay }, (_, i) => i + 1).map(d => (
          <option key={d} value={String(d)}>{d}日</option>
        ))}
      </select>

      {/* クリアボタン */}
      {(year || month || day) && (
        <button
          type="button"
          onClick={() => { setYear(""); setMonth(""); setDay(""); }}
          style={{
            background: "none", border: "none", color: "var(--text-3)",
            cursor: "pointer", fontSize: "16px", lineHeight: 1, padding: "4px",
          }}
          title="クリア"
        >×</button>
      )}
    </div>
  );
}
