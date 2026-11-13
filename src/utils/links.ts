import { Alert, Linking } from 'react-native';
export async function openLink(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(
      'Unable to open link',
      'Please check that a compatible browser, maps or phone app is available.',
    );
  }
}
export const directions = () =>
  openLink(
    'https://www.google.com/maps/search/?api=1&query=Grey+Eagle+Resort+Casino+3777+Grey+Eagle+Drive',
  );
