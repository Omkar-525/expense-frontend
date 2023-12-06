// components/ThemeToggle.js
import { useState, useEffect } from 'react';

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDark(!isDark);
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="px-4 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded"
    >
      Toggle {isDark ? 'Light' : 'Dark'} Mode
    </button>
  );
}

export default ThemeToggle;
