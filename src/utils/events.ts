import { CatalogItem } from '../data';
export function eventCategory(item: CatalogItem) {
  const value = item.fields.Category;
  return /comedy/i.test(value)
    ? 'Comedy'
    : /Live Music|Country Music/.test(value)
    ? 'Live Music'
    : /Show|Theatrical|Drag/.test(value)
    ? 'Shows'
    : 'Concerts';
}
export function filterEvents(
  items: CatalogItem[],
  query: string,
  category: string,
  date: string | null,
) {
  return items.filter(
    item =>
      (!query.trim() ||
        `${item.title} ${item.description} ${item.fields.Location}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())) &&
      (category === 'All' || eventCategory(item) === category) &&
      (!date || item.date === date),
  );
}
