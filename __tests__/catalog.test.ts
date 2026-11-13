import { assets, events, menu, rooms, tours, venues } from '../src/data';
import { filterEvents } from '../src/utils/events';
test('every supplied event and room has a bundled local image', () => {
  expect(events.filter(item => !item.fields.Schedule)).toHaveLength(36);
  expect(rooms).toHaveLength(5);
  for (const item of [...events, ...rooms, ...venues]) {
    expect(assets[item.image!]).toBeDefined();
    expect(item.image).toMatch(/^grey-eagle-[a-z0-9-]+\.png$/);
    expect(item.image).not.toMatch(/casino/i);
    expect(item.description.length).toBeGreaterThan(30);
  }
});
test('menu has all supplied items, unique IDs and valid venues', () => {
  expect(menu).toHaveLength(169);
  expect(new Set(menu.map(item => item.id)).size).toBe(menu.length);
  for (const item of menu) {
    expect(venues.some(venue => venue.id === item.venueId)).toBe(true);
    expect(item.price).toMatch(/^\$/);
  }
  expect(tours).toHaveLength(8);
});
test('event search combines title, category and exact date', () => {
  expect(
    filterEvents(events, '  dean ray ', 'Live Music', '2026-11-13').map(
      item => item.id,
    ),
  ).toEqual(['events-1']);
  expect(filterEvents(events, 'dean ray', 'Comedy', null)).toEqual([]);
  expect(filterEvents(events, 'not-a-real-performer', 'All', null)).toEqual([]);
  expect(filterEvents(events, '', 'All', null)).toHaveLength(events.length);
});
