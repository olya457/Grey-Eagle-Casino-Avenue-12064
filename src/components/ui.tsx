import React, { PropsWithChildren } from 'react';
import {
  Image,
  ImageSourcePropType,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Gradient as LinearGradient } from './Gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradient, s } from '../theme';
import { Icon, IconName } from './Icon';
import { assets } from '../data';
import { useIsFocused } from '@react-navigation/native';
import { useLayout } from '../hooks/useLayout';
import { MotionPressable as Pressable, useEntrance } from './Motion';
export function Screen({
  children,
  top = true,
  bottom = true,
}: PropsWithChildren<{ top?: boolean; bottom?: boolean }>) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const focused = useIsFocused();
  const entrance = useEntrance(focused);
  return (
    <View style={s.page}>
      <LinearGradient
        colors={['#222b49', '#0a0c13', '#000000']}
        style={u.glow}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          s.content,
          {
            paddingTop: top ? insets.top + 12 : 0,
            paddingHorizontal: layout.gutter,
            marginLeft: insets.left,
            marginRight: insets.right,
            width: layout.width - insets.left - insets.right,
            maxWidth: bottom ? layout.maxWidth : layout.readerWidth,
            paddingBottom: bottom ? insets.bottom + 110 : insets.bottom + 24,
          },
        ]}
      >
        <Animated.View style={entrance}>{children}</Animated.View>
      </ScrollView>
    </View>
  );
}
export function Button({
  title,
  onPress,
  icon,
  secondary = false,
  disabled = false,
  style,
}: {
  title: string;
  onPress: () => void;
  icon?: IconName;
  secondary?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        u.buttonOuter,
        style,
        { opacity: disabled ? 0.45 : pressed ? 0.75 : 1 },
      ]}
    >
      <LinearGradient
        colors={secondary ? ['#191d2c', '#11141e'] : gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[u.button, secondary && u.secondary]}
      >
        {icon && <Icon name={icon} color={colors.text} size={18} />}
        <Text style={u.buttonText}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}
