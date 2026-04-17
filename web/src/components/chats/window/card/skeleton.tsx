export function MessageSkeleton({
  align = "left",
}: {
  align?: "left" | "right";
}) {
  return (
    <div
      className={`flex gap-2 ${
        align === "right" ? "justify-end" : "justify-start"
      } animate-pulse`}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-muted" />

      {/* Bubble */}
      <div className="max-w-xs">
        <div className="h-10 w-40 rounded-lg bg-muted mb-1" />
        <div className="h-2 w-10 bg-muted rounded ml-auto" />
      </div>
    </div>
  );
}
