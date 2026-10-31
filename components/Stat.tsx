export function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="stat">
      <span className="stat-value">
        {typeof value === "number" ? value.toLocaleString("en-IN") : value}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
