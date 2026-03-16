import { MoveableElementProps } from "../utils";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Text, View } from "react-native";
import { scheduleOnRN } from "react-native-worklets";
import { useEffect } from "react";

export function MovableElement({
    element,
    onMove,
    onSelect,
    isSelected,
}: MoveableElementProps) {

    const renderElement = () => {
        switch (element.type) {
            case "rectangle":
                return (
                    <View
                        style={{
                            borderRadius: 8,
                            boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                            backgroundColor: element.color,
                            width: element.width || 80,
                            height: element.height || 60,
                        }}
                    />
                );
            case "circle":
                return (
                    <View
                        style={{
                            borderRadius: 100,
                            boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                            backgroundColor: element.color,
                            width: element.width || 60,
                            height: element.height || 60,
                        }}
                    />
                );
            case "triangle":
                return (
                    <View
                        style={{
                            width: 0,
                            height: 0,
                            backgroundColor: "transparent",
                            borderStyle: "solid",
                            borderLeftColor: "transparent",
                            borderRightColor: "transparent",
                            borderBottomColor: element.color,
                            borderBottomWidth: element.height || 60,
                            borderLeftWidth: (element.width || 60) / 2,
                            borderRightWidth: (element.width || 60) / 2,
                        }}
                    />
                );
            case "diamond":
                return (
                    <View
                        style={{
                            transform: [{ rotate: "45deg" }],
                            borderRadius: 4,
                            boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                            backgroundColor: element.color,
                            width: element.width || 60,
                            height: element.height || 60,
                        }}
                    />
                );
            case "star":
                return (
                    <View className="justify-center items-center">
                        <Text
                            style={{
                                fontWeight: "bold",
                                textShadowColor: "rgba(0,0,0,0.1)",
                                textShadowOffset: { width: 0, height: 1 },
                                textShadowRadius: 2,
                                color: element.color,
                                fontSize: (element.width || 70) * 0.8,
                            }}
                        >
                            ★
                        </Text>
                    </View>
                );
            case "hexagon":
                return (
                    <View className="justify-center items-center">
                        <Text
                            style={{
                                fontWeight: "bold",
                                textShadowColor: "rgba(0,0,0,0.1)",
                                textShadowOffset: { width: 0, height: 1 },
                                textShadowRadius: 2,
                                color: element.color,
                                fontSize: (element.width || 70) * 0.8,
                            }}
                        >
                            ⬡
                        </Text>
                    </View>
                );
            default:
                return null;
        }
    };

    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: element.x + translateX.value },
                { translateY: element.y + translateY.value },
                { scale: scale.value }
            ],
        };
    });

    const panGesture = Gesture.Pan()
        .onStart(() => {
            scale.value = withSpring(1.1);
            scheduleOnRN(onSelect, element.id);
        })
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd((event) => {
            scale.value = withSpring(1);
            const newX = element.x + event.translationX;
            const newY = element.y + event.translationY;
            scheduleOnRN(onMove, element.id, newX, newY);
        });

    useEffect(() => {
        translateX.value = 0;
        translateY.value = 0;
    }, [element.x, element.y, translateX, translateY]);

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View className='absolute p-2'
                style={[
                    animatedStyle,
                    isSelected && {
                        borderWidth: 2,
                        borderColor: "#6366F1",
                        borderStyle: "dashed",
                        borderRadius: 5,
                        boxShadow: "0 2px 4px 0 rgba(99, 102, 241, 0.3)",
                    },
                ]}
            >
                {renderElement()}
            </Animated.View>
        </GestureDetector>
    );
}
