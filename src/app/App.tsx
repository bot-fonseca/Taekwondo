import { useState } from "react";
import { BottomNav, type TabId } from "./components/BottomNav";
import { SideNav } from "./components/SideNav";
import { useAdmin } from "./context/AdminContext";
import { HomeScreen } from "./components/screens/HomeScreen";
import { TechniquesScreen } from "./components/screens/TechniquesScreen";
import { TechniqueDetail } from "./components/screens/TechniqueDetail";
import { PoomsaeScreen } from "./components/screens/PoomsaeScreen";
import { PoomsaeDetail } from "./components/screens/PoomsaeDetail";
import { TerminologyScreen } from "./components/screens/TerminologyScreen";
import { HanbeonScreen } from "./components/screens/HanbeonScreen";
import { HanbeonDetail } from "./components/screens/HanbeonDetail";
import { HanbeonEditor } from "./components/screens/HanbeonEditor";
import { HoShinScreen } from "./components/screens/HoShinScreen";
import { HoShinDetail } from "./components/screens/HoShinDetail";
import { HoShinEditor } from "./components/screens/HoShinEditor";
import { SequenciasScreen } from "./components/screens/SequenciasScreen";
import { SequenciaDetail } from "./components/screens/SequenciaDetail";
import { SequenciaEditor } from "./components/screens/SequenciaEditor";
import { TechniqueEditor } from "./components/screens/TechniqueEditor";
import { Lock, LockOpen } from "lucide-react";

type Detail =
  | { type: "technique"; id: string }
  | { type: "poomsae"; id: string }
  | { type: "technique-editor"; editId?: string }
  | null;

type PraticaView =
  | { screen: "hub" }
  | { screen: "hanbeon" }
  | { screen: "hanbeon-detail"; id: string }
  | { screen: "hanbeon-editor"; editId?: string }
  | { screen: "hoshin" }
  | { screen: "hoshin-detail"; id: string }
  | { screen: "hoshin-editor"; editId?: string }
  | { screen: "sequencias" }
  | { screen: "sequencia-detail"; id: string }
  | { screen: "sequencia-editor"; editId?: string };

