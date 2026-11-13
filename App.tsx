import { MotionPreferencesProvider } from './src/hooks/useReducedMotion';
import React, { useState } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStateProvider, useAppState } from './src/storage/AppState';
import { AppNavigator } from './src/navigation/AppNavigator';
import { Onboarding, Splash } from './src/screens/Welcome';
function AppContent() {
  const { ready, onboarded } = useAppState();
  const [splashFinished, setSplashFinished] = useState(false);
  if (!splashFinished || !ready) {
    return <Splash onFinish={() => setSplashFinished(true)} />;
  }
  return onboarded ? <AppNavigator /> : <Onboarding />;
}
export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <MotionPreferencesProvider>
          <AppStateProvider>
            <AppContent />
          </AppStateProvider>
        </MotionPreferencesProvider>
      </View>
    </SafeAreaProvider>
  );
}
