import { AdaptiveGrid } from '../components/AdaptiveGrid';
import { MotionPressable as Pressable } from '../components/Motion';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { assets, tours } from '../data';
import {
  Badge,
  Button,
  Chips,
  Facts,
  Hero,
  IconButton,
  InfoTable,
  Screen,
} from '../components/ui';
import { colors, s } from '../theme';
import { RootParams } from '../navigation/types';
export function ToursScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootParams>>();
  const [category, setCategory] = useState('All');
  const categories = [
    'All',
    ...new Set(tours.map(item => item.fields.Category)),
  ];
  return (
    <Screen>
      <Text style={s.label}>TSUUT'INA HERITAGE</Text>
      <Text style={s.title}>Cultural Tours</Text>
      <Text style={[s.body, { marginBottom: 20 }]}>
        Stories, art and traditions of the Tsuut'ina Nation — the land Grey
        Eagle calls home.
      </Text>
      <Pressable
        onPress={() => navigation.navigate('TourDetail', { id: tours[0].id })}
        accessibilityRole="button"
        accessibilityLabel={tours[0].title}
        style={[s.card, { marginBottom: 6 }]}
      >
        <Hero
          source={assets['grey-eagle-resort-exterior.png']}
          title={tours[0].title}
          subtitle="Heritage · Museum discovery"
          height={265}
        >
          <View style={{ position: 'absolute', left: 36, top: 16 }}>
            <Badge text="Featured experience" />
          </View>
        </Hero>
      </Pressable>
      <Chips values={categories} selected={category} onChange={setCategory} />
      <View style={s.gap} />
      <AdaptiveGrid>
        {tours
          .filter(
            item => category === 'All' || item.fields.Category === category,
          )
          .map(item => (
            <Pressable
              key={item.id}
              onPress={() => navigation.navigate('TourDetail', { id: item.id })}
              accessibilityRole="button"
              style={[s.card, s.padded]}
            >
              <Text
                style={{ fontSize: 13, color: colors.accent, marginBottom: 8 }}
              >
                {item.fields.Category}
              </Text>
              <Text style={s.cardTitle}>{item.title}</Text>
              <Text numberOfLines={3} style={[s.body, { marginVertical: 8 }]}>
                {item.description}
              </Text>
              <View style={s.wrap}>
                <Badge text={item.fields.Duration} />
                <Badge text={item.fields.Setting} />
              </View>
            </Pressable>
          ))}
      </AdaptiveGrid>
      <View style={{ marginBottom: 20 }}>
        <Button
          title="Read & Watch · Indigenous culture"
          secondary
          onPress={() => navigation.navigate('Resources', { topic: 'Culture' })}
        />
      </View>
      <View style={[s.card, s.padded, { borderColor: '#34415f' }]}>
        <Text style={s.cardTitle}>A note on respect</Text>
        <Text style={[s.body, { marginTop: 10 }]}>
          These experiences are shared as visitor information. Formats,
          availability and seasonal schedules vary. Confirm offerings with the
          operator before visiting. Ask before photographing people, artwork or
          ceremonies.
        </Text>
      </View>
    </Screen>
  );
}
export function TourDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'TourDetail'>) {
  const tour = tours.find(item => item.id === route.params.id)!;
  return (
    <Screen bottom={false}>
      <View style={[s.between, { marginBottom: 20 }]}>
        <IconButton
          name="back"
          label="Back to cultural tours"
          onPress={navigation.goBack}
        />
        <Badge text={tour.fields.Category} />
      </View>
      <Text style={s.title}>{tour.title}</Text>
      <Facts
        entries={['Duration', 'Setting', 'Pace'].map(key => [
          key,
          tour.fields[key],
        ])}
      />
      <Text style={[s.body, { marginVertical: 18 }]}>{tour.description}</Text>
      <View
        style={[
          s.card,
          s.padded,
          { backgroundColor: '#181e31', borderColor: '#384663' },
        ]}
      >
        <Text style={s.label}>CULTURAL BACKGROUND</Text>
        <Text style={s.body}>
          {tour.sections['Cultural background'].join('\n\n')}
        </Text>
      </View>
      <Text style={s.heading}>What to expect</Text>
      {tour.sections['What to expect'].map((line, i) => (
        <View
          key={line}
          style={[
            s.card,
            s.padded,
            s.row,
            { alignItems: 'flex-start', gap: 14 },
          ]}
        >
          <View style={[s.badge, { borderRadius: 20 }]}>
            <Text style={[s.badgeText, { fontWeight: '700' }]}>{i + 1}</Text>
          </View>
          <Text style={[s.body, s.fill]}>{line}</Text>
        </View>
      ))}
      <Text style={s.heading}>Highlights</Text>
      <View style={s.wrap}>
        {tour.sections.Highlights.map(value => (
          <Badge key={value} text={value} />
        ))}
      </View>
      <Text style={s.heading}>Visitor information</Text>
      <InfoTable
        lines={tour.sections['Visitor information'].filter(
          line => !line.startsWith('Note:'),
        )}
      />
      {tour.sections['Visitor information']
        .filter(line => line.startsWith('Note:'))
        .map(line => (
          <Text key={line} style={[s.small, { marginTop: 12 }]}>
            {line.slice(6)}
          </Text>
        ))}
    </Screen>
  );
}
