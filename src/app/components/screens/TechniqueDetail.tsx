import React, { useState } from "react";
import { CATEGORIES, TECHNIQUES, setTechniques } from "../../data/taekwondo";
import { useAdmin } from "../../context/AdminContext";
import { saveResource, DEV_ONLY_MSG } from "../../hooks/useAdminSave";
import { CategoryTag } from "../atoms";
import { Trigram } from "../Trigram";
import { DetailHeader } from "./DetailHeader";

const EXTS = ["jpg", "jpeg", "png", "webp", "gif"];

function TechniqueImage({ id, suffix = "", alt, className = "" }: { id: string; suffix?: string; alt: string; className?: string }) {
  const [extIdx, setExtIdx] = useState(0);
  if (extIdx >= EXTS.length) return null;
  return (
    <img
      src={`/images/techniques/${id}${suffix}.${EXTS[extIdx]}`}
      alt={alt}
      className={`w-full rounded-2xl ${className}`}
      style={{ maxHeight: 260, objectFit: "contain", background: "var(--tkd-surface)" }}
      onError={() => setExtIdx((i) => i + 1)}
    />
  );
}

function TechniqueImages({ id, alt, image }: { id: string; alt: string; image?: string }) {
  const [hasSecond, setHasSecond] = useState(true);

  if (image) {
    return (
      <div className="mt-4">
        <img
          src={`/images/${image}`}
          alt={alt}
          className="w-full rounded-2xl"
          style={{ maxHeight: 320, objectFit: "contain", background: "var(--tkd-surface)" }}
        />
      </div>
    );
  }

  return (
    <div className={`mt-4 grid gap-3 ${hasSecond ? "grid-cols-2" : "grid-cols-1"}`}>
      <TechniqueImage id={id} alt={alt} />
      {hasSecond && (
        <img
          src={`/images/techniques/${id}_2.jpg`}
          alt={`${alt} — diagrama`}
          className="w-full rounded-2xl"
          style={{ maxHeight: 260, objectFit: "contain", background: "var(--tkd-surface)" }}
          onError={() => setHasSecond(false)}
        />
      )}
    </div>
  );
}

export function TechniqueDetail({ id, onBack, onEdit }: {
  id: string;
  onBack: () => void;
  onEdit?: () => void;
}) {
  const { isAdmin } = useAdmin();
  const t = TECHNIQUES.find((x) => x.id === id);
  if (!t) return null;

  const cat = CATEGORIES.find((c) => c.id === t.category);

  const handleDelete = async () => {
    if (!window.confirm(`Eliminar "${t.roman}"?`)) return;
    try {
      const updated = TECHNIQUES.filter(x => x.id !== id);
      await saveResource("techniques", updated);
      setTechniques(updated);
      onBack();
    } catch (err: any) {
      alert(err.message?.includes("fetch") ? DEV_ONLY_MSG : (err.message ?? String(err)));
    }
  };

  return (
    <div>
      <DetailHeader onBack={onBack} label="Técnicas" />
      <div className="px-4">
        <div
          className="rounded-2xl px-5 py-6 relative overflow-hidden"
          style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
        >
          <Trigram glyph="☲" size={70} color="var(--tkd-muted)" className="absolute top-4 right-4 opacity-10" />
          <div className="mb-3">{cat && <CategoryTag label={`${cat.label} · ${cat.roman}`} />}</div>
          <p className="font-kr" style={{ fontSize: 40, lineHeight: 1.15, color: "var(--tkd-text)" }}>{t.hangul}</p>
          <p style={{ fontSize: 20, color: "var(--tkd-blue)", fontWeight: 700 }}>{t.roman}</p>
          <p style={{ fontSize: 18, color: "var(--tkd-text)" }} className="mt-1">{t.pt}</p>

          {isAdmin && (
            <div className="flex gap-2 mt-4">
              {onEdit && (
                <button type="button" onClick={onEdit}
                  className="rounded-xl px-4 py-2 font-display transition-opacity active:opacity-70"
                  style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", background: "var(--tkd-blue)", color: "#fff" }}
                >Editar</button>
              )}
              <button type="button" onClick={handleDelete}
                className="rounded-xl px-4 py-2 font-display transition-opacity active:opacity-70"
                style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", color: "var(--tkd-muted)", border: "1px solid var(--tkd-border)" }}
              >Eliminar</button>
            </div>
          )}
        </div>

        {t.note && (
          <div className="mt-4">
            <p className="font-display mb-2" style={{ fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>
              Execução
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: "var(--tkd-text)" }}>{t.note}</p>
          </div>
        )}

        <TechniqueImages id={t.id} alt={t.roman} image={t.image} />
      </div>
    </div>
  );
}
