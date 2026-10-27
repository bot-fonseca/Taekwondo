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
import { PoomsaeEditor } from "./components/screens/PoomsaeEditor";
import { BeltScreen } from "./components/screens/BeltScreen";
import { BeltDetail } from "./components/screens/BeltDetail";
import { Lock, LockOpen, Sun, Moon } from "lucide-react";
import { useTheme } from "./context/ThemeContext";
import { useDataVersion } from "./data/store";

type Detail =
  | { type: "technique"; id: string }
  | { type: "poomsae"; id: string }
  | { type: "technique-editor"; editId?: string }
  | { type: "poomsae-editor"; editId?: string }
  | null;

type PraticaView =
  | { screen: "hub" }
  | { screen: "belt-detail"; beltId: string }
  | { screen: "hanbeon" }
  | { screen: "hanbeon-detail"; id: string; returnBelt?: string }
  | { screen: "hanbeon-editor"; editId?: string; prefillBelt?: string; returnBelt?: string }
  | { screen: "hoshin" }
  | { screen: "hoshin-detail"; id: string; returnBelt?: string }
  | { screen: "hoshin-editor"; editId?: string; prefillBelt?: string; returnBelt?: string }
  | { screen: "sequencias" }
  | { screen: "sequencia-detail"; id: string; returnBelt?: string }
  | { screen: "sequencia-editor"; editId?: string; prefillBelt?: string; returnBelt?: string };

// Voltar de um detalhe: para o cinto de onde veio, ou para a lista completa
function backTo(returnBelt: string | undefined, list: PraticaView): PraticaView {
  return returnBelt ? { screen: "belt-detail", beltId: returnBelt } : list;
}

// Sair de um editor: edição → volta ao detalhe; novo a partir de um cinto → volta ao cinto;
// novo a partir da lista → abre o detalhe criado (ou volta à lista se cancelado)
function leaveEditor(
  v: { editId?: string; returnBelt?: string },
  toDetail: (id: string, returnBelt?: string) => PraticaView,
  list: PraticaView,
) {
  return (savedId?: string): PraticaView => {
    if (v.editId) return toDetail(v.editId, v.returnBelt);
    if (v.returnBelt) return { screen: "belt-detail", beltId: v.returnBelt };
    return savedId ? toDetail(savedId) : list;
  };
}

