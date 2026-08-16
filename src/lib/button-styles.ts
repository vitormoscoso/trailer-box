import { cn } from "@/lib/utils";

export function btnClass(variant: "primary" | "secondary", opts?: { icon?: boolean }) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border font-heading text-sm font-medium leading-tight no-underline transition-colors",
    opts?.icon ? "h-9 w-9 p-0" : "px-4 py-2.5",
    variant === "primary" &&
      "border-brand-accent text-brand-accent hover:bg-brand-accent/12 active:bg-brand-accent/22",
    variant === "secondary" &&
      "border-brand-divider text-brand-text bg-brand-text/7 hover:bg-brand-text/14"
  );
}
