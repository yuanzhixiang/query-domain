/**
 * Sleep for the specified number of milliseconds
 * @param ms Time to sleep in milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
