import React from "react";
import type { Suspect } from "../types";
import "./SuspectFilter.css";

interface SuspectFilterProps {
  suspects: Suspect[];
  selectedSuspectId: string | null;
  onFilterChange: (suspectId: string | null) => void;
}

const SuspectFilter: React.FC<SuspectFilterProps> = ({
  suspects,
  selectedSuspectId,
  onFilterChange,
}) => {
  return (
    <div className="filter-container">
      <h3>용의자 필터</h3>
      <div className="filter-buttons">
        <button
          className={`filter-btn ${selectedSuspectId === null ? "active" : ""}`}
          onClick={() => onFilterChange(null)}
        >
          모두 보기
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
  );
};

export default SuspectFilter;
