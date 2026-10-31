import type { ElementType } from "react";

/** Heading whose lines rise out of a mask on entry. Pass lines explicitly so breaks are designed, not accidental. */
export function Lines({
  as: Tag = "h2",
  lines,
  className = "",
  id,
}: {
  as?: ElementType;
  lines: string[];
  className?: string;
  id?: string;
}) {
  return (
    <Tag id={id} data-lines className={className}>
      {lines.map((line) => (
        <span key={line} data-line>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
