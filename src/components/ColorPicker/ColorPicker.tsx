import { useEffect, useRef, useState } from "react";
import styles from "./ColorPicker.module.scss";

export interface ColorOption {
  value: string;
  label: string;
  color: string;
}

interface ColorPickerProps {
  onTextColorSelect: (color: string) => void;
  onBackgroundColorSelect: (color: string) => void;
}

const defaultColors: ColorOption[] = [
  { value: "default", label: "Default", color: "var(--text-primary)" },
  { value: "gray", label: "Gray", color: "var(--text-secondary)" },
  { value: "red", label: "Red", color: "#dc3545" },
  { value: "blue", label: "Blue", color: "#0d6efd" },
  { value: "green", label: "Green", color: "#198754" },
  { value: "yellow", label: "Yellow", color: "#ffc107" },
  { value: "purple", label: "Purple", color: "#6f42c1" },
];

const ColorIcon = ({
  textColor,
  backgroundColor,
}: {
  textColor?: string;
  backgroundColor?: string;
}) => (
  <div className={styles.colorIcon} style={{ backgroundColor }}>
    <span style={{ color: textColor }}>A</span>
  </div>
);

const ColorSwatch = ({ color }: { color: string }) => (
  <div className={styles.colorSwatch} style={{ backgroundColor: color }} />
);

export default function ColorPicker({
  onTextColorSelect,
  onBackgroundColorSelect,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTextColor, setCurrentTextColor] = useState<string>("inherit");
  const [currentBgColor, setCurrentBgColor] = useState<string>("transparent");
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={pickerRef} className={styles.colorPicker}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        title="Colors"
      >
        <ColorIcon
          textColor={currentTextColor}
          backgroundColor={currentBgColor}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Text color</div>
            <div className={styles.grid}>
              {defaultColors.map((color) => (
                <button
                  key={`text-${color.value}`}
                  className={styles.colorOption}
                  onClick={() => {
                    onTextColorSelect(color.color);
                    setCurrentTextColor(color.color);
                    setIsOpen(false);
                  }}
                  title={color.label}
                >
                  <ColorIcon textColor={color.color} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Background color</div>
            <div className={styles.grid}>
              {defaultColors.map((color) => (
                <button
                  key={`bg-${color.value}`}
                  className={styles.colorOption}
                  onClick={() => {
                    onBackgroundColorSelect(color.color);
                    setCurrentBgColor(color.color);
                    setIsOpen(false);
                  }}
                  title={color.label}
                >
                  <ColorSwatch color={color.color} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
