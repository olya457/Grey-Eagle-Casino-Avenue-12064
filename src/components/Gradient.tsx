import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';

export function Gradient({
  children,
  style,
  colors,
  start,
  end,
  locations,
  useAngle,
  angleCenter,
  angle,
  ...props
}: LinearGradientProps) {
  const rounded = StyleSheet.flatten(style);
  return (
    <View {...props} style={style}>
      <LinearGradient
        pointerEvents="none"
        colors={colors}
        start={start}
        end={end}
        locations={locations}
        useAngle={useAngle}
        angleCenter={angleCenter}
        angle={angle}
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: rounded?.borderRadius,
            borderTopLeftRadius: rounded?.borderTopLeftRadius,
            borderTopRightRadius: rounded?.borderTopRightRadius,
            borderBottomLeftRadius: rounded?.borderBottomLeftRadius,
            borderBottomRightRadius: rounded?.borderBottomRightRadius,
          },
        ]}
      />
      {children}
    </View>
  );
}
