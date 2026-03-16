import '../../global.css';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function RootLayout() {
    return (
        <GestureHandlerRootView className='flex-1'>
            <StatusBar barStyle='dark-content' />
            <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}/>
        </GestureHandlerRootView>
    );
}
