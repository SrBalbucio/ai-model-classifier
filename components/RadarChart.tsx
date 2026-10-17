interface RadarChartProps {
  values: Record<string, number>;
  labels: Record<string, string>;
  color: string;
  compareValues?: Record<string, number>;
  compareColor?: string;
  size?: number;
  max?: number;
}

export function RadarChart({
  values,
  labels,
  color,
  compareValues,
  compareColor = "#f87171",
  size = 320,
  max = 10,
}: RadarChartProps) {
  const keys = Object.keys(labels);
  const n = keys.length;
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 56;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const point = (i: number, v: number) => {
    const r = (Math.min(v, max) / max) * R;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))] as const;
  };
  const polygon = (vals: Record<string, number>) =>
    keys.map((k, i) => point(i, vals[k] ?? 0).join(",")).join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="max-w-full"
      role="img"
      aria-label="Radar chart of model scores"
    >
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          key={f}
          points={keys.map((_, i) => point(i, max * f).join(",")).join(" ")}
          fill="none"
          stroke="var(--color-edge)"
          strokeWidth={1}
        />
      ))}
      {keys.map((_, i) => {
        const [x, y] = point(i, max);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="var(--color-edge)"
            strokeWidth={1}
          />
        );
      })}

      {compareValues && (
        <polygon
          points={polygon(compareValues)}
          fill={compareColor}
          fillOpacity={0.12}
          stroke={compareColor}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      )}

      <polygon
        points={polygon(values)}
        fill={color}
        fillOpacity={0.18}
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {keys.map((k, i) => {
        const v = values[k] ?? 0;
        const [x, y] = point(i, v);
        return <circle key={k} cx={x} cy={y} r={3.5} fill={color} />;
      })}

      {keys.map((k, i) => {
        const [x, y] = point(i, max + 1.6);
        const cos = Math.cos(angle(i));
        const anchor = Math.abs(cos) < 0.3 ? "middle" : cos > 0 ? "start" : "end";
        return (
          <text
            key={k}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize={11}
            fill="var(--color-fog)"
          >
            {labels[k]}
          </text>
        );
      })}
    </svg>
  );
}