export function IconButton({
  name,
  onPress,
  label,
  active = false,
}: {
  name: IconName;
  onPress: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={[u.iconButton, active && { backgroundColor: '#39202e' }]}
    >
      <Icon
        name={name}
        color={active ? colors.pink : colors.text}
        filled={active}
        size={20}
      />
    </Pressable>
  );
}
export function Segments({
  values,
  selected,
  onChange,
}: {
  values: string[];
  selected: number;
  onChange: (index: number) => void;
}) {
  return (
    <View style={u.segments}>
      {values.map((value, i) => (
        <Pressable
          key={value}
          accessibilityRole="tab"
          accessibilityState={{ selected: selected === i }}
          onPress={() => onChange(i)}
          style={[u.segment, selected === i && u.selectedSegment]}
        >
          <Text
            style={[u.segmentText, selected === i && { color: colors.text }]}
          >
            {value}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
export function Chips({
  values,
  selected,
  onChange,
}: {
  values: string[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={u.chips}
    >
      {values.map(value => (
        <Pressable
          key={value}
          accessibilityRole="button"
          accessibilityState={{ selected: selected === value }}
          onPress={() => onChange(value)}
          style={[u.chip, selected === value && u.activeChip]}
        >
          <Text
            style={{
              color: selected === value ? colors.text : colors.muted,
              fontSize: 13,
              fontWeight: '600',
            }}
          >
            {value}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
export function Hero({
  source,
  title,
  label,
  subtitle,
  height = 290,
  children,
}: PropsWithChildren<{
  source?: ImageSourcePropType;
  title?: string;
  label?: string;
  subtitle?: string;
  height?: number;
}>) {
  const layout = useLayout();
  return (
    <View
      style={{
        minHeight: height,
        marginHorizontal: -layout.gutter,
        marginBottom: 16,
        justifyContent: 'flex-end',
      }}
    >
      {source && (
        <Image
          source={source}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      )}
      <LinearGradient
        colors={['#00000008', '#00000018', '#000000']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={u.heroCopy}>
        {label && <Text style={s.label}>{label}</Text>}
        {title && <Text style={s.title}>{title}</Text>}
        {subtitle && <Text style={s.body}>{subtitle}</Text>}
      </View>
      {children}
    </View>
  );
}
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <View style={u.brand}>
      <Image
        source={assets['grey-eagle-brand-logo.png']}
        resizeMode="contain"
        style={{ width: compact ? 56 : 48, height: 32 }}
      />
      {!compact && <Text style={u.brandText}>GREY EAGLE</Text>}
    </View>
  );
}
export function Badge({ text }: { text: string }) {
  return (
    <View style={s.badge}>
      <Text style={[s.badgeText, { flexShrink: 1 }]}>{text}</Text>
    </View>
  );
}
export function Facts({
  entries,
  highlightFirst = false,
}: {
  entries: [string, string][];
  highlightFirst?: boolean;
}) {
  return (
    <View style={u.facts}>
      {entries.map(([key, value]) => (
        <View key={key} style={u.fact}>
          <Text style={highlightFirst ? u.factValue : s.small}>{key}</Text>
          <Text style={highlightFirst ? s.small : u.factValue}>{value}</Text>
        </View>
      ))}
    </View>
  );
}
export function InfoTable({ lines }: { lines: string[] }) {
  return (
    <View style={[s.card, { paddingHorizontal: 16 }]}>
      {lines.map((line, i) => {
        const colon = line.indexOf(':');
        return (
          <View
            key={`${i}-${line}`}
            style={[
              u.infoRow,
              i > 0 && { borderTopWidth: 1, borderColor: colors.border },
            ]}
          >
            {colon > 0 ? (
              <>
                <Text
                  style={[s.body, { flex: 0.9, minWidth: 86, fontSize: 13 }]}
                >
                  {line.slice(0, colon)}
                </Text>
                <Text style={u.infoValue}>{line.slice(colon + 1).trim()}</Text>
              </>
            ) : (
              <Text style={s.body}>{line}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}
export function Empty({
  title,
  description,
  action,
  onPress,
  icon = 'heart',
}: {
  title: string;
  description: string;
  action?: string;
  onPress?: () => void;
  icon?: IconName;
}) {
  return (
    <View style={[s.card, u.empty]}>
      <View style={u.emptyIcon}>
        <Icon name={icon} color={colors.accent} size={26} />
      </View>
      <Text style={[s.cardTitle, { textAlign: 'center' }]}>{title}</Text>
      <Text style={[s.body, { textAlign: 'center', marginVertical: 10 }]}>
        {description}
      </Text>
      {action && onPress && <Button title={action} onPress={onPress} />}
    </View>
  );
}
const u = StyleSheet.create({
  glow: { position: 'absolute', top: 0, left: 0, right: 0, height: 270 },
  buttonOuter: {
    borderRadius: 28,
    overflow: 'hidden',
    minHeight: 52,
    flexShrink: 0,
  },
  button: {
    minHeight: 52,
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    flexShrink: 1,
  },
  secondary: { borderColor: '#353e5e', borderWidth: 1 },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#13151dcc',
    borderWidth: 1,
    borderColor: '#353744',
    borderRadius: 24,
  },
  segments: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 12,
    backgroundColor: '#1b1c21',
    marginVertical: 18,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSegment: { backgroundColor: '#45464e' },
  segmentText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  chips: { gap: 8, paddingVertical: 10 },
  chip: {
    borderWidth: 1,
    borderColor: '#282b35',
    backgroundColor: '#131418',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  activeChip: { backgroundColor: '#495b95', borderColor: '#8196d5' },
  heroCopy: { paddingHorizontal: 20, paddingBottom: 5, paddingTop: 100 },
  brand: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: '#171e32b0',
    borderRadius: 24,
    padding: 7,
    borderWidth: 1,
    borderColor: '#ffffff20',
  },
  brandText: {
    color: colors.text,
    fontWeight: '700',
    letterSpacing: 2,
    fontSize: 10,
  },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 12 },
  fact: {
    flex: 1,
    minWidth: 100,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
  },
  factValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 3,
  },
  infoRow: {
    paddingVertical: 14,
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  infoValue: {
    color: colors.text,
    flex: 1.2,
    minWidth: 120,
    textAlign: 'right',
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 20,
  },
  empty: { padding: 28, alignItems: 'center', marginTop: 14 },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#202840',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
});
