import Link from "next/link";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/add", label: "Add Model" },
  { href: "/rankings", label: "Rankings" },
  { href: "/compare", label: "Compare" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-edge bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-sm font-bold text-ink">
            AI
          </span>
          <span className="text-sm font-semibold tracking-tight text-snow">
            Model Classifier
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-1.5 text-sm text-fog transition-colors hover:bg-panel-2 hover:text-snow"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