export default function App() {
  const [tab, setTab] = useState<TabId>("home");
  const [detail, setDetail] = useState<Detail>(null);
  const [pratica, setPratica] = useState<PraticaView>({ screen: "hub" });
  const [techFilter, setTechFilter] = useState<import("./data/taekwondo").CategoryId>("seogi");
  const { isAdmin, unlock, lock } = useAdmin();
  const { theme, toggle: toggleTheme } = useTheme();
  useDataVersion(); // re-renderiza quando os dados são guardados/eliminados

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
          <BeltScreen
            onOpenBelt={beltId => setPratica({ screen: "belt-detail", beltId })}
            onAllHanbeon={() => setPratica({ screen: "hanbeon" })}
            onAllHoShin={() => setPratica({ screen: "hoshin" })}
            onAllSeq={() => setPratica({ screen: "sequencias" })}
          />
        );
      case "belt-detail": {
        const returnBelt = pratica.beltId;
        return (
          <BeltDetail
            beltId={pratica.beltId}
            onBack={() => setPratica({ screen: "hub" })}
            onOpenPoomsae={openPoomsae}
            onOpenHanbeon={id => setPratica({ screen: "hanbeon-detail", id, returnBelt })}
            onOpenHoShin={id => setPratica({ screen: "hoshin-detail", id, returnBelt })}
            onOpenSeq={id => setPratica({ screen: "sequencia-detail", id, returnBelt })}
            onNovoHanbeon={() => setPratica({ screen: "hanbeon-editor", prefillBelt: returnBelt, returnBelt })}
            onNovoHoShin={() => setPratica({ screen: "hoshin-editor", prefillBelt: returnBelt, returnBelt })}
            onNovaSeq={() => setPratica({ screen: "sequencia-editor", prefillBelt: returnBelt, returnBelt })}
          />
        );
      }
      case "hanbeon":
        return <HanbeonScreen onOpen={id => setPratica({ screen: "hanbeon-detail", id })} onNovo={() => setPratica({ screen: "hanbeon-editor" })} />;
      case "hanbeon-detail":
        return (
          <HanbeonDetail
            id={pratica.id}
            onBack={() => setPratica(backTo(pratica.returnBelt, { screen: "hanbeon" }))}
            onOpenTechnique={openTechnique}
            onEdit={() => setPratica({ screen: "hanbeon-editor", editId: pratica.id, returnBelt: pratica.returnBelt })}
          />
        );
      case "hanbeon-editor": {
        const exit = leaveEditor(pratica, (id, returnBelt) => ({ screen: "hanbeon-detail", id, returnBelt }), { screen: "hanbeon" });
        return (
          <HanbeonEditor
            editId={pratica.editId}
            prefillBelt={pratica.prefillBelt}
            onSaved={id => setPratica(exit(id))}
            onCancel={() => setPratica(exit())}
          />
        );
      }
      case "hoshin":
        return <HoShinScreen onOpen={id => setPratica({ screen: "hoshin-detail", id })} onNovo={() => setPratica({ screen: "hoshin-editor" })} />;
      case "hoshin-detail":
        return (
          <HoShinDetail
            id={pratica.id}
            onBack={() => setPratica(backTo(pratica.returnBelt, { screen: "hoshin" }))}
            onOpenTechnique={openTechnique}
            onEdit={() => setPratica({ screen: "hoshin-editor", editId: pratica.id, returnBelt: pratica.returnBelt })}
          />
        );
      case "hoshin-editor": {
        const exit = leaveEditor(pratica, (id, returnBelt) => ({ screen: "hoshin-detail", id, returnBelt }), { screen: "hoshin" });
        return (
          <HoShinEditor
            editId={pratica.editId}
            prefillBelt={pratica.prefillBelt}
            onSaved={id => setPratica(exit(id))}
            onCancel={() => setPratica(exit())}
          />
        );
      }
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
            onBack={() => setPratica(backTo(pratica.returnBelt, { screen: "sequencias" }))}
            onEdit={() => setPratica({ screen: "sequencia-editor", editId: pratica.id, returnBelt: pratica.returnBelt })}
            onOpenTechnique={openTechnique}
          />
        );
      case "sequencia-editor": {
        const exit = leaveEditor(pratica, (id, returnBelt) => ({ screen: "sequencia-detail", id, returnBelt }), { screen: "sequencias" });
        return (
          <SequenciaEditor
            editId={pratica.editId}
            prefillBelt={pratica.prefillBelt}
            onSaved={id => setPratica(exit(id))}
            onCancel={() => setPratica(exit())}
          />
        );
      }
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
    if (detail?.type === "poomsae") return (
      <PoomsaeDetail
        id={detail.id}
        onBack={back}
        onEdit={() => setDetail({ type: "poomsae-editor", editId: detail.id })}
      />
    );
    if (detail?.type === "poomsae-editor") return (
      <PoomsaeEditor
        editId={detail.editId}
        onSaved={id => setDetail({ type: "poomsae", id })}
        onCancel={() => setDetail(
          detail.editId ? { type: "poomsae", id: detail.editId } : null
        )}
      />
    );
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
        return <TechniquesScreen onOpen={openTechnique} onNova={() => setDetail({ type: "technique-editor" })} initialFilter={techFilter} onFilterChange={setTechFilter} />;
      case "poomsae":
        return <PoomsaeScreen onOpen={openPoomsae} onNova={() => setDetail({ type: "poomsae-editor" })} />;
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

          {/* Theme toggle — mobile only, junto ao botão de admin */}
          <button
            type="button"
            onClick={toggleTheme}
            className="md:hidden fixed z-50 flex items-center justify-center rounded-full transition-opacity active:opacity-70"
            style={{
              bottom: "calc(5rem + max(0.5rem, env(safe-area-inset-bottom)))",
              right: "3.5rem",
              width: 36, height: 36,
              background: "var(--tkd-surface)",
              border: "1px solid var(--tkd-border)",
              color: "var(--tkd-muted)",
            }}
            title={theme === "dark" ? "Modo claro" : "Modo escuro"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

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
