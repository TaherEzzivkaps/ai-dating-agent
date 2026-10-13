# Quick Screen Prompt (Stage 1)

## Goal
Screen all N(N-1)/2 candidate pairs rapidly using a fast model to compute an affinity vector and filter down to the top 5 date candidates.

## Input
Compact profiles of Person A and Person B containing: Summary, Needs, Interests, Values, and Lifestyle.

## Output Schema
```json
{
  "score": 0-100,
  "shared": ["shared interest 1", "shared interest 2"],
  "tension": ["friction point 1"],
  "rationale": "One-sentence rationale summarizing their fundamental alignment."
}
```
