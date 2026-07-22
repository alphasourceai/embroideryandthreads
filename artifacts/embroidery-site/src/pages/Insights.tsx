import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { getUser, login, logout, type User } from "@netlify/identity";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import Download from "lucide-react/dist/esm/icons/download";
import Eye from "lucide-react/dist/esm/icons/eye";
import FileText from "lucide-react/dist/esm/icons/file-text";
import LogOut from "lucide-react/dist/esm/icons/log-out";
import Mail from "lucide-react/dist/esm/icons/mail";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw";
import Send from "lucide-react/dist/esm/icons/send";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import Users from "lucide-react/dist/esm/icons/users";
import { Link } from "wouter";
import PublicImage from "@/components/PublicImage";
import { usePageMetadata } from "@/hooks/use-page-metadata";

type CountRow = { label: string; count: number };
type DailyRow = { date: string; views: number; submissions: number };
type LeadStatus = "new" | "contacted" | "closed";
type Lead = {
  id: string;
  status: LeadStatus;
  name: string;
  email: string;
  category: string;
  message: string;
  submittedAt: string;
};
type Draft = {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  updatedAt: string;
  expiresAt: string;
};
type InsightsData = {
  rangeDays: number;
  generatedAt: string;
  retentionDays: number;
  summary: {
    pageViews: number;
    sessions: number;
    formStarts: number;
    submissions: number;
    abandoned: number;
    conversionRate: number;
  };
  daily: DailyRow[];
  topPages: CountRow[];
  referrers: CountRow[];
  devices: CountRow[];
  categories: CountRow[];
  leads: Lead[];
  drafts: Draft[];
};

