export interface ColorTheme {
  name: string;
  value: string;
  preview: string; // tailwind bg class for the swatch
}

export const colorThemes: ColorTheme[] = [
  { name: "Neutral", value: "neutral", preview: "bg-neutral-500" },
  { name: "Blue", value: "blue", preview: "bg-blue-500" },
];

export const defaultColorTheme = "neutral";
