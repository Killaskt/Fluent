"use client";

interface Props {
  streak: number;
  size?: "sm" | "md" | "lg";
}

export default function StreakBadge({ streak, size = "md" }: Props) {
  const sizeClasses = {
    sm: "text-sm px-2 py-1 gap-1",
    md: "text-base px-3 py-1.5 gap-1.5",
    lg: "text-lg px-4 py-2 gap-2",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full bg-orange-100 text-orange-700 font-bold ${sizeClasses[size]}`}
      aria-label={`${streak}-day streak`}
    >
      <span role="img" aria-hidden="true">
        🔥
      </span>
      <span>{streak}</span>
    </div>
  );
}