const ranges = [7, 30, 90, 365] as const;
const dateTime = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function Insights() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [range, setRange] = useState<(typeof ranges)[number]>(30);
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  const [leadView, setLeadView] = useState<"submitted" | "drafts">("submitted");

  usePageMetadata({
    title: "Site Insights | Embroidery & Threads",
    description:
      "Private website analytics and inquiry management for authorized Embroidery & Threads administrators.",
    path: "/insights",
    robots: "noindex, nofollow",
  });

  useEffect(() => {
    void getUser().then((currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setDataError("");
    try {
      const response = await fetch(
        `/.netlify/functions/insights?days=${range}`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );
      if (response.status === 403) {
        throw new Error("This account does not have analytics access.");
      }
      if (response.status === 401) {
        setUser(null);
        throw new Error("Your session expired. Sign in again.");
      }
      if (!response.ok) throw new Error("Insights could not be loaded.");
      setData((await response.json()) as InsightsData);
    } catch (error) {
      setDataError(
        error instanceof Error
          ? error.message
          : "Insights could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    if (user) void loadData();
  }, [loadData, user]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");
    try {
      const currentUser = await login(email.trim(), password);
      setUser(currentUser);
      setPassword("");
    } catch {
      setAuthError("The email or password was not accepted.");
    }
  };

  const handleLogout = async () => {
    await logout();
    setData(null);
    setUser(null);
  };

  const changeLeadStatus = async (id: string, status: LeadStatus) => {
    const response = await fetch("/.netlify/functions/insights", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ kind: "lead", id, status }),
    });
    if (response.ok) await loadData();
  };

  const removeRecord = async (kind: "lead" | "draft", id: string) => {
    if (!window.confirm("Delete this record permanently?")) return;
    const response = await fetch("/.netlify/functions/insights", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ kind, id }),
    });
    if (response.ok) await loadData();
  };

  const downloadLeads = () => {
    if (!data) return;
    const rows = [
      ["Type", "Date", "Status", "Name", "Email", "Category", "Message"],
      ...data.leads.map((lead) => [
        "Submitted",
        lead.submittedAt,
        lead.status,
        lead.name,
        lead.email,
        lead.category,
        lead.message,
      ]),
      ...data.drafts.map((draft) => [
        "Saved draft",
        draft.updatedAt,
        "saved",
        draft.name,
        draft.email,
        draft.category,
        draft.message,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = `embroidery-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const chartMax = useMemo(
    () => Math.max(1, ...(data?.daily.map(({ views }) => views) ?? [1])),
    [data],
  );

  if (!authChecked) {
    return <div className="insights-loading">Checking access...</div>;
  }

  if (!user) {
    return (
      <main id="main-content" className="insights-login-page" tabIndex={-1}>
        <section
          className="insights-login-panel"
          aria-labelledby="insights-login-title"
        >
          <PublicImage src="/logo-b.jpg" alt="Embroidery & Threads" />
          <p className="insights-eyebrow">Private access</p>
          <h1 id="insights-login-title">Site Insights</h1>
          <form onSubmit={handleLogin}>
            <label>
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <button type="submit" className="insights-primary-button">
              Sign in
            </button>
            <p className="insights-error" role="alert">
              {authError}
            </p>
          </form>
          <Link href="/" className="insights-back-link">
            <ArrowLeft aria-hidden="true" /> Back to site
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="insights-shell">
      <header className="insights-header">
        <div>
          <p className="insights-eyebrow">Embroidery & Threads</p>
          <h1>Site Insights</h1>
          <p>{user.email}</p>
        </div>
        <div className="insights-header-actions">
          <Link href="/" className="insights-icon-button" title="View site">
            <Eye aria-hidden="true" />
            <span className="visually-hidden">View site</span>
          </Link>
          <button
            type="button"
            className="insights-icon-button"
            title="Refresh"
            onClick={() => void loadData()}
            disabled={loading}
          >
            <RefreshCw aria-hidden="true" />
            <span className="visually-hidden">Refresh</span>
          </button>
          <button
            type="button"
            className="insights-icon-button"
            title="Sign out"
            onClick={() => void handleLogout()}
          >
            <LogOut aria-hidden="true" />
            <span className="visually-hidden">Sign out</span>
          </button>
        </div>
      </header>

      <main id="main-content" className="insights-main" tabIndex={-1}>
        <div className="insights-toolbar">
          <div className="insights-range" aria-label="Date range">
            {ranges.map((days) => (
              <button
                key={days}
                type="button"
                className={range === days ? "is-active" : ""}
                onClick={() => setRange(days)}
              >
                {days === 365 ? "1 year" : `${days} days`}
              </button>
            ))}
          </div>
          {data && (
            <span>Updated {dateTime.format(new Date(data.generatedAt))}</span>
          )}
        </div>

        {dataError && (
          <p className="insights-banner-error" role="alert">
            {dataError}
          </p>
        )}
        {loading && !data && (
          <p className="insights-loading">Loading insights...</p>
        )}

        {data && (
          <>
            <section className="insights-stats" aria-label="Summary">
              <Metric
                icon={<Eye />}
                label="Page views"
                value={data.summary.pageViews}
              />
              <Metric
                icon={<Users />}
                label="Sessions"
                value={data.summary.sessions}
              />
              <Metric
                icon={<FileText />}
                label="Form starts"
                value={data.summary.formStarts}
              />
              <Metric
                icon={<Send />}
                label="Submitted"
                value={data.summary.submissions}
              />
              <Metric
                icon={<Mail />}
                label="Unfinished"
                value={data.summary.abandoned}
              />
              <Metric
                label="Start to submit"
                value={`${data.summary.conversionRate}%`}
              />
            </section>

            <section
              className="insights-section"
              aria-labelledby="traffic-heading"
            >
              <div className="insights-section-heading">
                <div>
                  <p className="insights-eyebrow">Traffic</p>
                  <h2 id="traffic-heading">Page activity</h2>
                </div>
              </div>
              <div className="insights-chart" aria-label="Daily page views">
                {data.daily.map((row) => (
                  <div
                    key={row.date}
                    className="insights-chart-column"
                    title={`${row.date}: ${row.views} views, ${row.submissions} submissions`}
                  >
                    <span
                      className="insights-chart-bar"
                      style={{
                        height: `${Math.max(3, (row.views / chartMax) * 100)}%`,
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="insights-rank-grid">
                <RankTable title="Top pages" rows={data.topPages} />
                <RankTable title="Referrers" rows={data.referrers} />
                <RankTable title="Devices" rows={data.devices} />
                <RankTable title="Project interest" rows={data.categories} />
              </div>
            </section>

            <section
              className="insights-section"
              aria-labelledby="leads-heading"
            >
              <div className="insights-section-heading">
                <div>
                  <p className="insights-eyebrow">Inquiries</p>
                  <h2 id="leads-heading">Leads</h2>
                </div>
                <button
                  type="button"
                  className="insights-secondary-button"
                  onClick={downloadLeads}
                >
                  <Download aria-hidden="true" /> Export CSV
                </button>
              </div>
              <div
                className="insights-tabs"
                role="tablist"
                aria-label="Lead type"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={leadView === "submitted"}
                  className={leadView === "submitted" ? "is-active" : ""}
                  onClick={() => setLeadView("submitted")}
                >
                  Submitted ({data.leads.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={leadView === "drafts"}
                  className={leadView === "drafts" ? "is-active" : ""}
                  onClick={() => setLeadView("drafts")}
                >
                  Saved drafts ({data.drafts.length})
                </button>
              </div>

              {leadView === "submitted" ? (
                <LeadTable
                  leads={data.leads}
                  onStatus={changeLeadStatus}
                  onDelete={(id) => removeRecord("lead", id)}
                />
              ) : (
                <DraftTable
                  drafts={data.drafts}
                  onDelete={(id) => removeRecord("draft", id)}
                />
              )}
            </section>

            <p className="insights-retention-note">
              Anonymous analytics are retained for {data.retentionDays} days.
              Opted-in drafts expire after 30 days; submitted inquiry copies
              expire after 24 months.
            </p>
          </>
        )}
      </main>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="insights-metric">
      {icon && <span aria-hidden="true">{icon}</span>}
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  );
}

function RankTable({ title, rows }: { title: string; rows: CountRow[] }) {
  return (
    <div className="insights-rank-table">
      <h3>{title}</h3>
      {rows.length ? (
        <ol>
          {rows.map((row) => (
            <li key={row.label}>
              <span>{row.label}</span>
              <strong>{row.count}</strong>
            </li>
          ))}
        </ol>
      ) : (
        <p>No activity yet.</p>
      )}
    </div>
  );
}

function LeadTable({
  leads,
  onStatus,
  onDelete,
}: {
  leads: Lead[];
  onStatus: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
}) {
  if (!leads.length)
    return <p className="insights-empty">No submitted inquiries yet.</p>;
  return (
    <div className="insights-table-wrap">
      <table className="insights-lead-table">
        <thead>
          <tr>
            <th>Received</th>
            <th>Contact</th>
            <th>Project</th>
            <th>Message</th>
            <th>Status</th>
            <th>
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{dateTime.format(new Date(lead.submittedAt))}</td>
              <td>
                <strong>{lead.name}</strong>
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
              </td>
              <td>{lead.category || "Not specified"}</td>
              <td className="insights-message-cell">{lead.message}</td>
              <td>
                <select
                  value={lead.status}
                  onChange={(event) =>
                    onStatus(lead.id, event.target.value as LeadStatus)
                  }
                  aria-label={`Status for ${lead.name}`}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </td>
              <td>
                <button
                  type="button"
                  className="insights-delete-button"
                  title="Delete lead"
                  onClick={() => onDelete(lead.id)}
                >
                  <Trash2 aria-hidden="true" />
                  <span className="visually-hidden">Delete {lead.name}</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DraftTable({
  drafts,
  onDelete,
}: {
  drafts: Draft[];
  onDelete: (id: string) => void;
}) {
  if (!drafts.length)
    return <p className="insights-empty">No opted-in saved drafts.</p>;
  return (
    <div className="insights-table-wrap">
      <table className="insights-lead-table">
        <thead>
          <tr>
            <th>Last saved</th>
            <th>Contact</th>
            <th>Project</th>
            <th>Message</th>
            <th>Expires</th>
            <th>
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {drafts.map((draft) => (
            <tr key={draft.id}>
              <td>{dateTime.format(new Date(draft.updatedAt))}</td>
              <td>
                <strong>{draft.name}</strong>
                <a href={`mailto:${draft.email}`}>{draft.email}</a>
              </td>
              <td>{draft.category || "Not specified"}</td>
              <td className="insights-message-cell">
                {draft.message || "No message entered"}
              </td>
              <td>{dateTime.format(new Date(draft.expiresAt))}</td>
              <td>
                <button
                  type="button"
                  className="insights-delete-button"
                  title="Delete draft"
                  onClick={() => onDelete(draft.id)}
                >
                  <Trash2 aria-hidden="true" />
                  <span className="visually-hidden">
                    Delete draft from {draft.name}
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
