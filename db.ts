import { init } from '@instantdb/react-native';
import schema from './instant.schema';

const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID!;

if (!APP_ID) {
  throw new Error('Missing InstantDB app ID');
}

export const db = init({ schema, appId: APP_ID });
