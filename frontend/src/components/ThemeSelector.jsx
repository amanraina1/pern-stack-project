import { PanelLeftOpen } from "lucide-react";
import { THEMES } from "../constants/index.js";
import { useThemeStore } from "../store/useThemeStore.js";
function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();
  return (
    <div className="dropdown dropdown-end">
      {/* DROPDOWN TRIGGER */}
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <PanelLeftOpen className="size-5" />
      </button>
      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border border-base-content/10"
      >
        {THEMES.map((themeOption) => (
          <button
            key={themeOption.name}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
              theme === themeOption.name
                ? "bg-primary/10 text-primary"
                : "hover:bg-base-content/5"
            }`}
            onClick={() => setTheme(themeOption.name)}
          >
            <PanelLeftOpen className="size-4" />
            <span className="text-sm font-medium">{themeOption.label}</span>
            {/* THEME PREVIEW COLORS */}
            {themeOption.colors.map((color, index) => (
              <span
                key={index}
                className="size-2 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ThemeSelector;
