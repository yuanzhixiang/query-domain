/**
 * Extract domain from URL or return cleaned domain
 * Handles comments after domain with "// " pattern
 */
export const cleanDomain = (input: string): string => {
  const trimmed = input.trim();
  
  // Check for comments pattern "// "
  const commentIndex = trimmed.indexOf('// ');
  if (commentIndex >= 0) {
    const beforeComment = trimmed.substring(0, commentIndex).trim();
    // If there's nothing before the comment, return the whole line
    if (!beforeComment) {
      return trimmed;
    }
    // Otherwise process the part before the comment
    input = beforeComment;
  }

  try {
    // If input is a URL, extract the domain
    if (input.startsWith('http://') || input.startsWith('https://')) {
      const url = new URL(input);
      return url.hostname;
    }
    // Otherwise return the cleaned domain
    return input.trim();
  } catch {
    // If URL parsing fails, return the original input
    return input.trim();
  }
};
