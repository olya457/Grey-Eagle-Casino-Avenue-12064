import React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { EventCalendar } from '../src/components/EventCalendar';
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 34, left: 0, right: 0 }),
}));
jest.mock('../src/components/ui', () => ({
  Button: ({ title, onPress }: { title: string; onPress: () => void }) =>
    require('react').createElement(require('react-native').Pressable, {
      accessibilityLabel: title,
      onPress,
    }),
  IconButton: ({ label, onPress }: { label: string; onPress: () => void }) =>
    require('react').createElement(require('react-native').Pressable, {
      accessibilityLabel: label,
      onPress,
    }),
}));
test('calendar selects an exact date, clears the filter, changes months and closes', async () => {
  const select = jest.fn();
  const month = jest.fn();
  const close = jest.fn();
  let tree: ReactTestRenderer;
  await act(async () => {
    tree = create(
      <EventCalendar
        visible
        month={new Date(2026, 10, 1)}
        selected={null}
        eventDates={new Set(['2026-11-13'])}
        onSelect={select}
        onMonthChange={month}
        onClose={close}
      />,
    );
  });
  const press = async (label: string) =>
    act(async () => {
      tree.root
        .findAllByProps({ accessibilityLabel: label })[0]
        .props.onPress();
    });
  await press(new Date(2026, 10, 13).toDateString());
  expect(select).toHaveBeenLastCalledWith('2026-11-13');
  await press('Show all dates');
  expect(select).toHaveBeenLastCalledWith(null);
  await press('Next calendar month');
  expect(month).toHaveBeenLastCalledWith(new Date(2026, 11, 1));
  await press('Previous calendar month');
  expect(month).toHaveBeenLastCalledWith(new Date(2026, 9, 1));
  await press('Close calendar');
  expect(close).toHaveBeenCalledTimes(1);
  await act(async () => {
    tree.unmount();
  });
});
