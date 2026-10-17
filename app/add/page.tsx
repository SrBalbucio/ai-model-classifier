import { AddModelForm } from "./AddModelForm";

export default function AddPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add a model</h1>
        <p className="mt-1 text-sm text-fog">
          Pick from the OpenRouter catalog or create an entry manually.
        </p>
      </div>
      <AddModelForm />
    </div>
  );
}
