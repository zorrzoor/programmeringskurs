// The access codes of this device's names (public instance), so the learner does not have to type the code every time.
// Only in the browser's localStorage; if it is blocked the code is asked for each time.
const KEY = "kurs.koder";

const read = (): Record<string, string> => {
  try {
    const value: unknown = JSON.parse(globalThis.localStorage?.getItem(KEY) ?? "{}");
    return value !== null && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, string>) : {};
  } catch {
    return {};
  }
};
const write = (koder: Record<string, string>): void => {
  try {
    globalThis.localStorage?.setItem(KEY, JSON.stringify(koder));
  } catch {
    // not remembered
  }
};
const key = (namn: string): string => namn.toLocaleLowerCase("sv");

export const hamtaKod = (namn: string): string | null => read()[key(namn)] ?? null;
export const sparaKod = (namn: string, kod: string): void => write({ ...read(), [key(namn)]: kod });
export function glomKod(namn: string): void {
  const koder = read();
  delete koder[key(namn)];
  write(koder);
}
