import type { Platform } from "@/lib/schema";

export type IconName =
  | Platform
  | "arrow"
  | "star"
  | "menu"
  | "close"
  | "doc"
  | "lock"
  | "play"
  | "terminal"
  | "monitor"
  | "brain"
  | "users"
  | "chat"
  | "meter"
  | "award"
  | "expand"
  | "trophy"
  | "spark";

type Props = { name: IconName; className?: string };

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** Small inline icon set — no icon library needed. */
export function Icon({ name, className = "size-5" }: Props) {
  const common = { className, "aria-hidden": true as const, viewBox: "0 0 24 24" };
  switch (name) {
    case "github":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.27 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} fill="currentColor">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common} fill="currentColor">
          <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
        </svg>
      );
    case "leetcode":
      return (
        <svg {...common} fill="currentColor">
          <path d="M13.48 0a1.37 1.37 0 0 0-.96.44L7.12 6.21l-2.89 3.1a5.27 5.27 0 0 0-1.24 2.1 5.4 5.4 0 0 0 .23 3.72c.25.55.59 1.06 1.01 1.5l4.42 4.53c1.95 2 5.21 2.07 7.24.14l2.38-2.29a1.37 1.37 0 1 0-1.9-1.98l-2.38 2.29a2.47 2.47 0 0 1-3.42-.07L6.15 14.7a2.6 2.6 0 0 1-.05-3.66l2.87-3.08 5.34-5.74A1.37 1.37 0 0 0 13.48 0Zm-2.9 13.06a1.37 1.37 0 1 0 0 2.74h9.03a1.37 1.37 0 1 0 0-2.74h-9.03Z" />
        </svg>
      );
    case "email":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      );
    case "star":
      return (
        <svg {...common} fill="currentColor">
          <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M4 8h16M4 16h16" />
        </svg>
      );
    case "close":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "doc":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
          <path d="M14 3v5h5M9 13h6M9 17h6" />
        </svg>
      );
    case "codolio":
      return (
        <svg {...common} {...stroke}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <path d="M14.5 9.2a3.6 3.6 0 1 0 0 5.6" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common} {...stroke}>
          <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "play":
      return (
        <svg {...common} fill="currentColor">
          <path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5Z" />
        </svg>
      );
    case "terminal":
      return (
        <svg {...common} {...stroke}>
          <rect x="2.5" y="4" width="19" height="16" rx="3" />
          <path d="m7 9.5 3 2.5-3 2.5M12.5 15H17" />
        </svg>
      );
    case "monitor":
      return (
        <svg {...common} {...stroke}>
          <rect x="2.5" y="3.5" width="19" height="13" rx="2.5" />
          <path d="M8 20.5h8M12 16.5v4" />
        </svg>
      );
    case "brain":
      return (
        <svg {...common} {...stroke}>
          <path d="M9 4.5a3 3 0 0 0-3 3 3 3 0 0 0-2 5.2A3.2 3.2 0 0 0 7.5 18 2.5 2.5 0 0 0 12 19.5v-15A2.5 2.5 0 0 0 9 4.5ZM15 4.5a3 3 0 0 1 3 3 3 3 0 0 1 2 5.2 3.2 3.2 0 0 1-3.5 5.3A2.5 2.5 0 0 1 12 19.5" />
        </svg>
      );
    case "users":
      return (
        <svg {...common} {...stroke}>
          <circle cx="9" cy="8.5" r="3.5" />
          <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5.2a3.5 3.5 0 0 1 0 6.6M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common} {...stroke}>
          <path d="M20.5 12a8 8 0 0 1-11.7 7.1L3.5 20.5l1.4-4.9A8 8 0 1 1 20.5 12Z" />
          <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth={2.6} />
        </svg>
      );
    case "meter":
      return (
        <svg {...common} {...stroke}>
          <path d="M3.5 15a8.5 8.5 0 1 1 17 0" />
          <path d="m12 15 4-5M3.5 19h17" />
        </svg>
      );
    case "award":
      return (
        <svg {...common} {...stroke}>
          <circle cx="12" cy="9" r="5.5" />
          <path d="m8.5 13.3-1.5 7.2 5-2.5 5 2.5-1.5-7.2" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...common} {...stroke}>
          <path d="M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v3.5M8 20.5h8M9.5 17.5h5" />
        </svg>
      );
    case "expand":
      return (
        <svg {...common} {...stroke}>
          <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2.5c.5 4.6 2.9 7 7.5 7.5-4.6.5-7 2.9-7.5 7.5-.5-4.6-2.9-7-7.5-7.5 4.6-.5 7-2.9 7.5-7.5ZM19 15.5c.25 2 1.25 3 3 3.25-1.75.25-2.75 1.25-3 3.25-.25-2-1.25-3-3-3.25 1.75-.25 2.75-1.25 3-3.25Z" />
        </svg>
      );
    default:
      // Generic "code brackets" glyph for CodeChef, Codeforces, personal sites, etc.
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />
        </svg>
      );
  }
}
