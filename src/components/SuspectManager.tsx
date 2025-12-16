import { useState } from "react";
import type { Suspect, AlibiEntry } from "../types";
import "./SuspectManager.css";
import { t, type Language } from "../i18n";

interface SuspectManagerProps {
  suspects: Suspect[];
  onAddSuspect: (suspect: Suspect) => void;
  onDeleteSuspect: (suspectId: string) => void;
  onUpdateSuspect: (suspect: Suspect) => void;
  language: Language;
}

const SuspectManager: React.FC<SuspectManagerProps> = ({
  suspects,
  onAddSuspect,
  onDeleteSuspect,
  onUpdateSuspect,
  language,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [expandedSuspect, setExpandedSuspect] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    characteristics: "",
    motive: "",
  });
  const [newAlibiEntry, setNewAlibiEntry] = useState<{
    [key: string]: {
      startTime: string;
      endTime: string;
      location: string;
      activity: string;
    };
  }>({});

  // Inline edit state for existing alibis (keyed by alibi id)
  const [editingAlibi, setEditingAlibi] = useState<{
    [alibiId: string]: {
      startTime: string;
      endTime: string;
      location: string;
      activity: string;
    };
  }>({});

  // Helper for displaying alibi time range
  const getAlibiEntryDisplay = (entry: AlibiEntry) => {
    return `${entry.startTime} ~ ${entry.endTime}`;
  };

  const handleAddSuspect = () => {
    if (formData.name.trim()) {
      const newSuspect: Suspect = {
        id: Date.now().toString(),
        name: formData.name,
        characteristics: formData.characteristics,
        motive: formData.motive,
        alibiEntries: [],
        clues: [],
      };
      onAddSuspect(newSuspect);
      setFormData({ name: "", characteristics: "", motive: "" });
      setShowForm(false);
    }
  };

  const handleExpandSuspect = (suspectId: string) => {
    setExpandedSuspect(expandedSuspect === suspectId ? null : suspectId);
  };

  const handleUpdateSuspect = (updatedData: {
    characteristics: string;
    motive: string;
  }) => {
    const suspectToUpdate = suspects.find((s) => s.id === expandedSuspect);
    if (suspectToUpdate) {
      onUpdateSuspect({
        ...suspectToUpdate,
        ...updatedData,
      });
    }
  };

  const handleAddAlibiEntry = (suspectId: string) => {
    const entry = newAlibiEntry[suspectId];
    if (
      entry &&
      entry.startTime &&
      entry.endTime &&
      entry.location.trim() &&
      entry.activity.trim()
    ) {
      const suspect = suspects.find((s) => s.id === suspectId);
      if (suspect) {
        const alibiEntry: AlibiEntry = {
          id: Date.now().toString(),
          startTime: entry.startTime,
          endTime: entry.endTime,
          location: entry.location,
          activity: entry.activity,
        };
        onUpdateSuspect({
          ...suspect,
          alibiEntries: [...suspect.alibiEntries, alibiEntry],
        });
        setNewAlibiEntry({
          ...newAlibiEntry,
          [suspectId]: {
            startTime: "",
            endTime: "",
            location: "",
            activity: "",
          },
        });
      }
    }
  };

  const handleDeleteAlibiEntry = (suspectId: string, alibiEntryId: string) => {
    const suspect = suspects.find((s) => s.id === suspectId);
    if (suspect) {
      onUpdateSuspect({
        ...suspect,
        alibiEntries: suspect.alibiEntries.filter((a) => a.id !== alibiEntryId),
      });
    }
  };

  const handleStartEditAlibi = (entry: AlibiEntry) => {
    setEditingAlibi((prev) => ({
      ...prev,
      [entry.id]: {
        startTime: entry.startTime,
        endTime: entry.endTime,
        location: entry.location,
        activity: entry.activity,
      },
    }));
  };

  const handleChangeEditingField = (
    alibiId: string,
    field: keyof Omit<AlibiEntry, "id">,
    value: string
  ) => {
    setEditingAlibi((prev) => ({
      ...prev,
      [alibiId]: {
        ...prev[alibiId],
        [field]: value,
      },
    }));
  };

  const handleSaveEditAlibi = (suspectId: string, alibiId: string) => {
    const draft = editingAlibi[alibiId];
    if (!draft) return;
    if (
      !draft.startTime ||
      !draft.endTime ||
      !draft.location.trim() ||
      !draft.activity.trim()
    ) {
      return;
    }
    // basic time ordering validation (allow equal or greater)
    if (draft.startTime > draft.endTime) {
      return;
    }
    const suspect = suspects.find((s) => s.id === suspectId);
    if (!suspect) return;
    const updated = suspect.alibiEntries.map((a) =>
      a.id === alibiId ? { ...a, ...draft } : a
    );
    onUpdateSuspect({ ...suspect, alibiEntries: updated });
    setEditingAlibi((prev) => {
      const rest = { ...prev };
      delete rest[alibiId];
      return rest;
    });
  };

  const handleCancelEditAlibi = (alibiId: string) => {
    setEditingAlibi((prev) => {
      const rest = { ...prev };
      delete rest[alibiId];
      return rest;
    });
  };

  return (
    <div className="suspect-manager">
      <div className="suspect-header">
        <h2>{t(language, "suspectsList")}</h2>
        <button
          className="btn-add-suspect"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? t(language, "cancel") : t(language, "addSuspect")}
        </button>
      </div>

      {showForm && (
        <div className="suspect-form">
          <div className="form-group">
            <label>{t(language, "name")}</label>
            <input
              type="text"
              placeholder={language === "ko" ? "용의자 이름" : "Suspect name"}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>{t(language, "characteristics")}</label>
            <textarea
              placeholder={
                language === "ko" ? "특징 설명" : "Describe characteristics"
              }
              value={formData.characteristics}
              onChange={(e) =>
                setFormData({ ...formData, characteristics: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>{t(language, "motive")}</label>
            <textarea
              placeholder={language === "ko" ? "범행 동기" : "Motive"}
              value={formData.motive}
              onChange={(e) =>
                setFormData({ ...formData, motive: e.target.value })
              }
            />
          </div>
          <button className="btn-submit" onClick={handleAddSuspect}>
            {t(language, "add")}
          </button>
        </div>
      )}

      <div className="suspects-list">
        {suspects.map((suspect) => (
          <div key={suspect.id} className="suspect-card">
            <button
              className="suspect-button"
              onClick={() => handleExpandSuspect(suspect.id)}
            >
              {suspect.name}
              <span className="expand-icon">
                {expandedSuspect === suspect.id ? "▼" : "▶"}
              </span>
            </button>

            {expandedSuspect === suspect.id && (
              <div className="suspect-details">
                <div className="detail-group">
                  <label>{t(language, "characteristics")}</label>
                  <textarea
                    value={suspect.characteristics}
                    onChange={(e) =>
                      handleUpdateSuspect({
                        characteristics: e.target.value,
                        motive: suspect.motive,
                      })
                    }
                  />
                </div>
                <div className="detail-group">
                  <label>{t(language, "motive")}</label>
                  <textarea
                    value={suspect.motive}
                    onChange={(e) =>
                      handleUpdateSuspect({
                        characteristics: suspect.characteristics,
                        motive: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="detail-group">
                  <label>{t(language, "alibis")}</label>
                  <div className="alibi-list">
                    {suspect.alibiEntries.length === 0 ? (
                      <p className="empty-alibi">{t(language, "noAlibi")}</p>
                    ) : (
                      suspect.alibiEntries
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map((entry) => (
                          <div key={entry.id} className="alibi-entry-item">
                            {editingAlibi[entry.id] ? (
                              <div className="alibi-edit-row">
                                <input
                                  type="time"
                                  value={editingAlibi[entry.id].startTime}
                                  onChange={(e) =>
                                    handleChangeEditingField(
                                      entry.id,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="time"
                                  value={editingAlibi[entry.id].endTime}
                                  onChange={(e) =>
                                    handleChangeEditingField(
                                      entry.id,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="text"
                                  placeholder={t(language, "place")}
                                  value={editingAlibi[entry.id].location}
                                  onChange={(e) =>
                                    handleChangeEditingField(
                                      entry.id,
                                      "location",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="text"
                                  placeholder={t(language, "activity")}
                                  value={editingAlibi[entry.id].activity}
                                  onChange={(e) =>
                                    handleChangeEditingField(
                                      entry.id,
                                      "activity",
                                      e.target.value
                                    )
                                  }
                                />
                                <button
                                  className="btn-save-alibi"
                                  onClick={() =>
                                    handleSaveEditAlibi(suspect.id, entry.id)
                                  }
                                >
                                  {t(language, "save")}
                                </button>
                                <button
                                  className="btn-cancel-alibi"
                                  onClick={() =>
                                    handleCancelEditAlibi(entry.id)
                                  }
                                >
                                  {t(language, "cancel")}
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="alibi-info">
                                  <span className="alibi-time">
                                    {getAlibiEntryDisplay(entry)}
                                  </span>
                                  <span className="alibi-location">
                                    {entry.location}
                                  </span>
                                  <span className="alibi-activity">
                                    {entry.activity}
                                  </span>
                                </div>
                                <div className="alibi-actions">
                                  <button
                                    className="btn-edit-alibi"
                                    onClick={() => handleStartEditAlibi(entry)}
                                  >
                                    {t(language, "edit")}
                                  </button>
                                  <button
                                    className="btn-delete-alibi"
                                    onClick={() =>
                                      handleDeleteAlibiEntry(
                                        suspect.id,
                                        entry.id
                                      )
                                    }
                                  >
                                    ✕
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                </div>

                <div className="detail-group alibi-input-group">
                  <label>{t(language, "newAlibi")}</label>
                  <div className="alibi-inputs">
                    <input
                      type="time"
                      placeholder={t(language, "startTime")}
                      value={newAlibiEntry[suspect.id]?.startTime || ""}
                      onChange={(e) =>
                        setNewAlibiEntry({
                          ...newAlibiEntry,
                          [suspect.id]: {
                            ...(newAlibiEntry[suspect.id] || {
                              startTime: "",
                              endTime: "",
                              location: "",
                              activity: "",
                            }),
                            startTime: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      type="time"
                      placeholder={t(language, "endTime")}
                      value={newAlibiEntry[suspect.id]?.endTime || ""}
                      onChange={(e) =>
                        setNewAlibiEntry({
                          ...newAlibiEntry,
                          [suspect.id]: {
                            ...(newAlibiEntry[suspect.id] || {
                              startTime: "",
                              endTime: "",
                              location: "",
                              activity: "",
                            }),
                            endTime: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder={t(language, "place")}
                      value={newAlibiEntry[suspect.id]?.location || ""}
                      onChange={(e) =>
                        setNewAlibiEntry({
                          ...newAlibiEntry,
                          [suspect.id]: {
                            ...(newAlibiEntry[suspect.id] || {
                              startTime: "",
                              endTime: "",
                              location: "",
                              activity: "",
                            }),
                            location: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder={t(language, "activity")}
                      value={newAlibiEntry[suspect.id]?.activity || ""}
                      onChange={(e) =>
                        setNewAlibiEntry({
                          ...newAlibiEntry,
                          [suspect.id]: {
                            ...(newAlibiEntry[suspect.id] || {
                              startTime: "",
                              endTime: "",
                              location: "",
                              activity: "",
                            }),
                            activity: e.target.value,
                          },
                        })
                      }
                    />
                    <button
                      className="btn-add-alibi"
                      onClick={() => handleAddAlibiEntry(suspect.id)}
                    >
                      {`+ ${t(language, "add")}`}
                    </button>
                  </div>
                </div>

                <button
                  className="btn-delete"
                  onClick={() => {
                    onDeleteSuspect(suspect.id);
                    setExpandedSuspect(null);
                  }}
                >
                  {t(language, "delete")}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuspectManager;
