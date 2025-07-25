import { useEffect, useState } from 'react';
export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  return <button onClick={() => setDark(!dark)}>{dark ? '🌙 Dark' : '☀️ Light'}</button>;
}
