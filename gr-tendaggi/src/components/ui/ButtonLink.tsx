import Link from "next/link";
import { Magnetic } from "./Magnetic";

type Props = {
  href: string;
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
};

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 12" width="20" height="12" className={`btn-arrow ${className}`}>
      <path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function ButtonLink({ href, children, tone = "dark", className = "" }: Props) {
  return (
    <Magnetic>
      <Link href={href} className={`btn ${tone === "light" ? "btn-light" : ""} ${className}`}>
        <span>{children}</span>
        <Arrow />
      </Link>
    </Magnetic>
  );
}
