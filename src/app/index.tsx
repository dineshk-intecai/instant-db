import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, getToolIcon, SketchElement, Tool } from '../utils';
import { db } from '@/db';
import { useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { id } from '@instantdb/react-native';
import { MovableElement } from '../components';
import { scheduleOnRN } from 'react-native-worklets';

const { height: screenHeight } = Dimensions.get('window');

export default function TapPanGesture() {

    const { data } = db.useQuery({
        elements: {},
    })
    const elements = data?.elements ?? [];

    const [toolbarHeight, setToolbarHeight] = useState(100);
    const [selectedTool, setSelectedTool] = useState<Tool>('circle');
    const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

    const addElement = (x: number, y: number) => {
        const elementId = id();
        let width = 60;
        let height = 60;

        if (selectedTool === 'rectangle') {
            width = 80;
            height = 60;
        } else if (selectedTool === 'star' || selectedTool === 'hexagon') {
            width = 70;
            height = 70;
        }

        db.transact(
            db.tx.elements[elementId].update({
                type: selectedTool,
                color: selectedColor,
                x,
                y,
                width,
                height,
                createdAt: Date.now(),
            })
        )
        setSelectedElementId(elementId);
    }

    const canvasTapGesture = Gesture.Tap().onEnd((event) => {
        if (event.y < screenHeight - toolbarHeight) {
            scheduleOnRN(addElement, event.x, event.y);
        }
    });

    const onMove = (id: string, x: number, y: number) => {
        if (id) {
            db.transact(
                db.tx.elements[id].update({
                    x,
                    y,
                })
            )
        }
    }

    const clearCanvas = () => {
        if (!elements.length) return;
        const ids = elements.map((element) => element.id);
        db.transact(
            ids.map((id: string) => db.tx.elements[id].delete())
        )
        setSelectedElementId(null);
    }

    return (
        <SafeAreaView className='flex-1 px-4 gap-4'>
            <GestureDetector gesture={canvasTapGesture}>
                <View className='flex-1 relative bg-[#fefafc] border border-[#dddddd] rounded-lg'>
                    {elements.map((element) => (
                        <MovableElement
                            key={element.id}
                            element={element as SketchElement}
                            isSelected={selectedElementId === element.id}
                            onSelect={() => setSelectedElementId(element.id)}
                            onMove={onMove}
                        />
                    ))}
                </View>
            </GestureDetector>

            <View
                onLayout={(e) => setToolbarHeight(e.nativeEvent.layout.height)}
                className='bg-[#fefefe] rounded-xl p-4 gap-4'
                style={{ elevation: 10, boxShadow: '0px 4px 12px 0 rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(10px)' }}
            >
                <View className='w-full flex-row justify-between bg-[#f5f5f5] p-3 rounded-lg'>
                    {(
                        [
                            "circle",
                            "rectangle",
                            "triangle",
                            "diamond",
                            "star",
                            "hexagon",
                        ] as const
                    ).map((tool) => (
                        <TouchableOpacity
                            key={tool}
                            activeOpacity={0.9}
                            style={[
                                { backgroundColor: selectedTool === tool ? '#fff' : '#f5f5f5' },
                                selectedTool === tool && {
                                    backgroundColor: selectedColor,
                                    boxShadow: "0 2px 4px 0 rgba(99, 102, 241, 0.3)",
                                },
                            ]}
                            className='w-12 h-12 justify-center items-center rounded-lg'
                            onPress={() => setSelectedTool(tool)}
                        >
                            <Text
                                style={{ color: selectedTool === tool ? '#fff' : '#6B7280' }}
                                className='font-medium android:mb-1 text-lg'
                            >
                                {getToolIcon(tool)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className='items-center justify-center gap-4'>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{ boxShadow: "0 2px 4px 0 rgba(239, 68, 68, 0.3)", }}
                        className='w-12 h-12 justify-center items-center rounded-lg bg-[#EF4444]'
                        onPress={clearCanvas}
                    >
                        <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>

                    <View className='flex-row items-center justify-center gap-4 bg-[#F9FAFB] p-2 rounded-lg'>
                        {COLORS.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    { backgroundColor: color, boxShadow: "0 2px 3px 0 rgba(0, 0, 0, 0.1)", },
                                    selectedColor === color && {
                                        borderColor: "#FFFFFF",
                                        borderWidth: 3,
                                        boxShadow: "0 4px 6px 0 rgba(0, 0, 0, 0.2)",
                                        transform: [{ scale: 1.3 }],
                                    },
                                ]}
                                onPress={() => setSelectedColor(color)}
                                activeOpacity={0.9}
                                className='w-9 h-9 border-2 border-transparent rounded-full'
                            />
                        ))}
                    </View>
                </View>

            </View>

        </SafeAreaView>
    );
}
