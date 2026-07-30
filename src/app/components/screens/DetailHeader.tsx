import { ChevronLeft } from "lucide-react";

export function DetailHeader({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <div className="px-4 pt-6 pb-2">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 rounded-lg py-1 pr-2"
        style={{ color: "var(--tkd-muted)", fontSize: 15 }}
      >
        <ChevronLeft size={20} /> {label}
      </button>
    </div>
  );
}
