export default function TeamBadge({ team, size = 32 }) {
  if (!team) return <span className="badge" style={{ width: size, height: size }} />;
  return (
    <span
      className="badge"
      title={team.name}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.3,
        background: `linear-gradient(135deg, ${team.primary} 0 60%, ${team.secondary} 60% 100%)`,
      }}
    >
      {team.abbr}
    </span>
  );
}
