import type { CatalogItem } from '../data';
import { dateKey } from './calendar';
export function expandEventSchedule(
  source: CatalogItem[],
  monthCount = 6,
): CatalogItem[] {
  const firstDate = source
    .flatMap(item => (item.date ? [item.date] : []))
    .sort()[0];
  if (!firstDate) return source;
  const [year, month] = firstDate.split('-').map(Number);
  const result = [...source];
  for (const event of source) {
    if (!event.date) continue;
    const day = Number(event.date.slice(8, 10));
    for (let offset = 0; offset < monthCount; offset++) {
      const targetMonth = new Date(year, month - 1 + offset, 1);
      const lastDay = new Date(
        targetMonth.getFullYear(),
        targetMonth.getMonth() + 1,
        0,
      ).getDate();
      const target = new Date(
        targetMonth.getFullYear(),
        targetMonth.getMonth(),
        Math.min(day, lastDay),
      );
      const key = dateKey(target);
      if (key === event.date) continue;
      result.push({
        ...event,
        id: `${event.id}-${key}`,
        date: key,
        fields: {
          ...event.fields,
          Date: target.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          Schedule: 'Repeated listing. Confirm this date with the venue.',
        },
      });
    }
  }
  return result.sort(
    (a, b) =>
      (a.date || '').localeCompare(b.date || '') || a.id.localeCompare(b.id),
  );
}
