import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useReducedMotion } from '../hooks/useReducedMotion';
export function useEntrance(trigger: unknown = true, delay = 0) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    progress.stopAnimation();
    if (reduced || trigger === false) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 440,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reduced, trigger, delay]);
  return {
    opacity: progress,
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
    ],
  };
}
export function Entrance({
  children,
  style,
  trigger,
  delay = 0,
}: PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  trigger?: unknown;
  delay?: number;
}>) {
  const motion = useEntrance(trigger, delay);
  return <Animated.View style={[style, motion]}>{children}</Animated.View>;
}
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export function MotionPressable({
  style,
  onPressIn,
  onPressOut,
  ...props
}: PressableProps) {
  const reduced = useReducedMotion();
  const [pressed, setPressed] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const animate = (toValue: number) => {
    scale.stopAnimation();
    if (reduced) {
      scale.setValue(1);
      return;
    }
    Animated.spring(scale, {
      toValue,
      speed: 28,
      bounciness: 3,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => () => scale.stopAnimation(), [scale]);
  return (
    <AnimatedPressable
      {...props}
      onPressIn={event => {
        setPressed(true);
        animate(0.975);
        onPressIn?.(event);
      }}
      onPressOut={event => {
        setPressed(false);
        animate(1);
        onPressOut?.(event);
      }}
      style={[
        typeof style === 'function' ? style({ pressed }) : style,
        { transform: [{ scale }] },
      ]}
    />
  );
}
