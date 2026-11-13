import { useLayout } from '../hooks/useLayout';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { MotionPressable as Pressable } from '../components/Motion';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import { Gradient as LinearGradient } from '../components/Gradient';
import { assets, events } from '../data';
import {
  Badge,
  Button,
  Facts,
  Hero,
  IconButton,
  InfoTable,
  Screen,
} from '../components/ui';
import { Icon } from '../components/Icon';
import { useAppState } from '../storage/AppState';
import { colors, s } from '../theme';
import { RootParams } from '../navigation/types';
import { directions, openLink } from '../utils/links';
export function EventDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'EventDetail'>) {
  const event = events.find(item => item.id === route.params.id)!;
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const reduced = useReducedMotion();
  const { codes, saveCode } = useAppState();
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState(codes[event.id] || '');
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );
  const info = event.sections['Event information'];
  const ticket =
    info.find(line => line.startsWith('Tickets:'))?.slice(9) ||
    'Check with Box Office';
  const openCodes = () => {
    setDraft(codes[event.id] || '');
    setEditing(!codes[event.id]);
    setCopied(false);
    setVisible(true);
  };
  const copy = () => {
    Clipboard.setString(codes[event.id]);
    setCopied(true);
    timer.current = setTimeout(() => setCopied(false), 2200);
  };
  return (
    <View style={s.page}>
      <Screen top={false} bottom={false}>
        <Hero
          source={assets[event.image!]}
          height={350}
          title={event.title}
          label={event.fields.Category}
        >
          <View
            style={{ position: 'absolute', top: insets.top + 10, left: 20 }}
          >
            <IconButton
              name="back"
              label="Back to events"
              onPress={navigation.goBack}
            />
          </View>
        </Hero>
        <View style={s.wrap}>
          <Badge text={event.fields.Category} />
          <Badge text={event.fields.Age} />
        </View>
        <Facts
          entries={[
            ['Date', event.fields.Date],
            ['Show time', event.fields['Show time']],
          ]}
        />
        <Pressable
          onPress={directions}
          accessibilityRole="button"
          accessibilityLabel="Get venue directions"
          style={[s.card, s.padded, s.row]}
        >
          <Icon name="pin" color={colors.accent} />
          <View style={s.fill}>
            <Text style={[s.cardTitle, { fontSize: 14 }]}>
              {event.fields.Location}
            </Text>
            <Text style={s.small}>
              Grey Eagle Resort & Casino · 3777 Grey Eagle Dr SW
            </Text>
          </View>
          <Icon name="next" size={16} />
        </Pressable>
        <Text style={s.heading}>About the event</Text>
        <Text style={s.body}>{event.description}</Text>
        <Pressable
          onPress={openCodes}
          accessibilityRole="button"
          style={[
            s.card,
            s.padded,
            s.row,
            { marginTop: 20, backgroundColor: '#1c2339' },
          ]}
        >
          <Icon name="ticket" color={colors.accent} />
          <View style={s.fill}>
            <Text style={[s.cardTitle, { fontSize: 15 }]}>
              {codes[event.id] ? 'Your saved promo code' : 'Have a promo code?'}
            </Text>
            <Text style={s.small}>
              {codes[event.id] ||
                'Keep a code from the venue or ticket provider on this device.'}
            </Text>
          </View>
          <Icon name="next" size={18} />
        </Pressable>
        <Text style={s.heading}>Event information</Text>
        <InfoTable lines={info} />
        <Text style={s.small}>
          Lineups and times are subject to change. Bring valid photo ID for
          age-restricted events. Confirm ticket availability with the Box Office
          or authorized ticket provider.
        </Text>
        <View style={s.gap} />
        {ticket !== 'Free admission' && (
          <Button
            title="Find tickets on Ticketmaster"
            secondary
            onPress={() =>
              openLink(
                `https://www.ticketmaster.ca/search?q=${encodeURIComponent(
                  event.title,
                )}`,
              )
            }
          />
        )}
        <View style={{ height: layout.compact ? 170 : 110 }} />
      </Screen>
      <View
        style={[
          d.bottom,
          {
            paddingBottom: insets.bottom + 10,
            paddingLeft: insets.left + layout.gutter,
            paddingRight: insets.right + layout.gutter,
            flexDirection: layout.compact ? 'column' : 'row',
          },
        ]}
      >
        <View
          style={{
            flex: layout.compact ? undefined : 1,
            width: layout.compact ? '100%' : undefined,
          }}
        >
          <Text style={s.small}>Tickets</Text>
          <Text style={[s.cardTitle, { fontSize: 13 }]}>{ticket}</Text>
        </View>
        <Button
          title={codes[event.id] ? 'View Promo Code' : 'Save Promo Code'}
          onPress={openCodes}
          style={{
            flex: layout.compact ? undefined : 1.3,
            width: layout.compact ? '100%' : undefined,
          }}
        />
      </View>
      <Modal
        transparent
        visible={visible}
        animationType={reduced ? 'none' : 'slide'}
        onRequestClose={() => setVisible(false)}
      >
        <KeyboardAvoidingView
          style={d.modal}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setVisible(false)}
            accessibilityLabel="Close promo code"
          />
          <LinearGradient
            colors={['#1b2135', '#0b0d15']}
            style={[
              d.sheet,
              {
                paddingBottom: insets.bottom + 22,
                maxWidth: Math.min(
                  600,
                  layout.width - insets.left - insets.right,
                ),
                paddingHorizontal: layout.gutter,
              },
            ]}
          >
            <View style={d.handle} />
            <View style={[s.between, { marginBottom: 18 }]}>
              <View style={s.fill} />
              <View style={d.ticketIcon}>
                <Icon name="ticket" color={colors.accent} size={28} />
              </View>
              <View style={[s.fill, { alignItems: 'flex-end' }]}>
                <IconButton
                  name="close"
                  label="Close promo code"
                  onPress={() => setVisible(false)}
                />
              </View>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={[s.label, { textAlign: 'center' }]}>
                {editing ? 'SAVE YOUR PROMO CODE' : 'YOUR PROMO CODE'}
              </Text>
              <Text style={[s.body, { textAlign: 'center', marginBottom: 20 }]}>
                {event.title}
              </Text>
              {editing ? (
                <>
                  <Text
                    style={[s.body, { textAlign: 'center', marginBottom: 18 }]}
                  >
                    Enter a code you received from the venue or ticket provider.
                    It will be saved on this device.
                  </Text>
                  <TextInput
                    value={draft}
                    onChangeText={setDraft}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    maxLength={80}
                    placeholder="Enter promo code"
                    placeholderTextColor={colors.muted}
                    accessibilityLabel="Promo code"
                    style={[s.input, { textAlign: 'center', marginBottom: 18 }]}
                  />
                  <Button
                    title="Save Code"
                    disabled={!draft.trim()}
                    onPress={() => {
                      saveCode(event.id, draft);
                      setEditing(false);
                    }}
                  />
                </>
              ) : (
                <>
                  <View style={d.code}>
                    <Text selectable style={d.codeText}>
                      {codes[event.id]}
                    </Text>
                    <Text style={s.small}>
                      Saved by you · eligibility set by the provider
                    </Text>
                  </View>
                  <Button
                    title={copied ? 'Copied to Clipboard' : 'Copy Code'}
                    icon={copied ? 'check' : 'copy'}
                    onPress={copy}
                  />
                  <View style={[s.row, { marginTop: 12 }]}>
                    <Button
                      title="Edit"
                      secondary
                      onPress={() => setEditing(true)}
                      style={s.fill}
                    />
                    <Button
                      title="Remove"
                      secondary
                      onPress={() => {
                        saveCode(event.id, '');
                        setDraft('');
                        setEditing(true);
                      }}
                      style={s.fill}
                    />
                  </View>
                </>
              )}
              <Text style={[s.small, { textAlign: 'center', marginTop: 18 }]}>
                The app does not issue or validate discounts. Use your code with
                the authorized provider and check its terms.
              </Text>
              <Pressable
                onPress={() => setVisible(false)}
                style={{ padding: 18 }}
                accessibilityRole="button"
              >
                <Text
                  style={{
                    color: colors.accent,
                    textAlign: 'center',
                    fontWeight: '600',
                  }}
                >
                  Back to Event
                </Text>
              </Pressable>
            </ScrollView>
          </LinearGradient>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
const d = StyleSheet.create({
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#06070af5',
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  modal: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#000000bb' },
  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2d344b',
    maxHeight: '90%',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  handle: {
    height: 4,
    width: 34,
    borderRadius: 2,
    backgroundColor: '#4a5065',
    alignSelf: 'center',
    marginBottom: 18,
  },
  ticketIcon: {
    height: 56,
    width: 56,
    borderRadius: 18,
    backgroundColor: '#3d4e84',
    alignItems: 'center',
    justifyContent: 'center',
  },
  code: {
    padding: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 18,
    borderColor: '#8a9dd7',
    backgroundColor: '#20283f',
    marginBottom: 18,
    alignItems: 'center',
  },
  codeText: {
    fontSize: 24,
    letterSpacing: 2,
    color: colors.text,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
});
