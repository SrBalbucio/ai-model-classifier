"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteModelAction } from "@/app/actions";

export function DeleteButton({ modelId }: { modelId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} className="btn btn-danger">
        Delete
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-bad">Delete this model and all its ratings?</span>
      <button
        disabled={pending}
        onClick={() =>
          startTransition(() => {
            void deleteModelAction(modelId).then(() => router.push("/"));
          })
        }
        className="btn btn-danger"
      >
        {pending ? "Deleting…" : "Yes, delete"}
      </button>
      <button onClick={() => setConfirming(false)} className="btn">
        Cancel
      </button>
    </div>
  );
}
