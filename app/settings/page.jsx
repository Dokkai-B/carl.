"use client";

import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  const { theme, setTheme, systemTheme } = useTheme();

  // Prefer the explicit theme value; show 'system' when using system.
  const current = theme === "system" ? "system" : theme || "system";

  return (
    <section className="container mx-auto max-w-2xl px-6 py-12 space-y-10">
      <header>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-white/60 mt-2">Personalize appearance and preferences.</p>
      </header>

      <div className="space-y-3">
        <label className="block text-sm uppercase tracking-wider text-white/60">Theme</label>
        <Select value={current} onValueChange={(v) => setTheme(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-white/40">Current: {current === "system" ? `System (${systemTheme || "auto"})` : current}</p>
      </div>

      <div className="pt-6 border-t border-white/10">
        <p className="text-white/50 text-sm">Language and other options coming soon.</p>
      </div>
    </section>
  );
}
