import { createId } from "@paralleldrive/cuid2";

export function generateCuid(prefix: string): string {
  return `${prefix}_${createId()}`;
}
