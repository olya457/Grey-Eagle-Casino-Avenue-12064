import { calendarDays, dateKey } from '../src/utils/calendar';
import { expandEventSchedule } from '../src/utils/eventSchedule';
import { events, CatalogItem } from '../src/data';
test('calendar uses Monday-first weeks and valid local dates', () => {
  const days = calendarDays(new Date(2026, 10, 1));
  expect(days.slice(0, 6)).toEqual(Array(6).fill(null));
  expect(dateKey(days[6]!)).toBe('2026-11-01');
  expect(days.filter(Boolean)).toHaveLength(30);
  expect(calendarDays(new Date(2028, 1, 1)).filter(Boolean)).toHaveLength(29);
});
test('all supplied shows occur in each of the six months with distinct IDs', () => {
  const originals = events.filter(item => !item.fields.Schedule);
  for (const month of [
    '2026-11',
    '2026-12',
    '2027-01',
    '2027-02',
    '2027-03',
    '2027-04',
  ]) {
    const scheduled = events.filter(item => item.date?.startsWith(month));
    expect(scheduled).toHaveLength(originals.length);
    expect(new Set(scheduled.map(item => item.title))).toEqual(
      new Set(originals.map(item => item.title)),
    );
  }
  expect(new Set(events.map(item => item.id)).size).toBe(events.length);
  for (const original of originals)
    expect(events.find(item => item.id === original.id)).toEqual(original);
});
test('repetition clamps end-of-month dates and retains show times', () => {
  const source = [
    {
      id: 'show',
      title: 'Show',
      image: null,
      description: '',
      sections: {},
      date: '2026-12-31',
      fields: { Date: 'Dec 31', 'Show time': '8 PM' },
    },
  ] as CatalogItem[];
  const result = expandEventSchedule(source);
  expect(
    result.find(item => item.date === '2027-02-28')?.fields['Show time'],
  ).toBe('8 PM');
  expect(result).toHaveLength(6);
});
