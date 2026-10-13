# Match Ranking & Explanation Prompt (Stage 3)

## Goal
Generate clear, evidence-grounded fit explanations and friction warnings for ranked candidates.

## Scoring Formula
```text
if full date happened:
  score = 0.55 * P_verdict + 0.20 * C_verdict + 0.25 * screen_score
else:
  score = screen_score * 0.8  (marked 'screened only')
```

## Output Schema
```json
{
  "why_fits": "2 to 3 sentences referencing concrete evidence from both profiles.",
  "watch_out": "Exactly 1 sentence noting prospective lifestyle, communication, or schedule friction."
}
```
