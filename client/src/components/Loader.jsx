export default function Loader({ error }) {
  if (error) return <div className="status status--error">Could not load data: {error.message}</div>;
  return <div className="status">Loading…</div>;
}
