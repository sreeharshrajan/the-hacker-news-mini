export function formatText(rawText?: string | null): string {
  if (!rawText) return '';

  // Basic HTML escaping for server safety
  const escapeHtml = (str: string) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Simple newline to <br> conversion
  let text = escapeHtml(rawText)
    .replace(/\n/g, '<br>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>');

  return text;
}