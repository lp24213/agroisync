import { useState } from "react";

const translations = {
  pt: "Bem-vindo ao AGROTM",
  en: "Welcome to AGROTM",
  zh: "欢迎来到 AGROTM"
};

export default function Home() {
  const [lang, setLang] = useState<"pt" | "en" | "zh">("pt");

  return (
    <div>
      <select value={lang} onChange={(e) => setLang(e.target.value as any)}>
        <option value="pt">🇧🇷 Português</option>
        <option value="en">🇺🇸 English</option>
        <option value="zh">🇨🇳 中文</option>
      </select>
      <h1>{translations[lang]}</h1>
    </div>
  );
}
