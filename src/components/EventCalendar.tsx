import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotionPressable as Pressable } from './Motion';
import { Button, IconButton } from './ui';
import { calendarDays, dateKey } from '../utils/calendar';
import { colors, s } from '../theme';
export function EventCalendar({
  visible,
  month,
  selected,
  eventDates,
  onMonthChange,
  onSelect,
  onClose,
}: {
  visible: boolean;
  month: Date;
  selected: string | null;
  eventDates: Set<string>;
  onMonthChange: (month: Date) => void;
  onSelect: (date: string | null) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={[
          c.overlay,
          {
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 12,
            paddingLeft: insets.left + 12,
            paddingRight: insets.right + 12,
          },
        ]}
      >
        <View style={c.sheet} accessibilityViewIsModal>
          <ScrollView contentContainerStyle={c.content}>
            <View style={s.between}>
              <Text style={s.heading}>Choose a date</Text>
              <IconButton
                name="close"
                label="Close calendar"
                onPress={onClose}
              />
            </View>
            <View style={s.between}>
              <IconButton
                name="back"
                label="Previous calendar month"
                onPress={() =>
                  onMonthChange(
                    new Date(month.getFullYear(), month.getMonth() - 1, 1),
                  )
                }
              />
              <Text style={[s.cardTitle, c.month]}>
                {month.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
              <IconButton
                name="next"
                label="Next calendar month"
                onPress={() =>
                  onMonthChange(
                    new Date(month.getFullYear(), month.getMonth() + 1, 1),
                  )
                }
              />
            </View>
            <View style={c.grid}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <Text key={index} style={[c.weekday, s.small]}>
                  {day}
                </Text>
              ))}
            </View>
            <View style={c.grid}>
              {calendarDays(month).map((day, index) => {
                if (!day) return <View key={`empty-${index}`} style={c.cell} />;
                const key = dateKey(day);
                return (
                  <Pressable
                    key={key}
                    accessibilityRole="button"
                    accessibilityLabel={day.toDateString()}
                    accessibilityState={{ selected: selected === key }}
                    onPress={() => onSelect(key)}
                    style={[c.cell, selected === key && c.selected]}
                  >
                    <Text style={c.number}>{day.getDate()}</Text>
                    <View
                      style={[c.dot, { opacity: eventDates.has(key) ? 1 : 0 }]}
                    />
                  </Pressable>
                );
              })}
            </View>
            <Text style={[s.small, c.legend]}>
              Dots indicate days with events.
            </Text>
            <Button
              title="Show all dates"
              secondary
              onPress={() => onSelect(null)}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
const c = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000b8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '100%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    overflow: 'hidden',
  },
  content: { padding: 12, gap: 12 },
  month: { flex: 1, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  weekday: { width: '14.285714%', textAlign: 'center', paddingVertical: 6 },
  cell: {
    width: '14.285714%',
    minHeight: 48,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  selected: { backgroundColor: '#43568c' },
  number: { color: colors.text, fontSize: 16, fontWeight: '600' },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: 4,
  },
  legend: { textAlign: 'center', marginBottom: 6 },
});
