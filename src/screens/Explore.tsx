import { AdaptiveGrid } from '../components/AdaptiveGrid';
import { MotionPressable as Pressable } from '../components/Motion';
import React from 'react';
import { Text, View } from 'react-native';
import { Gradient as LinearGradient } from '../components/Gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { assets, exploreSections } from '../data';
import { Button, Facts, Hero, Screen } from '../components/ui';
import { Icon } from '../components/Icon';
import { gradient, s } from '../theme';
import { RootParams } from '../navigation/types';
import { directions } from '../utils/links';
export function ExploreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootParams>>();
  const actions: Record<string, () => void> = {
    'See upcoming events': () =>
      navigation.navigate('Main', { screen: 'Events' }),
    'Browse dining': () => navigation.navigate('Main', { screen: 'Dining' }),
    'Explore rooms': () => navigation.navigate('Main', { screen: 'Hotel' }),
    'Get directions': directions,
  };
  return (
    <Screen top={false}>
      <Hero
        source={assets['grey-eagle-resort-exterior.png']}
        title="Explore Eagle Summit Retreat"
        label="CALGARY · ALBERTA"
        subtitle="Your guide to entertainment, dining, accommodation and unforgettable experiences."
        height={370}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open Questions and Answers"
        onPress={() => navigation.navigate('Assistant')}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[s.row, { padding: 18, borderRadius: 22, gap: 16 }]}
        >
          <View
            style={{
              backgroundColor: '#ffffff22',
              padding: 12,
              borderRadius: 14,
            }}
          >
            <Icon name="chat" color="#fff" />
          </View>
          <View style={s.fill}>
            <Text style={[s.cardTitle, { fontSize: 17 }]}>
              Questions & Answers
            </Text>
            <Text style={[s.small, { color: '#e0ffec', marginTop: 5 }]}>
              Hours, parking, dining, concerts & more — instant answers, no
              sign-in.
            </Text>
          </View>
          <Icon name="next" color="#fff" size={18} />
        </LinearGradient>
      </Pressable>
      <View style={{ marginTop: 16 }}>
        <Button
          title="Read & Watch · Stories and films"
          icon="explore"
          onPress={() => navigation.navigate('Resources')}
        />
      </View>
      <Facts
        highlightFirst
        entries={[
          ['24 hours', 'Slots'],
          ['Free', 'Self-parking'],
          ['18+', 'Casino entry'],
        ]}
      />
      <AdaptiveGrid>
        {exploreSections.map((section, index) => {
          const lines = section.body.split('\n').filter(Boolean);
          return (
            <View key={section.title}>
              <View style={[s.row, { marginTop: 18, marginBottom: 12 }]}>
                <View style={s.badge}>
                  <Text
                    style={[s.badgeText, { fontSize: 10, fontWeight: '800' }]}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                </View>
                <Text style={[s.cardTitle, { flex: 1 }]}>{section.title}</Text>
              </View>
              <View style={[s.card, s.padded]}>
                {lines.map((line, i) => {
                  if (line.startsWith('Button: ')) {
                    const label = line.slice(8);
                    return actions[label] ? (
                      <View
                        key={i}
                        style={{ marginTop: 16, alignSelf: 'flex-start' }}
                      >
                        <Button
                          title={label}
                          secondary
                          onPress={actions[label]}
                        />
                      </View>
                    ) : null;
                  }
                  return (
                    <Text
                      key={i}
                      style={
                        line.length < 42 && !line.includes(':') && i > 0
                          ? [
                              s.cardTitle,
                              { fontSize: 14, marginTop: 16, marginBottom: 6 },
                            ]
                          : [
                              s.body,
                              { fontSize: 13, lineHeight: 21, marginBottom: 7 },
                            ]
                      }
                    >
                      {line}
                    </Text>
                  );
                })}
              </View>
            </View>
          );
        })}
      </AdaptiveGrid>
      <Text style={[s.small, { fontSize: 11 }]}>
        This is an informational guide. Gaming is available on-site for adults
        18+ only. The app does not offer real-money gambling. Please play
        responsibly.
      </Text>
    </Screen>
  );
}
