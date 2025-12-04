import { Policies } from "@/lib/policies";

export default function TermsPage() {
  const p = Policies.get("terms");
  const lines = p.content.split("\n");
  return (
    <main className="container px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{p.title}</h1>
        <div className="rounded-xl border bg-card p-6">
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            {lines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
