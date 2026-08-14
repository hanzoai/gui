// NATIVE key/value store — AsyncStorage. Split so the web bundle (store.web.ts) uses
// localStorage directly and never pulls the native module into the web build.

import AsyncStorage from '@react-native-async-storage/async-storage'

export const getItem = (key: string): Promise<string | null> => AsyncStorage.getItem(key)
export const setItem = (key: string, value: string): Promise<void> =>
  AsyncStorage.setItem(key, value)
export const removeItem = (key: string): Promise<void> => AsyncStorage.removeItem(key)
