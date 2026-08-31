import { Link } from "@tanstack/react-router";

import logo from "@/assets/usbf-logo.png.asset.json";
import { SECTIONS } from "@/lib/categories";
import { formatUSWeekday, formatUSTime } from "@/lib/format";

export function SiteHeader({ now }: { now: string }) {
  return (
    <header className="bg-background">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between py-2 meta-line">
          <span className="hidden sm:block">{formatUSWeekday(now)}</span>
          <span className="hidden md:block">U.S. Edition &middot; New York</span>
          <span>{formatUSTime(now)}</span>
        </div>

        <div className="hairline" />

        <div className="flex justify-center py-6">
          <Link to="/" aria-label="US Business Forum home">
            <img
              src={logo.url}
              alt="US Business Forum"
              className="h-16 w-auto sm:h-20 md:h-24"
              width={960}
              height={240}
            />
          </Link>
        </div>

        <nav className="rule-top hairline">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 py-3 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em]">
            <li>
              <Link
                to="/"
                activeOptions={{ exact: true }}
                className="transition-colors hover:text-accent"
                activeProps={{ className: "text-accent" }}
              >
                Front Page
              </Link>
            </li>
            {SECTIONS.map((section) => (
              <li key={section.key}>
                <Link
                  to={section.path}
                  className="transition-colors hover:text-accent"
                  activeProps={{ className: "text-accent" }}
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
