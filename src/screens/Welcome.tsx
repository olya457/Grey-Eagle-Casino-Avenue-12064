import { Entrance } from '../components/Motion';
import { useLayout } from '../hooks/useLayout';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { MotionPressable as Pressable } from '../components/Motion';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Gradient as LinearGradient } from '../components/Gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { assets } from '../data';
import { Brand, Button, IconButton } from '../components/ui';
import { colors, s } from '../theme';
import { useAppState } from '../storage/AppState';
const splashHtml = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;background:transparent;height:100%;overflow:hidden}.track{position:absolute;left:30%;right:30%;bottom:8px;height:4px;border-radius:9px;background:#ffffff25;overflow:hidden}.bar{height:100%;background:linear-gradient(90deg,#66d291,#c4ffdc);width:0;animation:load 4s linear forwards;box-shadow:0 0 16px #93ffbe}@keyframes load{to{width:100%}}</style></head><body><div class="track"><div class="bar"></div></div><script>setTimeout(function(){window.ReactNativeWebView.postMessage('finished')},4000)</script></body></html>`;
export function Splash({ onFinish }: { onFinish: () => void }) {
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const logoWidth = Math.min(
    width - insets.left - insets.right - 36,
    height - insets.top - insets.bottom - 140,
    540,
  );
  const logoHeight = logoWidth;
  const finished = useRef(false);
  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null);
  const complete = () => {
    if (!finished.current) {
      finished.current = true;
      onFinish();
    }
  };
  useEffect(
    () => () => {
      if (fallback.current) {
        clearTimeout(fallback.current);
      }
    },
    [],
  );
  const html = reduced
    ? splashHtml.replace('animation:load 4s linear forwards', 'width:100%')
    : splashHtml;
  return (
    <View style={s.page}>
      <LinearGradient
        colors={['#204b32', colors.background]}
        style={StyleSheet.absoluteFill}
      />
      <Image
        source={assets['eagle-summit-retreat-logo.png']}
        accessibilityLabel="Eagle Summit Retreat"
        resizeMode="contain"
        style={[
          w.logo,
          {
            width: logoWidth,
            height: logoHeight,
            left: (width - logoWidth) / 2,
            top: (height - logoHeight) / 2,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[w.loader, { bottom: insets.bottom + 32 }]}
      >
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          scrollEnabled={false}
          javaScriptEnabled
          style={w.web}
          onLoadEnd={() => {
            if (!fallback.current) {
              fallback.current = setTimeout(complete, 4200);
            }
          }}
          onMessage={event => {
            if (event.nativeEvent.data === 'finished') {
              complete();
            }
          }}
          onError={() => {
            if (!fallback.current) {
              fallback.current = setTimeout(complete, 4000);
            }
          }}
        />
      </View>
      <Text style={[w.footer, { bottom: insets.bottom + 6 }]}>
        Tsuut'ina Nation · Calgary, Alberta
      </Text>
    </View>
  );
}
const slides = [
  {
    image: 'grey-eagle-onboarding-entertainment.png',
    category: 'LIVE ENTERTAINMENT',
    title: 'Unforgettable\nnights, all year long',
    description:
      'Browse concerts, comedy and live music at the Event Centre — and keep your event information close at hand.',
  },
  {
    image: 'grey-eagle-onboarding-dining.png',
    category: 'RESTAURANTS & BARS',
    title: 'Savour every moment',
    description:
      'Explore five restaurants and bars, full menus and prices, and save favourite dishes right on your device.',
  },
  {
    image: 'grey-eagle-onboarding-stay.png',
    category: 'HOTEL & ROOMS',
    title: 'Stay steps from the\naction',
    description:
      'Discover rooms and suites, amenities and resort services — everything you need to plan a comfortable stay.',
  },
  {
    image: 'grey-eagle-onboarding-culture.png',
    category: 'CULTURAL EXPERIENCES',
    title: "Discover Tsuut'ina\nculture",
    description:
      "Learn the stories, art and traditions of the Tsuut'ina Nation, on whose land Eagle Summit Retreat proudly stands.",
  },
];
export function Onboarding() {
  const [index, setIndex] = useState(0);
  const { finishOnboarding } = useAppState();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const layout = useLayout();
  const slide = slides[index];
  return (
    <View style={s.page}>
      <ScrollView
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: layout.expanded ? 'row' : 'column',
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom + 18,
        }}
      >
        <ImageBackground
          source={assets[slide.image]}
          style={{
            height: layout.expanded
              ? Math.max(400, height - insets.bottom - 18)
              : Math.max(230, height * 0.55),
            width: layout.expanded ? '48%' : '100%',
          }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['#00000008', '#00000000', '#071b12']}
            locations={[0, 0.55, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              s.between,
              {
                paddingHorizontal: 20,
                paddingTop: insets.top + 12,
                flexWrap: 'wrap',
              },
            ]}
          >
            <Brand />
            <Pressable
              onPress={finishOnboarding}
              accessibilityRole="button"
              style={w.skip}
            >
              <Text style={{ color: colors.text }}>Skip</Text>
            </Pressable>
          </View>
        </ImageBackground>
        <Entrance
          trigger={index}
          style={[
            w.copy,
            {
              maxWidth: 620,
              alignSelf: 'center',
              width: layout.expanded ? '52%' : '100%',
              paddingHorizontal: layout.gutter,
              paddingTop: layout.expanded ? insets.top + 20 : 0,
            },
          ]}
        >
          <Text style={s.label}>{slide.category}</Text>
          <Text style={[s.title, { fontSize: width < 360 ? 28 : 34 }]}>
            {slide.title}
          </Text>
          <Text style={[s.body, { fontSize: 16, lineHeight: 24 }]}>
            {slide.description}
          </Text>
          <View
            style={[
              s.between,
              {
                marginTop: 28,
                paddingBottom: 12,
                minHeight: 64,
                flexShrink: 0,
                flexWrap: 'wrap',
                rowGap: 20,
              },
            ]}
          >
            <View style={[s.row, { gap: 6 }]}>
              {slides.map((_, i) => (
                <Pressable
                  key={i}
                  onPress={() => setIndex(i)}
                  accessibilityLabel={`Onboarding page ${i + 1}`}
                  accessibilityRole="button"
                  hitSlop={10}
                >
                  <View style={[w.dot, i === index && w.activeDot]} />
                </Pressable>
              ))}
            </View>
            <View style={s.row}>
              {index > 0 && (
                <IconButton
                  name="back"
                  label="Previous page"
                  onPress={() => setIndex(index - 1)}
                />
              )}
              <Button
                style={{ minWidth: 132, flexShrink: 0 }}
                title={index === 3 ? 'Get Started' : 'Continue'}
                onPress={() =>
                  index === 3 ? finishOnboarding() : setIndex(index + 1)
                }
              />
            </View>
          </View>
        </Entrance>
      </ScrollView>
    </View>
  );
}
const w = StyleSheet.create({
  logo: {
    position: 'absolute',
  },
  loader: { position: 'absolute', height: 32, left: 0, right: 0 },
  web: { backgroundColor: 'transparent' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#94a39a',
    fontSize: 12,
  },
  skip: {
    borderRadius: 24,
    backgroundColor: '#252127b0',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  copy: { paddingHorizontal: 28, flexGrow: 1, flexShrink: 0 },
  dot: { height: 6, width: 6, borderRadius: 8, backgroundColor: '#424242' },
  activeDot: { width: 26, backgroundColor: '#a8ffcb' },
});
