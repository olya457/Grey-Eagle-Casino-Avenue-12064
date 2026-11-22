import { AdaptiveGrid } from '../components/AdaptiveGrid';
import { MotionPressable as Pressable } from '../components/Motion';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { assets, menu, MenuItem, venues } from '../data';
import {
  Badge,
  Button,
  Chips,
  Empty,
  Hero,
  IconButton,
  InfoTable,
  Screen,
  Segments,
} from '../components/ui';
import { Icon } from '../components/Icon';
import { useAppState } from '../storage/AppState';
import { colors, s } from '../theme';
import { RootParams } from '../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { openLink } from '../utils/links';
export function DishRow({ item }: { item: MenuItem }) {
  const { favorites, toggleFavorite } = useAppState();
  const saved = favorites.includes(item.id);
  return (
    <View
      style={{
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <View style={s.fill}>
        <View style={[s.between, { alignItems: 'flex-start' }]}>
          <Text style={[s.cardTitle, { fontSize: 14, flex: 1 }]}>
            {item.title}
          </Text>
          <Text style={{ color: '#bdeed1', fontWeight: '700', fontSize: 13 }}>
            {item.price}
          </Text>
        </View>
        {!!item.description && (
          <Text style={[s.small, { marginTop: 5 }]}>{item.description}</Text>
        )}
        {!!item.availability && (
          <Text style={[s.small, { color: colors.accent, marginTop: 7 }]}>
            {item.availability}
          </Text>
        )}
      </View>
      <IconButton
        name="heart"
        active={saved}
        label={`${saved ? 'Remove' : 'Save'} ${item.title} ${
          saved ? 'from' : 'to'
        } favorites`}
        onPress={() => toggleFavorite(item.id)}
      />
    </View>
  );
}
export function DiningScreen() {
  const [tab, setTab] = useState(0);
  const { favorites } = useAppState();
  const navigation = useNavigation<NativeStackNavigationProp<RootParams>>();
  const saved = menu.filter(item => favorites.includes(item.id));
  return (
    <Screen>
      <Text style={s.label}>RESTAURANTS & BARS</Text>
      <Text style={s.title}>Dining</Text>
      <Segments
        values={['All venues', `My favorites · ${saved.length}`]}
        selected={tab}
        onChange={setTab}
      />
      {tab === 1 && (
        <Text style={[s.small, { marginBottom: 16 }]}>
          Saved on this device only — grouped by venue.
        </Text>
      )}
      {tab === 1 && !saved.length && (
        <Empty
          title="No favorites yet"
          description="Tap the heart next to any dish or drink in a venue’s menu to save it here."
          action="Browse venues"
          onPress={() => setTab(0)}
        />
      )}
      <AdaptiveGrid>
        {venues
          .filter(
            venue => tab === 0 || saved.some(item => item.venueId === venue.id),
          )
          .map(venue => {
            const items = saved.filter(item => item.venueId === venue.id);
            return (
              <View key={venue.id} style={s.card}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${venue.title}`}
                  onPress={() =>
                    navigation.navigate('VenueDetail', { id: venue.id })
                  }
                >
                  {tab === 0 ? (
                    <>
                      <View>
                        <Image
                          source={assets[venue.image!]}
                          style={{ width: '100%', height: 200 }}
                        />
                        <View
                          style={{
                            position: 'absolute',
                            left: 12,
                            right: 12,
                            top: 12,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: 8,
                          }}
                        >
                          <View
                            style={[
                              s.badge,
                              { flexShrink: 1, backgroundColor: '#15241bd9' },
                            ]}
                          >
                            <Text style={s.badgeText}>
                              {venue.fields.Category}
                            </Text>
                          </View>
                          <View style={[s.badge, s.row]}>
                            <Icon
                              name="heart"
                              size={14}
                              color={items.length ? colors.pink : colors.muted}
                              filled={items.length > 0}
                            />
                            <Text style={s.badgeText}>{items.length}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={s.padded}>
                        <View style={s.between}>
                          <Text style={[s.cardTitle, s.fill]}>
                            {venue.title}
                          </Text>
                          <Icon name="next" size={18} />
                        </View>
                        <Text
                          numberOfLines={2}
                          style={[s.body, { fontSize: 13, marginVertical: 8 }]}
                        >
                          {venue.description}
                        </Text>
                        <View style={s.wrap}>
                          <Badge
                            text={
                              venue.id === 'venues-3'
                                ? 'Renovation · alternate locations'
                                : venue.id === 'venues-1'
                                ? 'All ages'
                                : '18+ casino area'
                            }
                          />
                        </View>
                      </View>
                    </>
                  ) : (
                    <View style={[s.row, s.padded]}>
                      <Image
                        source={assets[venue.image!]}
                        style={{ width: 42, height: 42, borderRadius: 12 }}
                      />
                      <View style={s.fill}>
                        <Text style={[s.cardTitle, { fontSize: 15 }]}>
                          {venue.title}
                        </Text>
                        <Text style={s.small}>{items.length} saved items</Text>
                      </View>
                      <Icon name="next" size={18} />
                    </View>
                  )}
                </Pressable>
                {tab === 1 && (
                  <View style={{ paddingHorizontal: 16 }}>
                    {items.map(item => (
                      <DishRow key={item.id} item={item} />
                    ))}
                  </View>
                )}
              </View>
            );
          })}
      </AdaptiveGrid>
    </Screen>
  );
}
export function VenueDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'VenueDetail'>) {
  const venue = venues.find(item => item.id === route.params.id)!;
  const { favorites } = useAppState();
  const [tab, setTab] = useState(0);
  const [category, setCategory] = useState('All');
  const insets = useSafeAreaInsets();
  const items = menu.filter(item => item.venueId === venue.id);
  const count = items.filter(item => favorites.includes(item.id)).length;
  const categories = ['All', ...new Set(items.map(item => item.category))];
  const visible = items.filter(
    item =>
      (tab === 0 || favorites.includes(item.id)) &&
      (category === 'All' || item.category === category),
  );
  const information =
    venue.sections['Restaurant information'] ||
    venue.sections['Bar information'];
  return (
    <Screen top={false} bottom={false}>
      <Hero source={assets[venue.image!]} height={320}>
        <View
          style={[
            s.between,
            { position: 'absolute', top: insets.top + 10, left: 20, right: 20 },
          ]}
        >
          <IconButton
            name="back"
            label="Back to dining"
            onPress={navigation.goBack}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Show venue favorites"
            onPress={() => {
              setTab(1);
              setCategory('All');
            }}
            style={[s.badge, s.row]}
          >
            <Icon
              name="heart"
              filled={count > 0}
              color={count ? colors.pink : colors.muted}
              size={16}
            />
            <Text style={s.badgeText}>{count}</Text>
          </Pressable>
        </View>
      </Hero>
      <Text style={s.label}>{venue.fields.Category}</Text>
      <Text style={[s.title, { fontSize: 28 }]}>{venue.title}</Text>
      <Text style={[s.body, { marginBottom: 20 }]}>{venue.description}</Text>
      <InfoTable
        lines={information.filter(
          line =>
            !line.startsWith('Additional information:') &&
            !line.startsWith('Renovation notice:'),
        )}
      />
      {information
        .filter(
          line =>
            line.startsWith('Additional information:') ||
            line.startsWith('Renovation notice:'),
        )
        .map(line => (
          <Text key={line} style={[s.small, { marginBottom: 14 }]}>
            {line}
          </Text>
        ))}
      {venue.id === 'venues-1' && (
        <Button
          title="Call for a reservation"
          icon="chat"
          secondary
          onPress={() => openLink('tel:+15873901400')}
        />
      )}
      <Segments
        values={['Menu', `Favorites · ${count}`]}
        selected={tab}
        onChange={value => {
          setTab(value);
          setCategory('All');
        }}
      />
      {tab === 0 && (
        <Chips values={categories} selected={category} onChange={setCategory} />
      )}
      {tab === 1 && !count && (
        <Empty
          title={`No favorites at ${venue.title} yet`}
          description="Switch to Menu and tap a heart to save items on this device."
          action="Go to Menu"
          onPress={() => setTab(0)}
        />
      )}
      {[...new Set(visible.map(item => item.category))].map(group => (
        <View key={group}>
          <Text style={[s.label, { marginTop: 20 }]}>{group}</Text>
          <View style={[s.card, { paddingHorizontal: 16 }]}>
            {visible
              .filter(item => item.category === group)
              .map(item => (
                <DishRow key={item.id} item={item} />
              ))}
          </View>
        </View>
      ))}
      <Text style={[s.small, { marginTop: 10 }]}>
        Prices in CAD. Menus and availability may change. Please inform
        restaurant staff about allergies and dietary requirements.
      </Text>
    </Screen>
  );
}
