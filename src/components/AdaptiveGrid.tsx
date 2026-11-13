import { getGridMetrics } from '../utils/layout';
import React, { ReactNode, useState } from 'react';
import { View } from 'react-native';
import { Entrance } from './Motion';
import { useLayout } from '../hooks/useLayout';
export function AdaptiveGrid({
  children,
  minimum = 260,
}: {
  children: ReactNode;
  minimum?: number;
}) {
  const layout = useLayout();
  const [width, setWidth] = useState(layout.contentWidth);
  const { itemWidth } = getGridMetrics(width, minimum, layout.fontScale);
  return (
    <View
      testID="adaptive-grid"
      onLayout={event => setWidth(event.nativeEvent.layout.width)}
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: 16,
        alignItems: 'stretch',
      }}
    >
      {React.Children.toArray(children).map((child, index) => (
        <Entrance
          key={React.isValidElement(child) ? child.key ?? index : index}
          delay={Math.min(index, 5) * 45}
          style={{ width: itemWidth }}
        >
          {child}
        </Entrance>
      ))}
    </View>
  );
}
