import { Entrance } from '../components/Motion';
import { useLayout } from '../hooks/useLayout';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { MotionPressable as Pressable } from '../components/Motion';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brand, IconButton } from '../components/ui';
import { questions } from '../data';
import { useAppState } from '../storage/AppState';
import { RootParams } from '../navigation/types';
import { colors, s } from '../theme';
const greeting =
  "Hi there! I'm the Grey Eagle Assistant. Pick a question below and I'll answer right away — no sign-in needed.";
export function AssistantScreen({
  navigation,
}: NativeStackScreenProps<RootParams, 'Assistant'>) {
  const { messages, addMessages, clearMessages } = useAppState();
  const [pending, setPending] = useState(false);
  const [query, setQuery] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scroll = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const reduced = useReducedMotion();
  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );
  const ask = (question: string, answer: string) => {
    if (pending) {
      return;
    }
    setPending(true);
    addMessages([{ id: `${Date.now()}-user`, role: 'user', text: question }]);
    timer.current = setTimeout(() => {
      addMessages([
        { id: `${Date.now()}-assistant`, role: 'assistant', text: answer },
      ]);
      setPending(false);
    }, 650);
  };
  const filtered = questions.filter(item =>
    `${item.question} ${item.answer}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <KeyboardAvoidingView
      style={s.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          a.header,
          {
            paddingTop: insets.top + 8,
            paddingLeft: insets.left + 14,
            paddingRight: insets.right + 14,
          },
        ]}
      >
        <IconButton
          name="back"
          label="Back to explore"
          onPress={navigation.goBack}
        />
        <Brand compact />
        <View style={s.fill}>
          <Text style={[s.cardTitle, { fontSize: 15 }]}>
            Grey Eagle Assistant
          </Text>
          <Text style={[s.small, { fontSize: 10 }]}>
            Automated answers · No sign-in required
          </Text>
        </View>
      </View>
      <Entrance
        style={{
          flex: 1,
          flexDirection: layout.expanded ? 'row' : 'column',
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        <ScrollView
          ref={scroll}
          style={s.fill}
          contentContainerStyle={{
            padding: 16,
            maxWidth: 680,
            width: '100%',
            alignSelf: 'center',
          }}
          onContentSizeChange={() =>
            scroll.current?.scrollToEnd({ animated: !reduced })
          }
        >
          <Text
            style={[
              s.label,
              {
                textAlign: 'center',
                color: colors.muted,
                marginVertical: 12,
                fontSize: 9,
              },
            ]}
          >
            LOCAL CONVERSATION
          </Text>
          <View style={a.assistant}>
            <Text style={a.message}>{greeting}</Text>
          </View>
          {messages.map(message => (
            <Entrance
              key={message.id}
              style={message.role === 'user' ? a.user : a.assistant}
            >
              <Text selectable style={a.message}>
                {message.text}
              </Text>
            </Entrance>
          ))}
          {pending && (
            <View style={[a.assistant, { alignSelf: 'flex-start' }]}>
              <Text style={{ color: colors.accent, letterSpacing: 5 }}>
                •••
              </Text>
            </View>
          )}
        </ScrollView>
        <View
          style={[
            a.suggestions,
            {
              paddingBottom: insets.bottom + 10,
              width: layout.expanded ? '40%' : '100%',
              maxHeight: layout.expanded
                ? '100%'
                : layout.short
                ? '48%'
                : '55%',
            },
          ]}
        >
          <View style={s.between}>
            <Text style={s.small}>Suggested questions</Text>
            {messages.length > 0 && (
              <Pressable
                disabled={pending}
                onPress={() =>
                  Alert.alert(
                    'Clear conversation?',
                    'This removes the saved conversation from this device.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Clear',
                        style: 'destructive',
                        onPress: clearMessages,
                      },
                    ],
                  )
                }
                accessibilityRole="button"
                style={{ padding: 8 }}
              >
                <Text style={{ color: colors.accent, fontSize: 12 }}>
                  Clear chat
                </Text>
              </Pressable>
            )}
          </View>
          <TextInput
            accessibilityLabel="Find a question"
            value={query}
            onChangeText={setQuery}
            style={[
              s.input,
              { marginVertical: 10, minHeight: 42, padding: 10, fontSize: 13 },
            ]}
            placeholder="Find a question…"
            placeholderTextColor={colors.muted}
          />
          <ScrollView
            style={{
              maxHeight: layout.expanded
                ? undefined
                : Math.max(100, Math.min(230, layout.height * 0.27)),
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={s.wrap}>
              {filtered.map(item => (
                <Pressable
                  key={item.id}
                  disabled={pending}
                  accessibilityRole="button"
                  onPress={() => ask(item.question, item.answer)}
                  style={[a.question, { opacity: pending ? 0.45 : 1 }]}
                >
                  <Text
                    style={{ color: '#c3c9dd', fontSize: 12, lineHeight: 18 }}
                  >
                    {item.question}
                  </Text>
                </Pressable>
              ))}
              {!filtered.length && (
                <Text style={s.body}>
                  No matching questions. Try “parking”, “tickets” or “hotel”.
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      </Entrance>
    </KeyboardAvoidingView>
  );
}
const a = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
    backgroundColor: '#090b11',
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  assistant: {
    backgroundColor: '#1b1f2e',
    padding: 14,
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    maxWidth: '88%',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  user: {
    backgroundColor: '#46578f',
    padding: 14,
    borderRadius: 20,
    borderBottomRightRadius: 5,
    maxWidth: '88%',
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  message: { color: '#e0e3ee', fontSize: 14, lineHeight: 21 },
  suggestions: {
    backgroundColor: '#090b11',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#20232f',
  },
  question: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 18,
    borderColor: '#35415f',
    borderWidth: 1,
    backgroundColor: '#141a29',
  },
});
