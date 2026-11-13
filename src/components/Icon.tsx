import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
export type IconName =
  | 'events'
  | 'dining'
  | 'hotel'
  | 'tours'
  | 'explore'
  | 'back'
  | 'next'
  | 'heart'
  | 'search'
  | 'close'
  | 'check'
  | 'chat'
  | 'ticket'
  | 'copy'
  | 'pin';
export function Icon({
  name,
  color = '#92949f',
  size = 22,
  filled = false,
}: {
  name: IconName;
  color?: string;
  size?: number;
  filled?: boolean;
}) {
  const paths: Partial<Record<IconName, string>> = {
    dining:
      'M5 3v6m3-6v6M2 3v6c0 3 6 3 6 0M5 12v9M17 3c-4 4-4 10 0 10h2M19 3v18',
    hotel: 'M3 19V6m18 13V9M3 16h18M3 9h6v7M9 10h12',
    tours: 'm16 8-3 5-5 3 3-5 5-3',
    explore: 'm3 10 9-7 9 7M5 9v12h14V9M10 21v-8h4v8',
    back: 'm14 5-7 7 7 7',
    next: 'm9 5 7 7-7 7',
    heart:
      'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
    search: 'm16 16 5 5',
    close: 'm6 6 12 12M6 18 18 6',
    check: 'm5 12 4 4L19 6',
    chat: 'M4 4h16v12H9l-5 4V4Z',
    ticket:
      'M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V6Zm12 1v2m0 2v2m0 2v2',
    copy: 'M8 8h12v13H8V8ZM16 8V3H3v13h5',
    pin: 'M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 0 1 14 0Z',
  };
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === 'events' && (
        <>
          <Rect x={3} y={5} width={18} height={16} rx={3} />
          <Path d="M7 3v5m10-5v5M3 11h18" />
        </>
      )}
      {name === 'tours' && <Circle cx={12} cy={12} r={9} />}
      {name === 'search' && <Circle cx={10} cy={10} r={6} />}
      {name === 'pin' && <Circle cx={12} cy={10} r={2} />}
      {paths[name] && (
        <Path
          d={paths[name]}
          fill={name === 'heart' && filled ? color : 'none'}
        />
      )}
    </Svg>
  );
}
