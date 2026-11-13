import { getGridMetrics, getLayout } from '../src/utils/layout';
test.each([
  [320, 568],
  [375, 667],
  [393, 852],
  [626, 890],
  [890, 626],
  [1024, 768],
])('cards fit the %i by %i window and its safe areas', (width, height) => {
  const layout = getLayout(width, height, 1, 12, 12);
  const grid = getGridMetrics(layout.contentWidth, 260, 1);
  expect(layout.contentWidth + layout.gutter * 2 + 24).toBeLessThanOrEqual(
    width,
  );
  expect(
    grid.itemWidth * grid.columns + (grid.columns - 1) * 16,
  ).toBeLessThanOrEqual(layout.contentWidth);
  expect(grid.itemWidth).toBeGreaterThan(0);
});
test('folding and split-window resizing return to a single column', () => {
  expect(getGridMetrics(getLayout(626, 890).contentWidth, 260, 1).columns).toBe(
    2,
  );
  expect(getGridMetrics(getLayout(320, 890).contentWidth, 260, 1).columns).toBe(
    1,
  );
  expect(getGridMetrics(getLayout(890, 626).contentWidth, 260, 1).columns).toBe(
    2,
  );
});
test('large text and short landscape layouts keep usable space', () => {
  expect(getLayout(626, 890, 2).expanded).toBe(false);
  expect(
    getGridMetrics(getLayout(626, 890, 2).contentWidth, 260, 2).columns,
  ).toBe(1);
  expect(getLayout(667, 375, 1, 44, 44).short).toBe(true);
});
