// lib/newsletter-engine/db.ts
// Turso storage for generated newsletter issues. Reuses the same DB the site
// already talks to (bookings, orders, newsletter_subscribers all live here).

import { createClient } from '@libsql/client';

export function getTurso() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
}

export async function initIssuesTable(db: ReturnType<typeof getTurso>) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS newsletter_issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',   -- draft | approved | rejected | sent | skipped
      subject TEXT,
      slug TEXT,
      email_html TEXT,
      email_text TEXT,
      blog_title TEXT,
      blog_md TEXT,
      sources_json TEXT,
      skip_reason TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      approved_at TEXT,
      sent_at TEXT
    )
  `);
  // Additive migration for repos created before `slug` existed — ignore the
  // "duplicate column" error if it's already there.
  try {
    await db.execute(`ALTER TABLE newsletter_issues ADD COLUMN slug TEXT`);
  } catch {
    // already exists — fine
  }
}

export async function ensureUnsubscribedColumn(db: ReturnType<typeof getTurso>) {
  try {
    await db.execute(`ALTER TABLE newsletter_subscribers ADD COLUMN unsubscribed_at TEXT`);
  } catch {
    // already exists — fine
  }
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

export interface NewIssue {
  client: string;
  status: 'draft' | 'skipped';
  subject?: string;
  emailHtml?: string;
  emailText?: string;
  blogTitle?: string;
  blogMd?: string;
  sources?: unknown;
  skipReason?: string;
}

export async function insertIssue(issue: NewIssue): Promise<number> {
  const db = getTurso();
  await initIssuesTable(db);
  const slug = issue.blogTitle ? `${slugify(issue.blogTitle)}-${Date.now().toString().slice(-5)}` : null;
  const result = await db.execute({
    sql: `INSERT INTO newsletter_issues
      (client, status, subject, slug, email_html, email_text, blog_title, blog_md, sources_json, skip_reason)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      issue.client,
      issue.status,
      issue.subject ?? null,
      slug,
      issue.emailHtml ?? null,
      issue.emailText ?? null,
      issue.blogTitle ?? null,
      issue.blogMd ?? null,
      issue.sources ? JSON.stringify(issue.sources) : null,
      issue.skipReason ?? null,
    ],
  });
  return Number(result.lastInsertRowid);
}

export interface IssueRow {
  id: number;
  client: string;
  status: string;
  subject: string | null;
  slug: string | null;
  blog_title: string | null;
  blog_md: string | null;
  sources_json: string | null;
  created_at: string;
  sent_at: string | null;
}

export async function getIssueById(id: number): Promise<IssueRow | null> {
  const db = getTurso();
  await initIssuesTable(db);
  const r = await db.execute({ sql: `SELECT * FROM newsletter_issues WHERE id = ?`, args: [id] });
  return (r.rows[0] as unknown as IssueRow) ?? null;
}

export async function markIssueStatus(id: number, status: 'approved' | 'rejected' | 'sent') {
  const db = getTurso();
  await initIssuesTable(db);
  const col = status === 'sent' ? 'sent_at' : status === 'approved' ? 'approved_at' : null;
  const sql = col
    ? `UPDATE newsletter_issues SET status = ?, ${col} = datetime('now') WHERE id = ?`
    : `UPDATE newsletter_issues SET status = ? WHERE id = ?`;
  await db.execute({ sql, args: [status, id] });
}

// Atomically claims an issue for approval — only succeeds if it's still in
// 'draft'. Prevents a double-send if the approve link is hit twice at once
// (email link-scanners like Microsoft Safe Links prefetch links, and a
// person can double-click). Use this INSTEAD OF a check-then-markIssueStatus
// sequence, which has a race window between the read and the write.
export async function claimIssueForApproval(id: number): Promise<boolean> {
  const db = getTurso();
  await initIssuesTable(db);
  const result = await db.execute({
    sql: `UPDATE newsletter_issues SET status = 'approved', approved_at = datetime('now') WHERE id = ? AND status = 'draft'`,
    args: [id],
  });
  return result.rowsAffected > 0;
}

export async function getSentIssues(client: string): Promise<IssueRow[]> {
  const db = getTurso();
  await initIssuesTable(db);
  const r = await db.execute({
    sql: `SELECT * FROM newsletter_issues WHERE client = ? AND status = 'sent' ORDER BY sent_at DESC`,
    args: [client],
  });
  return r.rows as unknown as IssueRow[];
}

export async function getSentIssueBySlug(client: string, slug: string): Promise<IssueRow | null> {
  const db = getTurso();
  await initIssuesTable(db);
  const r = await db.execute({
    sql: `SELECT * FROM newsletter_issues WHERE client = ? AND slug = ? AND status = 'sent' LIMIT 1`,
    args: [client, slug],
  });
  return (r.rows[0] as unknown as IssueRow) ?? null;
}

// Same atomic-claim reasoning as claimIssueForApproval, for the reject side.
export async function claimIssueForRejection(id: number): Promise<boolean> {
  const db = getTurso();
  await initIssuesTable(db);
  const result = await db.execute({
    sql: `UPDATE newsletter_issues SET status = 'rejected' WHERE id = ? AND status = 'draft'`,
    args: [id],
  });
  return result.rowsAffected > 0;
}

// ── Subscribers (reuses the table app/api/newsletter/route.ts already writes) ──

export interface SubscriberRow {
  id: number;
  email: string;
}

export async function getActiveSubscribers(): Promise<SubscriberRow[]> {
  const db = getTurso();
  await ensureUnsubscribedColumn(db);
  const r = await db.execute(
    `SELECT id, email FROM newsletter_subscribers WHERE unsubscribed_at IS NULL`
  );
  return r.rows as unknown as SubscriberRow[];
}

export async function unsubscribeEmail(email: string) {
  const db = getTurso();
  await ensureUnsubscribedColumn(db);
  await db.execute({
    sql: `UPDATE newsletter_subscribers SET unsubscribed_at = datetime('now') WHERE email = ?`,
    args: [email],
  });
}
