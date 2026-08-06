/**
 * Date Utilities
 */

export const getTopRecentItems = <T extends { date: string }>(items: T[], limit: number = 3): T[] => {
  return [...items]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};
