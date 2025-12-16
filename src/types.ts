// Evidence options
export type EvidenceStatus = "O" | "△" | "X" | null;

// Evidence item for a clue
export interface Evidence {
  id: string;
  clue: string; // What is the clue?
}

// Suspect's response to evidence
export interface SuspectEvidenceStatus {
  suspectId: string;
  where: EvidenceStatus; // Where?
  how: EvidenceStatus; // How?
  why: EvidenceStatus; // Why?
}

// Clue with suspect responses
export interface Clue {
  id: string;
  description: string; // Clue description
  suspectStatuses: SuspectEvidenceStatus[]; // Response from each suspect
}

// Alibi entry with time range
export interface AlibiEntry {
  id: string;
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  location: string; // Where
  activity: string; // What they were doing
}

// Suspect information
export interface Suspect {
  id: string;
  name: string;
  characteristics: string;
  motive: string;
  alibiEntries: AlibiEntry[]; // Changed from alibi string to array of timed entries
  clues: Clue[];
}

// Application state
export interface MysteryState {
  suspects: Suspect[];
  timelineStart: string; // Format: "HH:MM"
  timelineEnd: string; // Format: "HH:MM"
  deathEstimatedTimeStart?: string; // Format: "HH:MM" - Estimated time of death start
  deathEstimatedTimeEnd?: string; // Format: "HH:MM" - Estimated time of death end
  selectedSuspectFilter?: string; // Filter by suspect ID
}
