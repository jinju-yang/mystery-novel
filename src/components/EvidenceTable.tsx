import type { Suspect, Clue, EvidenceStatus } from "../types";
import "./EvidenceTable.css";
import { t, type Language } from "../i18n";

interface EvidenceTableProps {
  suspects: Suspect[];
  onUpdateClueStatus: (
    suspectId: string,
    clueId: string,
    field: "where" | "how" | "why",
    status: EvidenceStatus
  ) => void;
  onDeleteClue: (suspectId: string, clueId: string) => void;
  language: Language;
}

const EvidenceTable: React.FC<EvidenceTableProps> = ({
  suspects,
  onUpdateClueStatus,
  onDeleteClue,
  language,
}) => {
  // Get unique clues from all suspects
  const allClues = suspects.flatMap((s) => s.clues);
  const uniqueClues: Clue[] = Array.from(
    new Map(allClues.map((clue) => [clue.id, clue])).values()
  );

  const cycleStatus = (current: EvidenceStatus): EvidenceStatus => {
    switch (current) {
      case null:
        return "O";
      case "O":
        return "△";
      case "△":
        return "X";
      case "X":
        return null;
      default:
        return null;
    }
  };

  const getStatusColor = (status: EvidenceStatus): string => {
    switch (status) {
      case "O":
        return "#27ae60";
      case "△":
        return "#f39c12";
      case "X":
        return "#e74c3c";
      default:
        return "#bdc3c7";
    }
  };

  const getStatusForSuspect = (
    suspect: Suspect,
    clueId: string,
    field: "where" | "how" | "why"
  ): EvidenceStatus => {
    const clue = suspect.clues.find((c) => c.id === clueId);
    if (!clue) return null;
    const status = clue.suspectStatuses.find((s) => s.suspectId === suspect.id);
    if (!status) return null;
    return status[field] || null;
  };

  const handleStatusChange = (
    suspectId: string,
    clueId: string,
    field: "where" | "how" | "why"
  ) => {
    const suspect = suspects.find((s) => s.id === suspectId);
    if (suspect) {
      const currentStatus = getStatusForSuspect(suspect, clueId, field);
      onUpdateClueStatus(suspectId, clueId, field, cycleStatus(currentStatus));
    }
  };

  const handleDeleteClue = (clueId: string) => {
    if (suspects.length > 0) {
      suspects.forEach((suspect) => {
        onDeleteClue(suspect.id, clueId);
      });
    }
  };

  return (
    <div className="evidence-table-container">
      <h2>{t(language, "evidenceAnalysis")}</h2>

      {suspects.length === 0 ? (
        <div className="empty-clues">
          <p>
            {language === "ko"
              ? "용의자를 추가하여 분석을 시작하세요"
              : "Add suspects to start analysis."}
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="evidence-table">
            <thead>
              <tr>
                <th className="suspect-col">{t(language, "suspect")}</th>
                {uniqueClues.map((clue) => (
                  <th key={clue.id} className="clue-col" colSpan={3}>
                    <div className="clue-header-cell">
                      <span className="clue-title">{clue.description}</span>
                      <button
                        className="btn-delete-clue-small"
                        onClick={() => handleDeleteClue(clue.id)}
                        title={language === "ko" ? "단서 삭제" : "Delete clue"}
                      >
                        ✕
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
              <tr>
                <th></th>
                {uniqueClues.map((clue) => [
                  <th key={`${clue.id}-where`} className="sub-col">
                    {t(language, "where")}
                  </th>,
                  <th key={`${clue.id}-how`} className="sub-col">
                    {t(language, "how")}
                  </th>,
                  <th key={`${clue.id}-why`} className="sub-col">
                    {t(language, "why")}
                  </th>,
                ])}
              </tr>
            </thead>
            <tbody>
              {suspects.map((suspect) => (
                <tr key={suspect.id} className="suspect-row">
                  <td className="suspect-name">{suspect.name}</td>
                  {uniqueClues.map((clue) => [
                    <td
                      key={`${suspect.id}-${clue.id}-where`}
                      className="status-cell clickable"
                      onClick={() =>
                        handleStatusChange(suspect.id, clue.id, "where")
                      }
                      style={{
                        backgroundColor: `${getStatusColor(
                          getStatusForSuspect(suspect, clue.id, "where")
                        )}20`,
                        borderLeft: `4px solid ${getStatusColor(
                          getStatusForSuspect(suspect, clue.id, "where")
                        )}`,
                      }}
                    >
                      <span className="status-badge">
                        {getStatusForSuspect(suspect, clue.id, "where") || "-"}
                      </span>
                    </td>,
                    <td
                      key={`${suspect.id}-${clue.id}-how`}
                      className="status-cell clickable"
                      onClick={() =>
                        handleStatusChange(suspect.id, clue.id, "how")
                      }
                      style={{
                        backgroundColor: `${getStatusColor(
                          getStatusForSuspect(suspect, clue.id, "how")
                        )}20`,
                        borderLeft: `4px solid ${getStatusColor(
                          getStatusForSuspect(suspect, clue.id, "how")
                        )}`,
                      }}
                    >
                      <span className="status-badge">
                        {getStatusForSuspect(suspect, clue.id, "how") || "-"}
                      </span>
                    </td>,
                    <td
                      key={`${suspect.id}-${clue.id}-why`}
                      className="status-cell clickable"
                      onClick={() =>
                        handleStatusChange(suspect.id, clue.id, "why")
                      }
                      style={{
                        backgroundColor: `${getStatusColor(
                          getStatusForSuspect(suspect, clue.id, "why")
                        )}20`,
                        borderLeft: `4px solid ${getStatusColor(
                          getStatusForSuspect(suspect, clue.id, "why")
                        )}`,
                      }}
                    >
                      <span className="status-badge">
                        {getStatusForSuspect(suspect, clue.id, "why") || "-"}
                      </span>
                    </td>,
                  ])}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EvidenceTable;
