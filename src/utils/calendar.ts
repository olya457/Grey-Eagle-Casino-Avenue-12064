export const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
export function calendarDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const count = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const offset = (first.getDay() + 6) % 7;
  return Array.from(
    { length: Math.ceil((count + offset) / 7) * 7 },
    (_, index) => {
      const day = index - offset + 1;
      return day > 0 && day <= count
        ? new Date(month.getFullYear(), month.getMonth(), day)
        : null;
    },
  );
}
