import React, {
    ComponentProps,
    useEffect,
    useRef,
    useState,
} from 'react'
import {
    KeyboardEventListener,
    Platform,
} from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'
import { useKeyboardHandlers } from '../hooks'
import { closeAnimation, measureFocusedInputBottomY, openAnimation } from '../utilities'
import { CommonProps, defaultCommonProps } from './common-props'

export type KeyboardAvoidMode = 'whole-view' | 'focused-input';

export default function KeyboardAvoiderView({
    animationEasing = defaultCommonProps.animationEasing,
    animationTime = defaultCommonProps.animationTime,
    extraSpace = defaultCommonProps.extraSpace,
    enableAndroid = true,
    avoidMode = 'whole-view',
    ...props
}: ComponentProps<typeof Animated.View> & CommonProps & {
    /**
     * Enable on android. Defaults to true to ensure consistent behavior.
     */
    enableAndroid?: boolean,
    /**
     * Sets the avoid mode. Defaults to 'whole-view'.
     * @option 'whole-view' - view moves to show the entire view when the keyboard is shown.
     * @option 'focused-input' - view moves to show only the focused text input.
     */
    avoidMode?: KeyboardAvoidMode,
}) {
    const ref = useRef<null | Animated.View>(null)
    const [scrollToElementBottomY, setScrollToElementBottomY] = useState<number | null>(null)
    const animation = useSharedValue(0)
    const keyboardTopRef = useRef<number>(0)

    const handleKeyboardWillShow: KeyboardEventListener = (e) => {
        keyboardTopRef.current = e.endCoordinates.screenY

        if (Platform.OS == 'android') {
            measureFocusedInputBottomY((inputBottomY) => {
                const pannedBy = Math.max(inputBottomY - e.endCoordinates.screenY, 0);
                if (avoidMode == 'focused-input') {
                    setScrollToElementBottomY(inputBottomY - pannedBy)
                    return;
                }
                ref.current?.measure((x, y, w, viewHeight, px, viewPageY) => {
                    setScrollToElementBottomY(
                        viewPageY + viewHeight + animation.value - pannedBy,
                    )
                })
            })
            return
        }
        //ios
        if (avoidMode == 'whole-view') {
            ref.current?.measure((x, y, w, h, px, py) => {
                setScrollToElementBottomY(py + h + animation.value)
            })
        } else if (avoidMode == 'focused-input') {
            measureFocusedInputBottomY((inputBottomY) => {
                setScrollToElementBottomY(inputBottomY + animation.value)
            })
        }
    }

    function handleKeyboardWillHide() {
        setScrollToElementBottomY(null)
    }

    useKeyboardHandlers({
        showHandler: handleKeyboardWillShow,
        hideHandler: handleKeyboardWillHide,
        enabled: enableAndroid || Platform.OS !== 'android',
    }, [avoidMode, extraSpace, animationTime])

    function pos(scrollTo: number) {
        return scrollTo - keyboardTopRef.current + extraSpace
    }

    useEffect(() => {
        if (scrollToElementBottomY === null) {
            animation.value = withTiming(0, closeAnimation(animationTime, animationEasing))
            return
        }
        const p = pos(scrollToElementBottomY);
        if (p <= 0) return
        if (animation.value !== p) {
            animation.value = withTiming(p, openAnimation(animationTime, animationEasing))
        }
    }, [scrollToElementBottomY])

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: -animation.value }],
    }))

    return (
        <Animated.View
            {...props}
            style={[props.style, animatedStyle]}
            ref={ref}
        />
    )
}