import React from "react";
import "./charts.scss";

/**
 * Small, dependency-free SVG chart primitives used by the Analytics dashboard.
 * Built by hand (no charting library) so the project doesn't need a new
 * npm dependency just to render 3 simple charts.
 */

// ---------------------------------------------------------------------------
// Donut chart — used for "tasks by status"
// ---------------------------------------------------------------------------
export const DonutChart = ({ data, size = 180, strokeWidth = 26 }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulative = 0;

  return (
    <div className="chart-donut">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--chart-track, #f1f2f6)"
          strokeWidth={strokeWidth}
        />
        {total > 0 &&
          data.map((d, i) => {
            if (d.value === 0) return null;
            const fraction = d.value / total;
            const dash = fraction * circumference;
            const gap = circumference - dash;
            const offset = circumference * 0.25 - cumulative;
            cumulative += dash;

            return (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={offset}
                strokeLinecap="butt"
                className="donut-segment"
              />
            );
          })}
        <text x={center} y={center - 4} textAnchor="middle" className="donut-total">
          {total}
        </text>
        <text x={center} y={center + 16} textAnchor="middle" className="donut-total-label">
          tasks
        </text>
      </svg>

      <ul className="chart-legend">
        {data.map((d, i) => (
          <li key={i}>
            <span className="swatch" style={{ backgroundColor: d.color }}></span>
            <span className="label">{d.label}</span>
            <span className="value">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Bar chart — used for "tasks by category"
// ---------------------------------------------------------------------------
export const BarChart = ({ data, height = 200 }) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barWidth = 100 / data.length;

  return (
    <div className="chart-bar" style={{ height }}>
      <div className="bar-plot">
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          return (
            <div
              className="bar-col"
              key={i}
              style={{ width: `${barWidth}%` }}
              title={`${d.label}: ${d.value}`}
            >
              <span className="bar-value">{d.value}</span>
              <div
                className="bar-fill"
                style={{ height: `${pct}%`, backgroundColor: d.color }}
              ></div>
              <span className="bar-label">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Line/area chart — used for "completion over time"
// ---------------------------------------------------------------------------
export const TrendLineChart = ({ data, height = 200, color = "#4f46e5" }) => {
  const width = 600;
  const padding = 24;
  const max = Math.max(1, ...data.map((d) => d.value));
  const stepX = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (d.value / max) * (height - padding * 2);
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${height - padding} L ${points[0].x.toFixed(1)} ${height - padding} Z`
      : "";

  // Show at most ~7 x-axis labels so long ranges stay legible.
  const labelEvery = Math.max(1, Math.ceil(points.length / 7));

  return (
    <div className="chart-trend">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {areaPath && <path d={areaPath} fill="url(#trendFill)" />}
        {linePath && (
          <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" className="trend-line" />
        )}

        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} className="trend-dot">
            <title>{`${p.label}: ${p.value}`}</title>
          </circle>
        ))}
      </svg>

      <div className="trend-x-axis">
        {points.map((p, i) =>
          i % labelEvery === 0 || i === points.length - 1 ? (
            <span key={i} style={{ left: `${(p.x / width) * 100}%` }}>
              {p.label}
            </span>
          ) : null
        )}
      </div>
    </div>
  );
};
