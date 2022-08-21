import React from "react";
import { useRef } from "react";
import { Platform } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { DEFAULT_ANIMATION_TIME, DEFAULT_EXTRA_SPACE } from "../defaults";
import { useKeyboardHandlers } from "../hooks";
import { calcAndroidSystemPan, closeAnimation, measureFocusedInputBottomY, openAnimation } from "../utilities";

export default function KeyboardAvoiderInsets({
    animationTime = DEFAULT_ANIMATION_TIME,
    extraSpace = DEFAULT_EXTRA_SPACE,
}: {
    /**
     * Duration of the keyboard avoiding animation.
     */
    animationTime?: number,
    /**
     * Extra space between the keyboard avoiding element and the keyboard.
     */
    extraSpace?: number,
}) {
    const heightAnimatedValue = useSharedValue<number>(0);
    const animatedRef = useRef<Animated.View | null>(null);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: heightAnimatedValue.value,
        }
    })

    useKeyboardHandlers({
        showHandler: (e) => {
            if (Platform.OS == 'android') {
                measureFocusedInputBottomY((inputBottomY)=>{
                    const systemPan = calcAndroidSystemPan({
                        inputBottomY,
                        keyboardEndY: e.endCoordinates.screenY,
                    })
                    animatedRef.current?.measure((x, y, width, height, pageX, pageY) => {
                        const delta = Math.max(0, (pageY + extraSpace) - e.endCoordinates.screenY - systemPan);
                        if (delta) {
                            heightAnimatedValue.value = withTiming(delta, openAnimation(animationTime))
                        }
                    })
                })
            } else {
                animatedRef.current?.measure((x, y, width, height, pageX, pageY) => {
                    const delta = Math.max(0, (pageY + extraSpace) - e.endCoordinates.screenY);
                    if (delta) {
                        heightAnimatedValue.value = withTiming(delta, openAnimation(animationTime))
                    }
                })
            }

        },
        hideHandler: () => {
            heightAnimatedValue.value = withTiming(0, closeAnimation(animationTime))
        }
    })

    return (
        <Animated.View ref={animatedRef} style={animatedStyle} />
    )
}