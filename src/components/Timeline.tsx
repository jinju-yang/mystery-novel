import type { Suspect } from "../types";
import { t, type Language } from "../i18n";
import "./Timeline.css";

interface TimelineProps {
  startTime: string;
  endTime: string;
  deathEstimatedTimeStart?: string;
  deathEstimatedTimeEnd?: string;
  suspects: Suspect[];
  selectedSuspectId?: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onDeathEstimatedTimeStartChange: (time: string) => void;
  onDeathEstimatedTimeEndChange: (time: string) => void;
  onFilterChange: (suspectId: string | null) => void;
  language: Language;
}

const Timeline: React.FC<TimelineProps> = ({
  startTime,
  endTime,
  deathEstimatedTimeStart,
  deathEstimatedTimeEnd,
  suspects,
  selectedSuspectId,
  onStartTimeChange,
  onEndTimeChange,
  onDeathEstimatedTimeStartChange,
  onDeathEstimatedTimeEndChange,
  onFilterChange,
  language,
}) => {
  const generateTimeSlots = (start: string, end: string): string[] => {
    const slots: string[] = [];
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    let currentH = startH;
    let currentM = startM;

    while (currentH < endH || (currentH === endH && currentM <= endM)) {
      slots.push(
        `${String(currentH).padStart(2, "0")}:${String(currentM).padStart(
          2,
          "0"
        )}`
      );
      currentM += 30;
      if (currentM >= 60) {
        currentM -= 60;
        currentH += 1;
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots(startTime, endTime);

  // Helper function to find the closest time slot index
  const findClosestSlotIndex = (time: string): number => {
    const [h, m] = time.split(":").map(Number);
    const timeMinutes = h * 60 + m;

    let closestIndex = -1;
    let minDiff = Infinity;

    timeSlots.forEach((slot, index) => {
      const [slotH, slotM] = slot.split(":").map(Number);
      const slotMinutes = slotH * 60 + slotM;
      const diff = Math.abs(timeMinutes - slotMinutes);

      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  return (
    <div className="timeline-container">
      <div className="timeline-settings">
        <div className="time-input-group">
          <label>{t(language, "startTime")}</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
          />
        </div>
        <div className="time-input-group">
          <label>{t(language, "endTime")}</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
          />
        </div>
        <div className="time-input-group">
          <label>{t(language, "deathStart")}</label>
          <input
            type="time"
            value={deathEstimatedTimeStart || ""}
            onChange={(e) => onDeathEstimatedTimeStartChange(e.target.value)}
          />
        </div>
        <div className="time-input-group">
          <label>{t(language, "deathEnd")}</label>
          <input
            type="time"
            value={deathEstimatedTimeEnd || ""}
            onChange={(e) => onDeathEstimatedTimeEndChange(e.target.value)}
          />
        </div>
      </div>

      {suspects.length > 0 && (
        <div className="filter-section">
          <label>{t(language, "suspectFilter")}</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${
                selectedSuspectId === undefined ? "active" : ""
              }`}
              onClick={() => onFilterChange(null)}
            >
              {t(language, "all")}
            </button>
            {suspects.map((suspect) => (
              <button
                key={suspect.id}
                className={`filter-btn ${
                  selectedSuspectId === suspect.id ? "active" : ""
                }`}
                onClick={() => onFilterChange(suspect.id)}
              >
                {suspect.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="timeline-display">
        <div className="timeline-header">
          <h3>{t(language, "timeline")}</h3>
          {deathEstimatedTimeStart && deathEstimatedTimeEnd && (
            <div className="death-time-indicator">
              {t(language, "deathStart").replace(":", "")} ~{" "}
              {t(language, "deathEnd").replace(":", "")}:{" "}
              <span className="death-time-value">
                {deathEstimatedTimeStart} ~ {deathEstimatedTimeEnd}
              </span>
            </div>
          )}
        </div>
        <div className="timeline-content">
          <div className="timeline-grid">
            <div className="timeline-times">
              {timeSlots.map((slot) => (
                <div key={slot} className="timeline-time-cell">
                  {slot}
                </div>
              ))}
            </div>
            <div className="timeline-tracks">
              {suspects.length === 0 ? (
                <div className="timeline-empty">
                  <p>
                    {language === "ko"
                      ? "용의자를 추가하여 알리바이를 확인하세요"
                      : "Add suspects to view alibis."}
                  </p>
                </div>
              ) : (
                suspects
                  .filter(
                    (s) => !selectedSuspectId || s.id === selectedSuspectId
                  )
                  .map((suspect) => (
                    <div
                      key={suspect.id}
                      className="timeline-track"
                      style={{
                        backgroundColor: `hsl(${
                          (suspects.indexOf(suspect) * 360) / suspects.length
                        }, 70%, 90%)`,
                      }}
                    >
                      <div className="track-label">{suspect.name}</div>
                      <div className="track-events">
                        {!suspect.alibiEntries ||
                        suspect.alibiEntries.length === 0 ? (
                          <div className="no-alibi">
                            {language === "ko" ? "알리바이 없음" : "No alibi"}
                          </div>
                        ) : (
                          suspect.alibiEntries
                            .sort((a, b) =>
                              a.startTime.localeCompare(b.startTime)
                            )
                            .map((entry) => {
                              const startTimeIndex = findClosestSlotIndex(
                                entry.startTime
                              );
                              const endTimeIndex = findClosestSlotIndex(
                                entry.endTime
                              );

                              if (startTimeIndex < 0 || endTimeIndex < 0) {
                                return null;
                              }

                              const position =
                                (startTimeIndex / timeSlots.length) * 100;
                              const width =
                                ((endTimeIndex - startTimeIndex + 1) /
                                  timeSlots.length) *
                                100;

                              return (
                                <div
                                  key={entry.id}
                                  className="alibi-marker"
                                  style={{
                                    left: `${position}%`,
                                    width: `${width}%`,
                                  }}
                                  title={`${entry.startTime} - ${entry.endTime} (${entry.location}) - ${entry.activity}`}
                                >
                                  <div className="marker-dot"></div>
                                  <div className="marker-tooltip">
                                    <div className="tooltip-time">
                                      {entry.startTime} ~ {entry.endTime}
                                    </div>
                                    <div className="tooltip-location">
                                      {entry.location}
                                    </div>
                                    <div className="tooltip-activity">
                                      {entry.activity}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                        )}
                        {deathEstimatedTimeStart &&
                          deathEstimatedTimeEnd &&
                          (() => {
                            const deathStartIndex = findClosestSlotIndex(
                              deathEstimatedTimeStart
                            );
                            const deathEndIndex = findClosestSlotIndex(
                              deathEstimatedTimeEnd
                            );

                            if (deathStartIndex < 0 || deathEndIndex < 0) {
                              return null;
                            }

                            const position =
                              (deathStartIndex / timeSlots.length) * 100;
                            const width =
                              ((deathEndIndex - deathStartIndex + 1) /
                                timeSlots.length) *
                              100;

                            return (
                              <div
                                className="death-time-marker"
                                style={{
                                  left: `${position}%`,
                                  width: `${width}%`,
                                }}
                                title={`${t(
                                  language,
                                  "deathStart"
                                )} ${deathEstimatedTimeStart} ~ ${t(
                                  language,
                                  "deathEnd"
                                )} ${deathEstimatedTimeEnd}`}
                              >
                                <div className="death-marker-dot"></div>
                              </div>
                            );
                          })()}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
