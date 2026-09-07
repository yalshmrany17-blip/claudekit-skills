import { z } from "zod";

export const FeedbackSummarySchema = z.object({
  keep_themes: z.array(z.object({ theme: z.string(), count: z.number(), quotes: z.array(z.string()) })),
  change_themes: z.array(z.object({ theme: z.string(), count: z.number(), quotes: z.array(z.string()) })),
  best_pattern: z.string(),
  blind_spots: z.array(z.string()),
  open_area: z.array(z.string()),
  advice: z.string(),
});

export const IdentityReviewSchema = z.object({
  clarity_score: z.number(),
  verdict: z.string(),
  strengths: z.array(z.string()),
  issues: z.array(z.object({ field: z.string(), problem: z.string(), suggestion: z.string() })),
  contradictions: z.array(z.string()),
  next_edit: z.string(),
});
