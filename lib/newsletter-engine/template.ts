// lib/newsletter-engine/template.ts
// Phase 1: renders the draft-review email sent to James after each cron run.
// Phase 2 will add signed approve/reject links to this same template.

import { newsletterConfig } from './config';
import type { GenerateResult } from './generate';

export function renderDraftReviewEmail(
  result: GenerateResult,
  issueId: number,
  links?: { approveUrl: string; rejectUrl: string }
): { subject: string; html: string; text: string } {
  const { brand, brandName } = { brand: newsletterConfig.brand, brandName: newsletterConfig.brandName };

  if (result.skip) {
    return {
      subject: `[${brandName} Newsletter] Skipped this cycle — #${issueId}`,
      html: `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:24px;background:${brand.beige}">
        <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden">
          <div style="background:${brand.sage};color:#fff;padding:20px 24px"><strong>${brandName} Newsletter — Skipped</strong></div>
          <div style="padding:24px;color:#222">
            <p>Issue #${issueId} was skipped this cycle instead of padding with filler.</p>
            <p><strong>Reason:</strong> ${escapeHtml(result.reason)}</p>
          </div>
        </div></body></html>`,
      text: `${brandName} Newsletter — Skipped (Issue #${issueId})\n\nReason: ${result.reason}`,
    };
  }

  const itemsHtml = result.items
    .map(
      (it) => `<div style="margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid #eee">
        <div style="font-weight:600;color:${brand.sage};margin-bottom:6px">${escapeHtml(it.headline)}</div>
        <div style="color:#333;line-height:1.5">${escapeHtml(it.body)}</div>
        <div style="margin-top:6px;font-size:12px;color:#999">via ${escapeHtml(it.sourceDomain)} — <a href="${escapeHtml(it.sourceUrl)}" style="color:${brand.gold}">${escapeHtml(it.sourceUrl)}</a></div>
      </div>`
    )
    .join('');

  const itemsText = result.items
    .map((it) => `• ${it.headline}\n  ${it.body}\n  via ${it.sourceDomain} (${it.sourceUrl})`)
    .join('\n\n');

  const buttonsHtml = links
    ? `<div style="margin-top:24px">
        <a href="${links.approveUrl}" style="display:inline-block;background:${brand.gold};color:#fff;text-decoration:none;padding:12px 24px;border-radius:4px;font-weight:600;margin-right:12px">Approve &amp; Send</a>
        <a href="${links.rejectUrl}" style="display:inline-block;color:#999;text-decoration:underline;padding:12px 0">Reject</a>
      </div>`
    : '';
  const linksText = links ? `\n\nApprove & send: ${links.approveUrl}\nReject: ${links.rejectUrl}` : '';

  return {
    subject: `[${brandName} Newsletter] Draft ready to review — #${issueId}`,
    html: `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:24px;background:${brand.beige}">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden">
        <div style="background:${brand.sage};color:#fff;padding:20px 24px">
          <strong>${brandName} Newsletter — Draft #${issueId}</strong>
        </div>
        <div style="padding:24px;color:#222">
          <p style="margin-top:0"><strong>Subject line:</strong> ${escapeHtml(result.subject)}</p>
          ${itemsHtml}
          <p style="margin-top:24px"><strong>Blog post title:</strong> ${escapeHtml(result.blogTitle)}</p>
          ${buttonsHtml}
          <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
          <p style="font-size:12px;color:#999">Issue stored in Turso as newsletter_issues #${issueId}, status: draft. Links expire in 7 days.</p>
        </div>
      </div></body></html>`,
    text: `${brandName} Newsletter — Draft #${issueId}\n\nSubject line: ${result.subject}\n\n${itemsText}\n\nBlog post title: ${result.blogTitle}${linksText}`,
  };
}

// ── Final subscriber-facing send (Phase 2) ─────────────────────────────────

export function renderSubscriberEmail(
  subject: string,
  items: { headline: string; body: string; sourceUrl: string; sourceDomain: string }[],
  unsubscribeUrl: string
): { html: string; text: string } {
  const { brand, brandName } = { brand: newsletterConfig.brand, brandName: newsletterConfig.brandName };

  const itemsHtml = items
    .map(
      (it) => `<div style="margin-bottom:22px">
        <div style="font-weight:600;color:${brand.sage};font-size:16px;margin-bottom:6px">${escapeHtml(it.headline)}</div>
        <div style="color:#333;line-height:1.6">${escapeHtml(it.body)}</div>
        <div style="margin-top:6px;font-size:12px;color:#999">via ${escapeHtml(it.sourceDomain)}</div>
      </div>`
    )
    .join('');

  const itemsText = items.map((it) => `${it.headline}\n${it.body}\n(via ${it.sourceDomain})`).join('\n\n');

  return {
    html: `<!DOCTYPE html><html><body style="font-family:Georgia,serif;padding:0;margin:0;background:${brand.beige}">
      <div style="max-width:600px;margin:0 auto;background:#fff">
        <div style="background:${brand.sage};color:#fff;padding:32px 24px;text-align:center">
          <div style="font-size:22px;letter-spacing:1px">${brandName}</div>
        </div>
        <div style="padding:32px 24px;color:#222">
          ${itemsHtml}
          <hr style="margin:28px 0;border:none;border-top:1px solid #eee"/>
          <p style="font-size:13px;color:#888;text-align:center">
            ${newsletterConfig.founderFirstName} &amp; the ${brandName} team — New Orleans<br/>
            <a href="${unsubscribeUrl}" style="color:#888">Unsubscribe</a>
          </p>
        </div>
      </div></body></html>`,
    text: `${brandName}\n\n${itemsText}\n\n${newsletterConfig.founderFirstName} & the ${brandName} team — New Orleans\nUnsubscribe: ${unsubscribeUrl}`,
  };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}
