import "server-only";
import type { Content } from "./schema";

const FIVE_MIN = 5 * 60;

export type LeetCodeStats = {
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  totals: { easy: number; medium: number; hard: number } | null;
  ranking: number | null;
  live: boolean;
};

export async function getLeetCode(widgets: Content["widgets"]): Promise<LeetCodeStats> {
  const fallback: LeetCodeStats = { ...widgets.leetcodeFallback, totals: null, ranking: null, live: false };
  if (!widgets.leetcodeUsername) return fallback;
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (portfolio stats widget)",
      },
      body: JSON.stringify({
        query: `query($u: String!) {
          matchedUser(username: $u) {
            profile { ranking }
            submitStatsGlobal { acSubmissionNum { difficulty count } }
          }
          allQuestionsCount { difficulty count }
        }`,
        variables: { u: widgets.leetcodeUsername },
      }),
      next: { revalidate: FIVE_MIN, tags: ["leetcode"] },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return fallback;
    type Row = { difficulty: string; count: number };
    const json = (await res.json()) as {
      data?: {
        matchedUser: { profile: { ranking: number }; submitStatsGlobal: { acSubmissionNum: Row[] } } | null;
        allQuestionsCount: Row[];
      };
    };
    const user = json.data?.matchedUser;
    if (!user) return fallback;
    const pick = (rows: Row[], d: string) => rows.find((r) => r.difficulty === d)?.count ?? 0;
    const ac = user.submitStatsGlobal.acSubmissionNum;
    const all = json.data?.allQuestionsCount ?? [];
    return {
      solved: pick(ac, "All"),
      easy: pick(ac, "Easy"),
      medium: pick(ac, "Medium"),
      hard: pick(ac, "Hard"),
      totals: all.length ? { easy: pick(all, "Easy"), medium: pick(all, "Medium"), hard: pick(all, "Hard") } : null,
      ranking: user.profile?.ranking ?? null,
      live: true,
    };
  } catch {
    return fallback;
  }
}
