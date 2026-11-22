import { EventCalendar } from '../components/EventCalendar';
import { dateKey } from '../utils/calendar';
import { AdaptiveGrid } from '../components/AdaptiveGrid';
import { MotionPressable as Pressable } from '../components/Motion';
import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Gradient as LinearGradient } from '../components/Gradient';
import { assets, CatalogItem, events } from '../data';
import { Brand, Chips, Empty, Screen } from '../components/ui';
import { Icon } from '../components/Icon';
import { colors, s } from '../theme';
import { RootParams } from '../navigation/types';
import { eventCategory, filterEvents } from '../utils/events';
export function EventsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootParams>>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const eventDates = useMemo(
    () => new Set(events.flatMap(item => (item.date ? [item.date] : []))),
    [],
  );
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [date, setDate] = useState<string | null>(null);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const { width } = useWindowDimensions();
  const filtered = useMemo(
    () => filterEvents(events, query, category, date),
    [query, category, date],
  );
  const featured = events
    .filter(
      item =>
        item.date?.startsWith(dateKey(month).slice(0, 7)) &&
        eventCategory(item) !== 'Live Music',
    )
    .slice(0, 3);
  const days = Array.from(
    {
      length: new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(),
    },
    (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1),
  );
  const open = (item: CatalogItem) =>
    navigation.navigate('EventDetail', { id: item.id });
  const reset = () => {
    setQuery('');
    setCategory('All');
    setDate(null);
  };
  return (
    <Screen>
      <EventCalendar
        visible={calendarOpen}
        month={month}
        selected={date}
        eventDates={eventDates}
        onMonthChange={setMonth}
        onClose={() => setCalendarOpen(false)}
        onSelect={value => {
          setDate(value);
          setCalendarOpen(false);
        }}
      />
      <View style={s.between}>
        <View style={s.fill}>
          <Text style={s.label}>GREY EAGLE · AVENUE</Text>
          <Text style={s.title}>Events</Text>
        </View>
        <Brand compact />
      </View>
      <View style={e.search}>
        <Icon name="search" size={18} />
        <TextInput
          style={e.searchInput}
          placeholder="Search events, artists, venues"
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          accessibilityLabel="Search events"
          returnKeyType="search"
        />
        {!!query && (
          <Pressable
            onPress={() => setQuery('')}
            accessibilityLabel="Clear search"
            hitSlop={10}
          >
            <Icon name="close" size={18} />
          </Pressable>
        )}
      </View>
      <View style={[s.between, { marginTop: 16, flexWrap: 'wrap' }]}>
        <Text style={[s.cardTitle, { fontSize: 14 }]}>
          {month.toLocaleDateString('en-CA', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <View style={[s.row, { gap: 6 }]}>
          <Pressable
            accessibilityLabel="Previous month"
            onPress={() => {
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
              setDate(null);
            }}
            style={e.monthButton}
          >
            <Icon name="back" size={16} />
          </Pressable>
          <Pressable
            accessibilityLabel="Next month"
            onPress={() => {
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
              setDate(null);
            }}
            style={e.monthButton}
          >
            <Icon name="next" size={16} />
          </Pressable>
          <Pressable
            onPress={() => setCalendarOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Open date calendar"
            style={{ minHeight: 44, justifyContent: 'center' }}
          >
            <Text style={{ color: colors.accent, fontSize: 12 }}>
              All dates
            </Text>
          </Pressable>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={e.dates}
      >
        {days.map(day => {
          const key = dateKey(day);
          const hasEvents = events.some(item => item.date === key);
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityLabel={day.toDateString()}
              accessibilityState={{ selected: date === key }}
              onPress={() => setDate(date === key ? null : key)}
              style={[e.day, date === key && e.dayActive]}
            >
              <Text style={s.small}>
                {day.toLocaleDateString('en', { weekday: 'short' })}
              </Text>
              <Text style={e.dayNumber}>{day.getDate()}</Text>
              <View
                style={[
                  e.eventDot,
                  {
                    backgroundColor: hasEvents ? colors.accent : 'transparent',
                  },
                ]}
              />
            </Pressable>
          );
        })}
      </ScrollView>
      <Chips
        values={['All', 'Concerts', 'Live Music', 'Comedy', 'Shows']}
        selected={category}
        onChange={setCategory}
      />
      {!query && !date && category === 'All' && (
        <>
          <View style={s.between}>
            <Text style={s.heading}>Featured this month</Text>
            <Text style={s.small}>{featured.length} picks</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {featured.map(item => (
              <Pressable
                key={item.id}
                onPress={() => open(item)}
                accessibilityRole="button"
                accessibilityLabel={item.title}
                style={[
                  s.card,
                  { width: Math.min(width * 0.68, 280), minHeight: 290 },
                ]}
              >
                <Image
                  source={assets[item.image!]}
                  style={[
                    StyleSheet.absoluteFill,
                    { width: '100%', height: '100%' },
                  ]}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['#00000000', '#00000022', '#000000ee']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={e.featureCategory}>
                  <Text style={{ color: colors.text, fontSize: 11 }}>
                    {eventCategory(item)}
                  </Text>
                </View>
                <View style={e.featureCopy}>
                  <Text style={s.cardTitle}>{item.title}</Text>
                  <Text style={[s.small, { marginTop: 8 }]}>
                    {item.fields.Date}
                  </Text>
                  <Text
                    style={{
                      color: colors.accent,
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    {item.sections['Event information']
                      .find(line => line.startsWith('Tickets:'))
                      ?.replace('Tickets: ', '')}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </>
      )}
      <View style={s.between}>
        <Text style={[s.heading, s.fill]}>
          {query
            ? `Results for “${query}”`
            : date
            ? 'Events on selected date'
            : 'Upcoming events'}
        </Text>
        <Text style={s.small}>{filtered.length} events</Text>
      </View>
      {!filtered.length && (
        <Empty
          icon="search"
          title="No events match"
          description="Try another date, category or search term."
          action="Show all events"
          onPress={reset}
        />
      )}
      <AdaptiveGrid>
        {filtered.map(item => (
          <Pressable
            key={item.id}
            onPress={() => open(item)}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            style={[s.card, e.eventCard]}
          >
            <Image source={assets[item.image!]} style={e.thumb} />
            <View style={s.fill}>
              <Text
                style={[
                  s.label,
                  { fontSize: 9, letterSpacing: 0.4, marginBottom: 5 },
                ]}
              >
                {eventCategory(item)} · {item.fields.Date}
              </Text>
              <Text style={[s.cardTitle, { fontSize: 15 }]}>{item.title}</Text>
              <Text numberOfLines={2} style={[s.small, { marginTop: 5 }]}>
                {item.description}
              </Text>
              <Text style={[s.small, { fontSize: 10, marginTop: 5 }]}>
                {item.fields['Show time']} · {item.fields.Location}
              </Text>
            </View>
          </Pressable>
        ))}
      </AdaptiveGrid>
    </Screen>
  );
}
const e = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#1c1e26',
    borderRadius: 14,
    gap: 8,
  },
  searchInput: { flex: 1, minHeight: 46, color: colors.text, fontSize: 13 },
  dates: { gap: 7, paddingVertical: 12 },
  day: {
    minWidth: 43,
    padding: 8,
    borderRadius: 15,
    backgroundColor: '#12141b',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#242735',
  },
  dayActive: { backgroundColor: '#43568c', borderColor: '#9cb2ff' },
  dayNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 4,
  },
  eventDot: { width: 4, height: 4, borderRadius: 2 },
  monthButton: {
    height: 44,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCategory: {
    alignSelf: 'flex-start',
    margin: 12,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#141928b0',
  },
  featureCopy: { padding: 14, paddingTop: 100, marginTop: 'auto' },
  eventCard: { padding: 9, flexDirection: 'row', gap: 12, borderRadius: 20 },
  thumb: { width: 86, height: 112, borderRadius: 13 },
});
