export interface WhoisInfo {
  registered: boolean;
  creationDate: Date | null;
  lastUpdate: Date | null;
  whoisData: Record<string, string>;
}

const CREATION_DATE_KEYS = [
  'Creation Date',
  'created',
  'Created On',
  'Registration Time',
  'Created Date',
  'Domain Registration Date',
] as const;

/**
 * Parse a line of WHOIS data into key-value pair
 * @param line Line of text from WHOIS response
 * @returns Key-value pair or null if line doesn't contain a pair
 */
function parseWhoisLine(line: string): { key: string; value: string } | null {
  // Skip empty lines
  if (!line.trim()) {
    return null;
  }

  // Find the first colon in the line
  const colonIndex = line.indexOf(':');
  if (colonIndex === -1) {
    return null;
  }

  // Extract key and value
  const key = line.substring(0, colonIndex).trim();
  const value = line.substring(colonIndex + 1).trim();

  // Skip if key or value is empty
  if (!key || !value) {
    return null;
  }

  return { key, value };
}

/**
 * Parse raw WHOIS response into structured data
 * Only parses until ">>> Last update of" line
 * @param raw Raw WHOIS response text
 * @returns Structured WHOIS information
 */
export function parseWhoisData(raw: string): WhoisInfo {
  const whoisData: Record<string, string> = {};
  let lastUpdate: Date | null = null;

  // Split into sections by double newline and take the first section
  const sections = raw.split('\n\n');
  const firstSection = sections[0];

  // Parse each line in the first section
  const lines = firstSection.split('\n');
  for (const line of lines) {
    // Stop parsing when we hit the Last update line
    if (line.includes('>>> Last update of')) {
      const startIndex = line.indexOf('database:') + 'database:'.length;
      const endIndex =
        line.indexOf('<<<') !== -1 ? line.indexOf('<<<') : line.length;
      const dateStr = line.substring(startIndex, endIndex).trim();
      lastUpdate = parseDateSafely(dateStr);
      break; // Stop parsing after this line
    }

    // Try to parse key-value pair
    const result = parseWhoisLine(line);
    if (result) {
      whoisData[result.key] = result.value;
    }
  }

  // Parse creation date and use it to determine registration status
  const creationDateKey = CREATION_DATE_KEYS.find((key) => key in whoisData);
  const creationDate = creationDateKey
    ? parseDateSafely(whoisData[creationDateKey])
    : null;

  // If we have a valid creation date, the domain is registered
  const registered = creationDate !== null;

  return {
    registered,
    creationDate,
    lastUpdate,
    whoisData,
  };
}

/**
 * Safely parse a date string, returning null if parsing fails
 * @param dateStr Date string to parse
 * @returns Date object or null if parsing fails
 */
function parseDateSafely(dateStr: string): Date | null {
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}
