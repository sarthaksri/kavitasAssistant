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
- Quality inspection failures
- High number of unresolved complaints

Input data:

Financial:
${JSON.stringify(finance)}

Quality inspection status:

Definitions:
- SQM = State Quality Monitor inspections
- NQM = National Quality Monitor inspections
- Failure means inspection marked as "unsatisfactory"

Quality data:
${JSON.stringify(quality)}

Quality warning rules:
- Evaluate SQM and NQM separately
- Each warning must clearly mention SQM or NQM
- If no quality issue exists, return an empty array

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