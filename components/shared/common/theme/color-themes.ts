export interface ColorTheme {
  name: string;
  value: string;
  preview: string; // tailwind bg class for the swatch
}

export const colorThemes: ColorTheme[] = [
  { name: "Lime", value: "Lime", preview: "bg-lime-400" },
  { name: "Blue", value: "blue", preview: "bg-blue-500" },
];

export const defaultColorTheme = "Lime";
