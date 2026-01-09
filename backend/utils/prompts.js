function buildStateSummaryPrompt(state, finance, quality, target, complaints) {
  return `
You are an intelligent alert engine for a senior government dashboard.

Task:
Generate ONLY warning signals for the state: ${state}.

Input data contains:
- Financial status
- Quality inspection status
- Target vs completion status
- Complaints status

Rules:
- Output ONLY valid JSON
- No summary, no explanation
- Each warning must be ONE short sentence
- Use simple language suitable for senior officers
- Focus only on issues needing attention
- No emojis, no headings
- If no issue exists for a metric, return an empty array []

Warning patterns to detect:
- Overspending or low value-for-money
- Physical progress lagging behind targets
- Quality failures across districts
- Repeated inspection failures
- High number of unresolved complaints

Input data:

Financial:
${JSON.stringify(finance)}

Quality:
${JSON.stringify(quality)}

Target:
${JSON.stringify(target)}

Complaints:
${JSON.stringify(complaints)}

Output format (STRICT, DO NOT CHANGE):

{
  "state": "${state}",
  "data": {
    "fin": [],
    "qual": [],
    "target": [],
    "complaints": []
  }
}
`;
}

module.exports = { buildStateSummaryPrompt };
