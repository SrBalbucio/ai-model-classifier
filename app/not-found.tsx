import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-5xl font-bold text-fog">404</p>
      <p className="text-fog">That page doesn&apos;t exist.</p>
      <Link href="/" className="btn btn-primary">
        Back to dashboard
      </Link>
    </div>
  );
}
