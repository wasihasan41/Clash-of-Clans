export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-block" />
      <div className="skeleton skeleton-block" />
    </div>
  );
}