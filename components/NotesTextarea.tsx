"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { setNoteAction } from "@/app/actions";

export function NotesTextarea({ modelId, initial }: { modelId: string; initial: string | null }) {
  const [value, setValue] = useState(initial ?? "");
  const [saved, setSaved] = useState<"idle" | "saving" | "saved">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function scheduleSave(next: string) {
    setValue(next);
    setSaved("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await setNoteAction(modelId, next);
      setSaved("saved");
    }, 600);
  }

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => scheduleSave(e.target.value)}
        rows={5}
        className="input resize-y"
        placeholder="Your private notes — what you liked, where it struggled, when you'd pick it…"
      />
      <div className="h-4 text-xs text-fog">
        {saved === "saving" && "Saving…"}
        {saved === "saved" && "Saved ✓"}
      </div>
    </div>
  );
}

export function usePendingTransition() {
  return useTransition();
}
