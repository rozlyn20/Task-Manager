import React from "react";
import "./charts.scss";
import { WEEKDAY_SHORT } from "../../utils/habitStats";

/**
 * GitHub-style contribution heatmap for a single habit.
 * `weeks` is the output of buildHeatmapWeeks(habit, n) — an array of week
 * columns, each holding 7 day-cells (Sun..Sat).
 */
export const ContributionHeatmap = ({ weeks, color = "#4f46e5" }) => {
  const cell = 12;
  const gap = 3;
  const labelWidth = 20;
  const cols = weeks.length;
  const width = labelWidth + cols * (cell + gap);
  const height = 7 * (cell + gap);

  const fillFor = (day) => {
    if (day.isFuture) return "transparent";
    if (day.logged) return color;
    if (day.scheduled) return "var(--heatmap-missed, #e5e7eb)";
    return "var(--heatmap-unscheduled, #f3f4f6)";
  };

  return (
    <div className="chart-heatmap">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {WEEKDAY_SHORT.map((label, row) =>
          row % 2 === 1 ? (
            <text
              key={label + row}
              x={0}
              y={row * (cell + gap) + cell - 2}
              className="heatmap-weekday"
            >
              {label}
            </text>
          ) : null
        )}

        {weeks.map((week, colIdx) =>
          week.map((day, rowIdx) => (
            <rect
              key={day.key}
              x={labelWidth + colIdx * (cell + gap)}
              y={rowIdx * (cell + gap)}
              width={cell}
              height={cell}
              rx={2}
              fill={fillFor(day)}
              className={day.logged ? "heatmap-cell logged" : "heatmap-cell"}
            >
              <title>
                {day.key}
                {day.logged ? " — done" : day.scheduled ? " — missed" : " — not scheduled"}
              </title>
            </rect>
          ))
        )}
      </svg>
    </div>
  );
};
