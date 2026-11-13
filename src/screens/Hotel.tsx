import { AdaptiveGrid } from '../components/AdaptiveGrid';
import { MotionPressable as Pressable } from '../components/Motion';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { assets, facilities, rooms } from '../data';
import {
  Badge,
  Facts,
  Hero,
  IconButton,
  InfoTable,
  Screen,
  Segments,
} from '../components/ui';
import { Icon } from '../components/Icon';
import { colors, s } from '../theme';
import { RootParams } from '../navigation/types';
export function HotelScreen() {
  const [tab, setTab] = useState(0);
  const navigation = useNavigation<NativeStackNavigationProp<RootParams>>();
  return (
    <Screen top={false}>
      <Hero
        source={assets['grey-eagle-resort-exterior.png']}
        title="Hotel & Rooms"
        label="GREY EAGLE RESORT"
        subtitle="Contemporary rooms steps from the casino floor and Event Centre."
        height={340}
      />
      <Facts
        highlightFirst
        entries={[
          [String(rooms.length), 'Room types'],
          ['178', 'Guest rooms'],
          ['3 PM', 'Check-in'],
          ['11 AM', 'Check-out'],
        ]}
      />
      <Segments
        values={['Rooms & Suites', 'Facilities']}
        selected={tab}
        onChange={setTab}
      />
      {tab === 0 ? (
        <AdaptiveGrid>
          {rooms.map(room => (
            <Pressable
              key={room.id}
              accessibilityRole="button"
              accessibilityLabel={`View ${room.title}`}
              onPress={() => navigation.navigate('RoomDetail', { id: room.id })}
              style={s.card}
            >
              <View>
                <Image
                  source={assets[room.image!]}
                  style={{ height: 200, width: '100%' }}
                />
                <View style={{ position: 'absolute', left: 14, top: 14 }}>
                  <Badge text={room.fields.Category} />
                </View>
              </View>
              <View style={s.padded}>
                <View style={s.between}>
                  <Text style={[s.cardTitle, s.fill]}>{room.title}</Text>
                  <Icon name="next" size={18} />
                </View>
                <Text
                  numberOfLines={2}
                  style={[s.body, { fontSize: 13, marginTop: 8 }]}
                >
                  {room.description}
                </Text>
                <Facts
                  entries={['Size', 'Beds', 'Sleeps'].map(key => [
                    key,
                    room.fields[key],
                  ])}
                />
                <View style={s.wrap}>
                  {room.sections['Key amenities'].slice(0, 3).map(value => (
                    <Badge text={value} key={value} />
                  ))}
                </View>
              </View>
            </Pressable>
          ))}
        </AdaptiveGrid>
      ) : (
        <>
          <AdaptiveGrid minimum={170}>
            {facilities.map(([icon, title, description]) => (
              <View key={title} style={[s.card, { padding: 15, flex: 1 }]}>
                <View
                  style={[
                    s.badge,
                    { alignSelf: 'flex-start', marginBottom: 14 },
                  ]}
                >
                  <Text style={[s.badgeText, { fontWeight: '800' }]}>
                    {icon}
                  </Text>
                </View>
                <Text style={[s.cardTitle, { fontSize: 15 }]}>{title}</Text>
                <Text style={[s.small, { marginTop: 8 }]}>{description}</Text>
              </View>
            ))}
          </AdaptiveGrid>
          <Text style={s.heading}>Accommodation highlights</Text>
          <InfoTable
            lines={[
              'Check-in / out: 3:00 PM / 11:00 AM',
              'Rooms: 178 guest rooms and suites',
              'Smoking: Non-smoking rooms',
              'Pets: Select pet-friendly rooms',
              'Casino access: Indoor walkway open',
              'Minimum age: 18+ to check in',
            ]}
          />
          <View style={[s.card, s.padded]}>
            <Text style={s.cardTitle}>Renovation notice</Text>
            <Text style={[s.body, { marginTop: 10 }]}>
              The swimming pool is temporarily closed. Hotel guests can arrange
              complimentary access to alternative aquatic facilities through the
              front desk.
            </Text>
          </View>
        </>
      )}
    </Screen>
  );
}
export function RoomDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'RoomDetail'>) {
  const room = rooms.find(item => item.id === route.params.id)!;
  const insets = useSafeAreaInsets();
  return (
    <Screen top={false} bottom={false}>
      <Hero source={assets[room.image!]} height={340}>
        <View style={{ position: 'absolute', top: insets.top + 10, left: 20 }}>
          <IconButton
            name="back"
            label="Back to hotel"
            onPress={navigation.goBack}
          />
        </View>
      </Hero>
      <Text style={s.label}>{room.fields.Category}</Text>
      <Text style={s.title}>{room.title}</Text>
      <Facts
        entries={['Size', 'Beds', 'Sleeps', 'View'].map(key => [
          key,
          room.fields[key],
        ])}
      />
      <Text style={[s.body, { marginTop: 10 }]}>{room.description}</Text>
      <Text style={s.heading}>Key amenities</Text>
      <AdaptiveGrid minimum={200}>
        {room.sections['Key amenities'].map(value => (
          <View
            key={value}
            style={[s.card, s.row, { padding: 12, borderRadius: 14, flex: 1 }]}
          >
            <Icon name="check" color={colors.accent} size={16} />
            <Text style={[s.small, { color: colors.text, flex: 1 }]}>
              {value}
            </Text>
          </View>
        ))}
      </AdaptiveGrid>
      <Text style={s.heading}>Room features</Text>
      <View style={[s.card, s.padded]}>
        {room.sections['Room features'].map(value => (
          <View
            key={value}
            style={[s.row, { marginVertical: 8, alignItems: 'flex-start' }]}
          >
            <Text style={{ color: colors.accent }}>•</Text>
            <Text style={[s.body, s.fill]}>{value}</Text>
          </View>
        ))}
      </View>
      <Text style={s.heading}>General information</Text>
      <InfoTable lines={room.sections['General information']} />
      <Text style={s.small}>
        Room layouts and furnishings may vary. For reservations, contact the
        hotel front desk directly.
      </Text>
    </Screen>
  );
}
