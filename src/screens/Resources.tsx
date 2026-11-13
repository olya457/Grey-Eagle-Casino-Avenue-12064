import React, { useState } from 'react';
import {
  Alert,
  Image,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParams } from '../navigation/types';
import { assets } from '../data';
import { filterResources, resources } from '../data/resources';
import {
  Badge,
  Button,
  Chips,
  Empty,
  Hero,
  IconButton,
  Screen,
  Segments,
} from '../components/ui';
import { AdaptiveGrid } from '../components/AdaptiveGrid';
import { MotionPressable } from '../components/Motion';
import { useAppState } from '../storage/AppState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, s } from '../theme';
import { openLink } from '../utils/links';
export function ResourcesScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'Resources'>) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState(route.params?.topic ?? 'All topics');
  const [kind, setKind] = useState('All');
  const [tab, setTab] = useState(0);
  const { savedResources, toggleResource } = useAppState();
  const filtered = filterResources(
    query,
    topic,
    kind,
    tab === 1,
    savedResources,
  );
  const reset = () => {
    setQuery('');
    setTopic('All topics');
    setKind('All');
    setTab(0);
  };
  return (
    <Screen>
      <View style={[s.between, r.header]}>
        <IconButton
          name="back"
          label="Back to Explore"
          onPress={navigation.goBack}
        />
        <Badge text="ENGLISH COLLECTION" />
      </View>
      <Text style={s.label}>STORIES · CULTURE · DISCOVERY</Text>
      <Text style={s.title}>Read & Watch</Text>
      <Text style={s.body}>
        Explore the stories behind your visit. Articles and films from local
        tourism organizations and the resort.
      </Text>
      <Segments
        values={['Discover', `Saved · ${savedResources.length}`]}
        selected={tab}
        onChange={setTab}
      />
      <TextInput
        style={s.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Search stories, topics, publishers"
        placeholderTextColor={colors.muted}
        accessibilityLabel="Search articles and videos"
        clearButtonMode="while-editing"
      />
      <Chips
        values={['All', 'Article', 'Video']}
        selected={kind}
        onChange={setKind}
      />
      <Chips
        values={['All topics', ...new Set(resources.map(item => item.topic))]}
        selected={topic}
        onChange={setTopic}
      />
      <Text accessibilityLiveRegion="polite" style={[s.small, r.count]}>
        {filtered.length} {filtered.length === 1 ? 'resource' : 'resources'} ·
        Opens on the publisher’s website
      </Text>
      <AdaptiveGrid>
        {filtered.map(item => (
          <View key={item.id} style={[s.card, s.fill]}>
            <MotionPressable
              onPress={() =>
                navigation.navigate('ResourceDetail', { id: item.id })
              }
              accessibilityRole="button"
              accessibilityLabel={`${item.kind}: ${item.title}`}
            >
              <Image source={assets[item.image]} style={r.image} />
              <View style={r.imageBadge}>
                <Badge text={item.kind === 'Video' ? '▶  WATCH' : 'READ'} />
              </View>
              <View style={s.padded}>
                <Text style={s.label}>{item.topic}</Text>
                <Text style={s.cardTitle}>{item.title}</Text>
                <Text style={[s.body, r.summary]}>{item.summary}</Text>
              </View>
            </MotionPressable>
            <View style={[s.between, r.footer]}>
              <Text style={[s.small, s.fill]}>{item.publisher}</Text>
              <IconButton
                name="heart"
                active={savedResources.includes(item.id)}
                label={`${
                  savedResources.includes(item.id) ? 'Unsave' : 'Save'
                } ${item.title}`}
                onPress={() => toggleResource(item.id)}
              />
            </View>
          </View>
        ))}
      </AdaptiveGrid>
      {!filtered.length && (
        <Empty
          title={
            tab === 1 && !savedResources.length
              ? 'Your reading list starts here'
              : 'No matching resources'
          }
          description={
            tab === 1 && !savedResources.length
              ? 'Save articles and videos with the heart button to find them here later.'
              : 'Try a different search, topic or format.'
          }
          action="Browse all resources"
          onPress={reset}
        />
      )}
    </Screen>
  );
}
export function ResourceDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'ResourceDetail'>) {
  const item = resources.find(value => value.id === route.params.id)!;
  const { savedResources, toggleResource } = useAppState();
  const insets = useSafeAreaInsets();
  const share = async () => {
    try {
      await Share.share({ message: `${item.title}\n${item.url}` });
    } catch {
      Alert.alert(
        'Sharing unavailable',
        'Please try again or open the publisher’s page.',
      );
    }
  };
  return (
    <Screen top={false} bottom={false}>
      <Hero source={assets[item.image]} height={320}>
        <View style={[s.between, r.heroActions, { top: insets.top + 12 }]}>
          <IconButton
            name="back"
            label="Back to Read and Watch"
            onPress={navigation.goBack}
          />
          <IconButton
            name="heart"
            active={savedResources.includes(item.id)}
            label={
              savedResources.includes(item.id)
                ? 'Remove saved resource'
                : 'Save resource'
            }
            onPress={() => toggleResource(item.id)}
          />
        </View>
      </Hero>
      <View style={s.wrap}>
        <Badge text={item.kind} />
        <Badge text={item.topic} />
        <Badge text="English" />
      </View>
      <Text style={[s.title, r.detailTitle]}>{item.title}</Text>
      <Text style={s.label}>{item.publisher}</Text>
      <Text style={s.body}>{item.summary}</Text>
      <Text style={s.heading}>Inside this {item.kind.toLowerCase()}</Text>
      <View style={[s.card, s.padded]}>
        {item.highlights.map(line => (
          <Text key={line} style={[s.body, r.highlight]}>
            • {line}
          </Text>
        ))}
      </View>
      <Button
        title={
          item.kind === 'Video'
            ? 'Watch on publisher’s website'
            : 'Read the original article'
        }
        icon={item.kind === 'Video' ? 'next' : 'explore'}
        onPress={() => openLink(item.url)}
      />
      <View style={s.gap} />
      <Button title="Share resource" secondary onPress={share} />
      <Text style={[s.small, r.source]}>
        Source: {item.publisher}
        {'\n'}
        {item.url}
        {'\n\n'}Internet access is needed to open external articles and videos.
        Saved links stay on this device; full articles and videos are not
        downloaded.
      </Text>
    </Screen>
  );
}
const r = StyleSheet.create({
  header: { marginBottom: 24 },
  count: { marginVertical: 16 },
  image: { height: 170, width: '100%' },
  imageBadge: { position: 'absolute', top: 12, left: 12 },
  summary: { marginTop: 10, fontSize: 14 },
  footer: { paddingHorizontal: 18, paddingBottom: 16, marginTop: 'auto' },
  heroActions: { position: 'absolute', left: 20, right: 20 },
  detailTitle: { marginTop: 20 },
  highlight: { marginVertical: 8 },
  source: { marginTop: 24 },
});
