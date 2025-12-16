import { useState, useEffect } from "react";
import type { Suspect, EvidenceStatus, MysteryState } from "./types";
import Timeline from "./components/Timeline";
import SuspectManager from "./components/SuspectManager";
import EvidenceTable from "./components/EvidenceTable";
// import SuspectFilter from "./components/SuspectFilter";
import "./App.css";
import { t } from "./i18n";
import type { Language } from "./i18n";

const LANG_STORAGE_KEY = "mystery-language";

function App() {
  const [state, setState] = useState<MysteryState>(() => {
    const saved = localStorage.getItem("mysteryState");
    if (saved) {
      const parsedState: unknown = JSON.parse(saved);
      if (
        parsedState &&
        typeof parsedState === "object" &&
        "suspects" in parsedState &&
        Array.isArray((parsedState as Record<string, unknown>).suspects)
      ) {
        // Migrate old data structure to new one
        return {
          suspects: (
            (parsedState as Record<string, unknown>).suspects as Array<
              Record<string, unknown>
            >
          ).map((suspect) => ({
            ...(suspect as Record<string, unknown>),
            alibiEntries:
              (suspect as Record<string, unknown>).alibiEntries || [],
            clues: (suspect as Record<string, unknown>).clues || [],
          })) as Suspect[],
          timelineStart:
            ((parsedState as Record<string, unknown>)
              .timelineStart as string) || "09:00",
          timelineEnd:
            ((parsedState as Record<string, unknown>).timelineEnd as string) ||
            "18:00",
          deathEstimatedTimeStart: (parsedState as Record<string, unknown>)
            .deathEstimatedTimeStart as string | undefined,
          deathEstimatedTimeEnd: (parsedState as Record<string, unknown>)
            .deathEstimatedTimeEnd as string | undefined,
          selectedSuspectFilter: (parsedState as Record<string, unknown>)
            .selectedSuspectFilter as string | undefined,
        };
      }
    }
    return {
      suspects: [],
      timelineStart: "09:00",
      timelineEnd: "18:00",
      deathEstimatedTimeStart: undefined,
      deathEstimatedTimeEnd: undefined,
      selectedSuspectFilter: undefined,
    };
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language | null;
    return saved === "en" || saved === "ko" ? saved : "ko";
  });

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, language);
  }, [language]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("mysteryState", JSON.stringify(state));
  }, [state]);

  const handleAddSuspect = (suspect: Suspect) => {
    setState({
      ...state,
      suspects: [...state.suspects, suspect],
    });
  };

  const handleDeleteSuspect = (suspectId: string) => {
    setState({
      ...state,
      suspects: state.suspects.filter((s) => s.id !== suspectId),
    });
  };

  const handleUpdateSuspect = (suspect: Suspect) => {
    setState({
      ...state,
      suspects: state.suspects.map((s) => (s.id === suspect.id ? suspect : s)),
    });
  };

  // Evidence adding UI removed; clues should be pre-defined or managed elsewhere

  const handleUpdateClueStatus = (
    suspectId: string,
    clueId: string,
    field: "where" | "how" | "why",
    status: EvidenceStatus
  ) => {
    const suspect = state.suspects.find((s) => s.id === suspectId);
    if (suspect) {
      const updatedClues = suspect.clues.map((clue) => {
        if (clue.id === clueId) {
          const existingStatus = clue.suspectStatuses.find(
            (s) => s.suspectId === suspectId
          );
          if (existingStatus) {
            return {
              ...clue,
              suspectStatuses: clue.suspectStatuses.map((s) =>
                s.suspectId === suspectId ? { ...s, [field]: status } : s
              ),
            };
          } else {
            return {
              ...clue,
              suspectStatuses: [
                ...clue.suspectStatuses,
                {
                  suspectId,
                  where: field === "where" ? status : null,
                  how: field === "how" ? status : null,
                  why: field === "why" ? status : null,
                },
              ],
            };
          }
        }
        return clue;
      });
      const updatedSuspect = {
        ...suspect,
        clues: updatedClues,
      };
      handleUpdateSuspect(updatedSuspect);
    }
  };

  const handleDeleteClue = (suspectId: string, clueId: string) => {
    const suspect = state.suspects.find((s) => s.id === suspectId);
    if (suspect) {
      const updatedSuspect = {
        ...suspect,
        clues: suspect.clues.filter((c) => c.id !== clueId),
      };
      handleUpdateSuspect(updatedSuspect);
    }
  };

  const handleTimelineStartChange = (time: string) => {
    setState({
      ...state,
      timelineStart: time,
    });
  };

  const handleTimelineEndChange = (time: string) => {
    setState({
      ...state,
      timelineEnd: time,
    });
  };

  const handleDeathEstimatedTimeStartChange = (time: string) => {
    setState({
      ...state,
      deathEstimatedTimeStart: time || undefined,
    });
  };

  const handleDeathEstimatedTimeEndChange = (time: string) => {
    setState({
      ...state,
      deathEstimatedTimeEnd: time || undefined,
    });
  };

  const handleFilterChange = (suspectId: string | null) => {
    setState({
      ...state,
      selectedSuspectFilter: suspectId || undefined,
    });
  };

  const getFilteredSuspects = () => {
    if (state.selectedSuspectFilter) {
      return state.suspects.filter((s) => s.id === state.selectedSuspectFilter);
    }
    return state.suspects;
  };

  return (
    <div className="app">
      <header className="app-header" style={{ position: "relative" }}>
        <h1>{t(language, "appTitle")}</h1>
        <p>{t(language, "appSubtitle")}</p>
        <div
          className="lang-switcher"
          style={{
            position: "absolute",
            right: 16,
            top: 16,
            display: "flex",
            gap: 8,
          }}
        >
          <button
            className={language === "ko" ? "active" : ""}
            onClick={() => setLanguage("ko")}
            aria-label="한국어"
            title="한국어"
          >
            KO
          </button>
          <button
            className={language === "en" ? "active" : ""}
            onClick={() => setLanguage("en")}
            aria-label="English"
            title="English"
          >
            EN
          </button>
        </div>
      </header>

      <main className="app-main">
        <Timeline
          startTime={state.timelineStart}
          endTime={state.timelineEnd}
          deathEstimatedTimeStart={state.deathEstimatedTimeStart}
          deathEstimatedTimeEnd={state.deathEstimatedTimeEnd}
          suspects={state.suspects}
          selectedSuspectId={state.selectedSuspectFilter}
          onStartTimeChange={handleTimelineStartChange}
          onEndTimeChange={handleTimelineEndChange}
          onDeathEstimatedTimeStartChange={handleDeathEstimatedTimeStartChange}
          onDeathEstimatedTimeEndChange={handleDeathEstimatedTimeEndChange}
          onFilterChange={handleFilterChange}
          language={language}
        />

        <SuspectManager
          suspects={state.suspects}
          onAddSuspect={handleAddSuspect}
          onDeleteSuspect={handleDeleteSuspect}
          onUpdateSuspect={handleUpdateSuspect}
          language={language}
        />

        {state.suspects.length > 0 && (
          <EvidenceTable
            suspects={getFilteredSuspects()}
            onUpdateClueStatus={handleUpdateClueStatus}
            onDeleteClue={handleDeleteClue}
            language={language}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>
          💡 팁: 각 증거 셀을 클릭하여 O(맞음), △(불확실), X(틀림)을 표시하세요.
        </p>
      </footer>
    </div>
  );
}

export default App;
