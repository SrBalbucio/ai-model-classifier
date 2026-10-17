"use server";

import { revalidatePath } from "next/cache";
import { addCatalogModel, addManualModel, deleteModel, setNote, setRating } from "@/lib/models";
import type { CatalogItem } from "@/lib/types";

export async function addCatalogModelAction(item: CatalogItem) {
  const model = addCatalogModel(item);
  revalidatePath("/");
  revalidatePath("/models");
  revalidatePath("/rankings");
  return { id: model.id };
}

export async function addManualModelAction(formData: FormData) {
  const model = addManualModel({
    name: String(formData.get("name") ?? ""),
    provider: String(formData.get("provider") ?? ""),
    description: String(formData.get("description") ?? ""),
  });
  revalidatePath("/");
  revalidatePath("/models");
  revalidatePath("/rankings");
  return { id: model.id };
}

export async function setRatingAction(modelId: string, category: string, score: number) {
  const clamped = Math.min(10, Math.max(1, Math.round(score * 10) / 10));
  setRating(modelId, category, clamped);
  revalidatePath("/");
  revalidatePath("/models");
  revalidatePath("/rankings");
  revalidatePath("/compare");
}

export async function setNoteAction(modelId: string, body: string) {
  setNote(modelId, body);
  revalidatePath("/models");
}

export async function deleteModelAction(modelId: string) {
  deleteModel(modelId);
  revalidatePath("/");
  revalidatePath("/models");
  revalidatePath("/rankings");
  revalidatePath("/compare");
}
