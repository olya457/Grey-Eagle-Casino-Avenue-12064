import { createContext, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLayout } from '../utils/layout';
export const SceneWidthInsetContext = createContext(0);
export function useLayout() {
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const sceneInset = useContext(SceneWidthInsetContext);
  return {
    ...getLayout(
      width - sceneInset,
      height,
      fontScale,
      insets.left,
      insets.right,
    ),
    wide: width > height,
  };
}
