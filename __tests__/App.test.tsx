import React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppStateProvider,
  STORAGE_KEY,
  useAppState,
} from '../src/storage/AppState';
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);
let state: ReturnType<typeof useAppState>;
function Consumer() {
  state = useAppState();
  return null;
}
async function mount() {
  let tree: ReactTestRenderer;
  await act(async () => {
    tree = create(
      <AppStateProvider>
        <Consumer />
      </AppStateProvider>,
    );
  });
  return tree!;
}
beforeEach(async () => {
  await AsyncStorage.clear();
});
test('starts empty and restores user changes after remounting', async () => {
  const tree = await mount();
  expect(state.ready).toBe(true);
  expect(state.favorites).toEqual([]);
  expect(state.codes).toEqual({});
  await act(async () => {
    state.toggleFavorite('venues-1-dish-1');
    state.saveCode('events-1', '  USER-CODE  ');
    state.finishOnboarding();
    state.addMessages([
      { id: 'user-message', role: 'user', text: 'Is parking free?' },
    ]);
  });
  await act(async () => {
    tree.unmount();
  });
  const restored = await mount();
  expect(state.favorites).toEqual(['venues-1-dish-1']);
  expect(state.codes['events-1']).toBe('USER-CODE');
  expect(state.onboarded).toBe(true);
  expect(state.messages).toHaveLength(1);
  await act(async () => {
    state.toggleFavorite('venues-1-dish-1');
    state.saveCode('events-1', '');
    state.clearMessages();
  });
  expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEY))!)).toEqual({
    onboarded: true,
    favorites: [],
    savedResources: [],
    codes: {},
    messages: [],
  });
  await act(async () => {
    restored.unmount();
  });
});
test('rapid toggles do not lose or duplicate favorite changes', async () => {
  const tree = await mount();
  await act(async () => {
    state.toggleFavorite('dish-a');
    state.toggleFavorite('dish-b');
    state.toggleFavorite('dish-a');
  });
  expect(state.favorites).toEqual(['dish-b']);
  expect(
    JSON.parse((await AsyncStorage.getItem(STORAGE_KEY))!).favorites,
  ).toEqual(['dish-b']);
  await act(async () => {
    tree.unmount();
  });
});

test('old saved data migrates without losing user content and reading list persists', async () => {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      onboarded: true,
      favorites: ['dish-existing'],
      codes: { 'events-1': 'MY-CODE' },
      messages: [],
    }),
  );
  const tree = await mount();
  expect(state.savedResources).toEqual([]);
  await act(async () => {
    state.toggleResource('confluence-guide');
    state.toggleResource('embrace-buffalo');
  });
  await act(async () => {
    tree.unmount();
  });
  const restored = await mount();
  expect(state.savedResources).toEqual(['confluence-guide', 'embrace-buffalo']);
  expect(state.favorites).toEqual(['dish-existing']);
  expect(state.codes['events-1']).toBe('MY-CODE');
  await act(async () => {
    state.toggleResource('confluence-guide');
  });
  expect(state.savedResources).toEqual(['embrace-buffalo']);
  await act(async () => {
    restored.unmount();
  });
});
