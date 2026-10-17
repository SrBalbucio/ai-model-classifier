"use client";

import { useState, useTransition } from "react";
import { setRatingAction } from "@/app/actions";
import type { Category } from "@/lib/types";

export function RatingSlider({
  modelId,
  category,
  value,
}: {
  modelId: string;
  category: Category;
  value: number | null;
}) {
  const [score, setScore] = useState<number>(value ?? 5);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={1}
        max={10}
        step={0.5}
        value={score}
        disabled={pending}
        onChange={(e) => {
          const next = Number(e.target.value);
          setScore(next);
          startTransition(() => {
            setRatingAction(modelId, category.id, next);
          });
        }}
        className="h-2 flex-1 cursor-pointer appearance-none rounded-full"
        style={{
          background: `linear-gradient(90deg, ${category.color} ${((score - 1) / 9) * 100}%, var(--color-edge) ${((score - 1) / 9) * 100}%)`,
        }}
        aria-label={`${category.label} score`}
      />
      <span
        className="w-12 text-right text-sm font-semibold tabular-nums"
        style={{ color: category.color }}
      >
        {score.toFixed(1)}
      </span>
    </div>
  );
}
