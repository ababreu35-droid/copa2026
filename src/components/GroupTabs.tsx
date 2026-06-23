import type { Group } from "../types";

interface GroupTabsProps {
  groups: Group[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function GroupTabs({ groups, selectedId, onSelect }: GroupTabsProps) {
  return (
    <div className="group-tabs-wrapper">
      <div className="group-tabs">
        {groups.map((g) => {
          const hasLive = g.matches.some((m) => m.status === "IN_PLAY" || m.status === "PAUSED");
          return (
            <button
              key={g.id}
              className={`group-tab ${g.id === selectedId ? "active" : ""}`}
              onClick={() => onSelect(g.id)}
            >
              {g.id}
              {hasLive && <span className="live-dot-tab" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
