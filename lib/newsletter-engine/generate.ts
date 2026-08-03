// lib/newsletter-engine/generate.ts
// One Anthropic API call (Sonnet + web_search tool) researches the client's
// niche and drafts a sourced newsletter issue + matching blog post. Returns a
// structured result or a "skip" when the research doesn't clear the bar.

import { newsletterConfig } from './config';

export interface GeneratedIssue {
  skip: true;
  reason: string;
}

export interface GeneratedContent {
  skip: false;
  subject: string;
  items: { headline: string; body: string; sourceUrl: string; sourceDomain: string }[];
  blogTitle: string;
  blogMd: string;
}

export type GenerateResult = GeneratedIssue | GeneratedContent;

const SYSTEM_PROMPT = `You write a monthly newsletter + matching blog post for ${newsletterConfig.brandName}, a ${newsletterConfig.niche} brand.

Audience: ${newsletterConfig.audience}
Tone: ${newsletterConfig.tone}
Never cover: ${newsletterConfig.bannedTopics.join('; ')}.

Rules:
- Research using web_search first. Every item you include must trace to a real, current source you found — if you cannot verify an item, omit it. Never invent facts, studies, or quotes.
- Write for ${newsletterConfig.brandName}'s customers, not for marketers. No listicle filler, no generic "5 tips" padding.
- Between ${newsletterConfig.guardrails.minItems} and ${newsletterConfig.guardrails.maxItems} items. If web search doesn't turn up enough genuinely good, sourced material, that's a SKIP — a skipped month beats a junk issue.
- Good example: a specific, dated finding or trend with a real source, explained in your own voice for this audience.
- Counter-example to avoid: "Top 5 skincare tips for summer!" — generic listicle filler with no sourcing.

Respond with ONLY a single JSON object, no markdown fences, no preamble, no text before or after it. Shape:

If skipping:
{"skip": true, "reason": "<why>"}

If producing an issue:
{
  "skip": false,
  "subject": "<email subject line, no clickbait>",
  "items": [
    {"headline": "<short headline>", "body": "<2-4 sentences, this brand's voice>", "sourceUrl": "<url>", "sourceDomain": "<domain shown as 'via {domain}'>"}
  ],
  "blogTitle": "<blog post title>",
  "blogMd": "<full blog post in markdown, expanding on the same items for the site's /news page>"
}`;

export async function generateIssue(): Promise<GenerateResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Research and draft this month's issue for ${newsletterConfig.brandName}. Today's date context matters — only use current, real findings.`,
        },
      ],
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Anthropic API error ${res.status}: ${errText.slice(0, 500)}`);
  }

  const data = await res.json();

  const textBlocks = (data.content ?? [])
    .filter((b: { type: string }) => b.type === 'text')
    .map((b: { text: string }) => b.text);
  const finalText = textBlocks[textBlocks.length - 1] ?? '';

  const cleaned = finalText.replace(/^```json\s*|\s*```$/g, '').trim();

  let parsed: GenerateResult;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Could not parse model output as JSON: ${cleaned.slice(0, 300)}`);
  }

  return parsed;
}
