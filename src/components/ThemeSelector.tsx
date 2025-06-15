
import React from "react";
import { Palette } from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

const themeInfo = [
  { name: "Classic", value: "classic", color: "from-blue-400 to-purple-500" },
  { name: "Dark", value: "dark", color: "from-gray-800 to-gray-900" },
  { name: "Soft", value: "soft", color: "from-pink-200 to-blue-200" },
  { name: "Vibrant", value: "vibrant", color: "from-yellow-400 to-pink-500" },
  { name: "Futuristic", value: "futuristic", color: "from-teal-400 to-indigo-600" }
];

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useThemeContext();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="fixed bottom-6 right-4 z-50">
      <Button
        variant="secondary"
        size="icon"
        aria-label="Change Theme"
        onClick={() => setOpen(!open)}
        className="shadow-lg"
      >
        <Palette />
      </Button>
      {open && (
        <div className="absolute bottom-14 right-0 bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-3 min-w-[190px] border border-slate-200 dark:border-slate-700 animate-fade-in">
          <div className="font-semibold text-xs mb-3 text-center text-gray-500 dark:text-gray-300">
            Choose Theme
          </div>
          <div className="flex flex-col gap-2">
            {themeInfo.map(t => (
              <button
                key={t.value}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 bg-gradient-to-r ${t.color} 
                  text-xs font-medium capitalize text-slate-900 dark:text-white transition
                  border-2 ${theme === t.value ? "border-purple-500 ring-2 ring-purple-300" : "border-transparent"}
                  hover:scale-105 hover:shadow`}
                onClick={() => { setTheme(t.value as any); setOpen(false); }}
                aria-current={theme === t.value}
              >
                <span className="block w-2 h-2 rounded-full border border-white bg-white/50 mr-2" />
                {t.name}
                {theme === t.value && <span className="ml-auto text-xs font-bold">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
