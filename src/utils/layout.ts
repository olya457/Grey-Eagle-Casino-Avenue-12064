export function getLayout(
  width: number,
  height: number,
  fontScale = 1,
  left = 0,
  right = 0,
) {
  const usableWidth = Math.max(0, width - left - right);
  const compact = usableWidth < 370 || fontScale >= 1.5;
  const expanded = usableWidth >= 600 && usableWidth / fontScale >= 500;
  const gutter = compact ? 14 : expanded ? 28 : 20;
  const maxWidth = expanded ? 1120 : 680;
  const contentWidth = Math.max(
    0,
    Math.min(usableWidth, maxWidth) - gutter * 2,
  );
  return {
    width,
    height,
    fontScale,
    compact,
    expanded,
    gutter,
    maxWidth,
    contentWidth,
    short: height < 550,
    readerWidth: 760,
  };
}

export function getGridMetrics(
  width: number,
  minimum: number,
  fontScale: number,
) {
  const columns = width >= minimum * Math.min(fontScale, 1.6) * 2 + 16 ? 2 : 1;
  return {
    columns,
    itemWidth: Math.max(0, (width - (columns - 1) * 16) / columns),
  };
}