export default function App() {
  const [tab, setTab] = useState<TabId>("home");
  const [detail, setDetail] = useState<Detail>(null);
  const [pratica, setPratica] = useState<PraticaView>({ screen: "hub" });
  const { isAdmin, unlock, lock } = useAdmin();

  const openTechnique = (id: string) => setDetail({ type: "technique", id });
  const openPoomsae = (id: string) => setDetail({ type: "poomsae", id });
  const back = () => setDetail(null);

  const goTab = (t: TabId) => {
    setDetail(null);
    setPratica({ screen: "hub" });
    setTab(t);
  };

  function renderPratica() {
    switch (pratica.screen) {
      case "hub":
        return (
          <div>
            <div className="px-4 pt-6 pb-4">
              <p className="font-display mb-1" style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--tkd-red)" }}>
                연습
              </p>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--tkd-text)" }}>Prática</h1>
            </div>
            <div className="px-4 flex flex-col gap-3">
              {[
                { label: "한번겨루기", title: "Hanbeon Kyorugi", sub: "Combate de um passo", screen: "hanbeon" as const },
                { label: "호신술",    title: "Ho Shin Sul",       sub: "Auto-defesa",       screen: "hoshin" as const },
                { label: "순서",      title: "Sequências",         sub: "Combinações personalizadas", screen: "sequencias" as const },
              ].map(item => (
                <button
                  key={item.screen}
                  type="button"
                  onClick={() => setPratica({ screen: item.screen })}
                  className="w-full text-left rounded-2xl px-5 py-5 transition-opacity active:opacity-70"
                  style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
                >
                  <p className="font-kr" style={{ fontSize: 22, color: "var(--tkd-muted)", marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontSize: 17, fontWeight: 700, color: "var(--tkd-text)" }}>{item.title}</p>
                  <p style={{ fontSize: 13, color: "var(--tkd-muted)", marginTop: 2 }}>{item.sub}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case "hanbeon":
        return <HanbeonScreen onOpen={id => setPratica({ screen: "hanbeon-detail", id })} onNovo={() => setPratica({ screen: "hanbeon-editor" })} />;
      case "hanbeon-detail":
        return (
          <HanbeonDetail
            id={pratica.id}
            onBack={() => setPratica({ screen: "hanbeon" })}
            onOpenTechnique={openTechnique}
            onEdit={() => setPratica({ screen: "hanbeon-editor", editId: pratica.id })}
          />
        );
      case "hanbeon-editor":
        return (
          <HanbeonEditor
            editId={pratica.editId}
            onSaved={id => setPratica({ screen: "hanbeon-detail", id })}
            onCancel={() => setPratica(pratica.editId ? { screen: "hanbeon-detail", id: pratica.editId } : { screen: "hanbeon" })}
          />
        );
      case "hoshin":
        return <HoShinScreen onOpen={id => setPratica({ screen: "hoshin-detail", id })} onNovo={() => setPratica({ screen: "hoshin-editor" })} />;
      case "hoshin-detail":
        return (
          <HoShinDetail
            id={pratica.id}
            onBack={() => setPratica({ screen: "hoshin" })}
            onOpenTechnique={openTechnique}
            onEdit={() => setPratica({ screen: "hoshin-editor", editId: pratica.id })}
          />
        );
      case "hoshin-editor":
        return (
          <HoShinEditor
            editId={pratica.editId}
            onSaved={id => setPratica({ screen: "hoshin-detail", id })}
            onCancel={() => setPratica(pratica.editId ? { screen: "hoshin-detail", id: pratica.editId } : { screen: "hoshin" })}
          />
        );
      case "sequencias":
        return (
          <SequenciasScreen
            onOpen={id => setPratica({ screen: "sequencia-detail", id })}
            onNova={() => setPratica({ screen: "sequencia-editor" })}
          />
        );
      case "sequencia-detail":
        return (
          <SequenciaDetail
            id={pratica.id}
            onBack={() => setPratica({ screen: "sequencias" })}
            onEdit={() => setPratica({ screen: "sequencia-editor", editId: pratica.id })}
            onOpenTechnique={openTechnique}
          />
        );
      case "sequencia-editor":
        return (
          <SequenciaEditor
            editId={pratica.editId}
            onSaved={id => setPratica({ screen: "sequencia-detail", id })}
            onCancel={() => setPratica(
              pratica.editId
                ? { screen: "sequencia-detail", id: pratica.editId }
                : { screen: "sequencias" }
            )}
          />
        );
    }
  }

  function renderBody() {
    // Técnica aberta a partir de qualquer secção (incluindo Prática)
    if (detail?.type === "technique") return (
      <TechniqueDetail
        id={detail.id}
        onBack={back}
        onEdit={() => setDetail({ type: "technique-editor", editId: detail.id })}
      />
    );
    if (detail?.type === "poomsae") return <PoomsaeDetail id={detail.id} onBack={back} />;
    if (detail?.type === "technique-editor") return (
      <TechniqueEditor
        editId={detail.editId}
        onSaved={id => setDetail({ type: "technique", id })}
        onCancel={() => setDetail(
          detail.editId ? { type: "technique", id: detail.editId } : null
        )}
      />
    );

    switch (tab) {
      case "home":
        return <HomeScreen onOpenTechnique={openTechnique} onOpenPoomsae={openPoomsae} onGoTab={goTab} />;
      case "tecnicas":
        return <TechniquesScreen onOpen={openTechnique} onNova={() => setDetail({ type: "technique-editor" })} />;
      case "poomsae":
        return <PoomsaeScreen onOpen={openPoomsae} />;
      case "pratica":
        return renderPratica();
      case "termos":
        return <TerminologyScreen />;
    }
  }

  return (
    <div className="min-h-screen w-full flex" style={{ background: "var(--tkd-bg)" }}>

      {/* Sidebar — só visível em desktop (md+) */}
      <SideNav active={tab} onChange={goTab} />

      {/* Área de conteúdo */}
      <div className="flex-1 flex justify-center">
        <div
          className="w-full md:max-w-2xl min-h-screen relative"
          style={{ background: "var(--tkd-bg)" }}
        >
          {/* Conteúdo: em mobile deixa espaço para bottom nav, em desktop não */}
          <main className="pb-28 md:pb-8 md:pt-4">{renderBody()}</main>

          {/* Bottom nav — só visível em mobile */}
          <div className="md:hidden">
            <BottomNav active={tab} onChange={goTab} />
          </div>

          {/* Admin toggle — mobile only, canto inferior direito acima da bottom nav */}
          <button
            type="button"
            onClick={isAdmin ? lock : unlock}
            className="md:hidden fixed z-50 flex items-center justify-center rounded-full transition-opacity active:opacity-70"
            style={{
              bottom: "calc(5rem + max(0.5rem, env(safe-area-inset-bottom)))",
              right: "1rem",
              width: 36, height: 36,
              background: isAdmin ? "var(--tkd-red)" : "var(--tkd-surface)",
              border: "1px solid var(--tkd-border)",
              color: isAdmin ? "#fff" : "var(--tkd-muted)",
            }}
            title={isAdmin ? "Desactivar admin" : "Admin"}
          >
            {isAdmin ? <LockOpen size={16} /> : <Lock size={16} />}
          </button>
        </div>
      </div>

    </div>
  );
}
