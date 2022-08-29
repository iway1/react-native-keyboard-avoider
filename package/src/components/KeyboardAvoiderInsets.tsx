import React from "react";
import { useRef } from "react";
import { Platform } from "react-native";
import Animated, { EasingFn, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useKeyboardHandlers } from "../hooks";
import { calcAndroidSystemPan, closeAnimation, measureFocusedInputBottomY, openAnimation } from "../utilities";
import { CommonProps, defaultCommonProps } from "./common-props";

export default function KeyboardAvoiderInsets({
    animationEasing=defaultCommonProps.animationEasing,
    animationTime=defaultCommonProps.animationTime,
    extraSpace=defaultCommonProps.extraSpace
}:CommonProps) {
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
                measureFocusedInputBottomY((inputBottomY) => {
                    const systemPan = calcAndroidSystemPan({
                        inputBottomY,
                        keyboardEndY: e.endCoordinates.screenY,
                    })
                    animatedRef.current?.measure((x, y, width, height, pageX, pageY) => {
                        const delta = Math.max(0, (pageY + extraSpace) - e.endCoordinates.screenY - systemPan);
                        if (delta) {
                            heightAnimatedValue.value = withTiming(delta, {
                                easing: animationEasing,
                                duration: animationTime
                            })
                        }
                    })
                })
            } else {
                animatedRef.current?.measure((x, y, width, height, pageX, pageY) => {
                    const delta = Math.max(0, (pageY + extraSpace) - e.endCoordinates.screenY);
                    if (delta) {
                        heightAnimatedValue.value = withTiming(delta, openAnimation(animationTime, animationEasing))
                    }
                })
            }

        },
        hideHandler: () => {
            heightAnimatedValue.value = withTiming(0, closeAnimation(animationTime, animationEasing))
        }
    })

    return (
        <Animated.View ref={animatedRef} style={animatedStyle} />
    )
}