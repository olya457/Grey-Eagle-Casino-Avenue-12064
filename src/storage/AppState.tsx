import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
export type Message = { id: string; role: 'user' | 'assistant'; text: string };
type StoredState = {
  onboarded: boolean;
  favorites: string[];
  savedResources: string[];
  codes: Record<string, string>;
  messages: Message[];
};
type StateContext = StoredState & {
  ready: boolean;
  finishOnboarding: () => void;
  toggleFavorite: (id: string) => void;
  toggleResource: (id: string) => void;
  saveCode: (id: string, code: string) => void;
  addMessages: (messages: Message[]) => void;
  clearMessages: () => void;
};
const initial: StoredState = {
  onboarded: false,
  favorites: [],
  savedResources: [],
  codes: {},
  messages: [],
};
export const STORAGE_KEY = '@grey-eagle/local-state/v1';
const Context = createContext<StateContext | null>(null);
export function AppStateProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<StoredState>(initial);
  const current = useRef<StoredState>(initial);
  const [ready, setReady] = useState(false);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => {
        if (!raw || !active) {
          return;
        }
        const data = JSON.parse(raw);
        const loaded: StoredState = {
          onboarded: data.onboarded === true,
          savedResources: Array.isArray(data.savedResources)
            ? data.savedResources.filter(
                (id: unknown) => typeof id === 'string',
              )
            : [],
          favorites: Array.isArray(data.favorites)
            ? data.favorites.filter((v: unknown) => typeof v === 'string')
            : [],
          codes:
            data.codes && typeof data.codes === 'object'
              ? (Object.fromEntries(
                  Object.entries(data.codes).filter(
                    ([, v]) => typeof v === 'string',
                  ),
                ) as Record<string, string>)
              : {},
          messages: Array.isArray(data.messages)
            ? data.messages.filter(
                (m: Message) =>
                  typeof m?.id === 'string' &&
                  typeof m.text === 'string' &&
                  ['user', 'assistant'].includes(m.role),
              )
            : [],
        };
        current.current = loaded;
        setState(loaded);
      })
      .catch(() => {
        Alert.alert(
          'Storage unavailable',
          'Your saved information could not be loaded. Please restart the app before making changes.',
        );
      })
      .finally(() => {
        if (active) {
          setReady(true);
        }
      });
    return () => {
      active = false;
    };
  }, []);
  const update = (change: (value: StoredState) => StoredState) => {
    const next = change(current.current);
    current.current = next;
    setState(next);
    queue.current = queue.current
      .then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)))
      .catch(() => {
        Alert.alert(
          'Could not save',
          'Your changes are available for this session. Please check device storage and try again.',
        );
      });
  };
  return (
    <Context.Provider
      value={{
        ...state,
        ready,
        finishOnboarding: () => update(v => ({ ...v, onboarded: true })),
        toggleFavorite: id =>
          update(v => ({
            ...v,
            favorites: v.favorites.includes(id)
              ? v.favorites.filter(f => f !== id)
              : [...v.favorites, id],
          })),
        toggleResource: id =>
          update(v => ({
            ...v,
            savedResources: v.savedResources.includes(id)
              ? v.savedResources.filter(value => value !== id)
              : [...v.savedResources, id],
          })),
        saveCode: (id, code) =>
          update(v => {
            const codes = { ...v.codes };
            if (code.trim()) {
              codes[id] = code.trim();
            } else {
              delete codes[id];
            }
            return { ...v, codes };
          }),
        addMessages: messages =>
          update(v => ({ ...v, messages: [...v.messages, ...messages] })),
        clearMessages: () => update(v => ({ ...v, messages: [] })),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAppState() {
  const state = useContext(Context);
  if (!state) {
    throw new Error('AppStateProvider is missing');
  }
  return state;
}
