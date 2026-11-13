import { assets } from '../src/data';
import { resources, filterResources } from '../src/data/resources';
test('all eight resources have stable unique ids, source links and local artwork', () => {
  expect(resources).toHaveLength(8);
  expect(new Set(resources.map(item => item.id)).size).toBe(8);
  expect(resources.filter(item => item.kind === 'Video')).toHaveLength(2);
  for (const item of resources) {
    expect(item.url).toMatch(/^https:\/\//);
    expect(assets[item.image]).toBeDefined();
    expect(item.publisher.length).toBeGreaterThan(0);
  }
});
test('reading-list filters combine source search, topic, format and bookmarks', () => {
  expect(
    filterResources(' buffalo ', 'Culture', 'Video', true, [
      'embrace-buffalo',
    ]).map(item => item.id),
  ).toEqual(['embrace-buffalo']);
  expect(filterResources('buffalo', 'Dining', 'Video', false, [])).toEqual([]);
  expect(filterResources('', 'All topics', 'All', true, [])).toEqual([]);
  expect(
    filterResources('Tourism Calgary', 'All topics', 'Article', false, []),
  ).toHaveLength(3);
});
