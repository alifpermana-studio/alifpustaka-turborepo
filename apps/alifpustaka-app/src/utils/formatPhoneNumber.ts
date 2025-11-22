export function formatPhoneNumber(raw: string): string {
  // Extract country code (assume + followed by 2 or 3 digits)
  const match = raw.match(/^\(\+(\d{1,4})\)/);
  if (!match) return raw;

  const countryCode = match[1];
  const rest = raw.slice(match[0].length); // remove "(+62)"

  const provider = rest.slice(0, 3);
  const remaining = rest.slice(3);

  const chunks: string[] = [];
  for (let i = 0; i < remaining.length; i += 4) {
    chunks.push(remaining.slice(i, i + 4));
  }

  return `(+${countryCode}) ${provider} ${chunks.join(' ')}`;
}
