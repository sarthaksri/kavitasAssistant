function buildStateSummaryPrompt(state, finance, quality, target) {
    return `
  You are an executive assistant to a senior government officer (age ~55).
  
  Summarize the status of rural road implementation in ${state}.
  
  Rules:
  - Keep it concise (max 6–8 lines)
  - No technical jargon
  - Focus on risks and required attention
  - No raw numbers unless essential
  
  Financial signals:
  ${JSON.stringify(finance)}
  
  Quality signals:
  ${JSON.stringify(quality)}
  
  Target signals:
  ${JSON.stringify(target)}
  
  Structure:
  1. Overall status
  2. Financial concern (if any)
  3. Quality concern (if any)
  4. Target/slippage concern (if any)
  5. Suggested intervention
  `;
  }
  
  module.exports = { buildStateSummaryPrompt };
  