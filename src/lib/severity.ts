export function getSeverityLabel(score: number): string {
  if (score <= 2) return "Mild Discomfort";
  if (score <= 4) return "Needs Work";
  if (score <= 6) return "Genuinely Concerning";
  if (score <= 8) return "Code Crime";
  return "War Crimes";
}

export function getSeverityColor(score: number): string {
  if (score <= 2) return "#4ade80"; // green
  if (score <= 4) return "#facc15"; // yellow
  if (score <= 6) return "#fb923c"; // orange
  if (score <= 8) return "#f87171"; // red
  return "#FF4500";                 // flame
}

export function getSeverityEmoji(score: number): string {
  if (score <= 2) return "😬";
  if (score <= 4) return "😤";
  if (score <= 6) return "🤬";
  if (score <= 8) return "💀";
  return "☠️";
}