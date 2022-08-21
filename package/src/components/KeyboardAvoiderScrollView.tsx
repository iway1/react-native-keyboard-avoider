import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { KeyboardEventListener, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollViewProps, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { Easing, Layout, scrollTo, useAnimatedRef, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { DEFAULT_ANIMATION_TIME, DEFAULT_EXTRA_SPACE } from "../defaults";
import { useKeyboardHandlers } from "../hooks";
import { closeAnimation, measureFocusedInputBottomYAsync } from "../utilities";

const ScrollContext = createContext<{ 
    registerView: ({view, id,}:{view: View, id: string}) => void,
    unregisterView: (id: string)=>void,
} | null>(null);

interface Props extends ScrollViewProps {
    /**
     * Extra space between the keyboard and the keyboard avoiding element.
     * Defaults to 20.
     */
    extraSpace?: number,

    /**
     * Duration of the keyboard avoiding animation.
     */
    animationTime?: number,

    /**
     * What to do when the keyboard hides on iOS.
     * @option 'stay' - *Default* scroll view will not move when the keyboard hides (it will stay where it is.)
     * @option 'revert' - Scroll view will return to its original position when the keyboard hides. 
     */
    iosHideBehavior?: 'stay' | 'revert',
}

async function measureView(view: View) {
    return new Promise<{ top: number, bottom: number }>(resolve => {
        view.measure((x, y, width, height, px, py) => {
            resolve({ bottom: py + height, top: py });
        })
    })
}

export default function KeyboardAvoiderScrollView({
    extraSpace = DEFAULT_EXTRA_SPACE,
    animationTime=DEFAULT_ANIMATION_TIME,
    iosHideBehavior='stay',
    ...props
}: Props) {
    const scrollviewRef = useAnimatedRef<ScrollView>();
    const registeredSectionViews = useRef<{[id: string]: View}>({});
    const keyboardTopRef = useRef<number>(0);
    const currentScroll = useRef<number>(0);
    const scrollMax = useRef<number>(0);
    const androidPannedBy = useRef<number>(0);
    const androidFocusScrolledBy = useRef<number>(0);
    const scrollViewHeight = useRef<number>(0);
    const spacerHasLayout = useRef<boolean>(false);
    const scroll = useSharedValue(0);
    const yTranslate = useSharedValue(0);

    const yTranslateStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: yTranslate.value }]
    }))

    useDerivedValue(() => {
        scrollTo(scrollviewRef, 0, scroll.value, false)
    })

    function scrollBy(y: number) {
        yTranslate.value = withTiming(-y, { duration: animationTime })
    }

    async function scrollToKeyboard(y: number, keyboardY: number, inputBottomY: number) {
        spacerHasLayout.current = false;

        if (Platform.OS == 'android') {
            androidPannedBy.current = Math.max(0, inputBottomY - keyboardY);
            console.log("Panned by: ", androidPannedBy.current)
            const s = Math.max(y - keyboardY + extraSpace - androidPannedBy.current, 0);
            scrollBy(s)
            return;
        } else if (Platform.OS == 'ios') {

            const scrollByY = y + extraSpace - keyboardY;
            if (scrollByY <= 0) return;
            scrollBy(scrollByY)
        }
    }

    const handleKeyboardWillShow: KeyboardEventListener = (e) => {
        keyboardTopRef.current = e.endCoordinates.screenY;
        const promises = Object.values(registeredSectionViews.current).map(e => measureView(e));
        (async function () {
            const inputMeasurePromise = measureFocusedInputBottomYAsync();
            const sectionViewMeasures = await Promise.all(promises);
            const inputMeasure = await inputMeasurePromise;

            for (var sectionMeasure of sectionViewMeasures) {
                if (inputMeasure <= sectionMeasure.bottom && inputMeasure >= sectionMeasure.top) {
                    scrollToKeyboard(sectionMeasure.bottom, e.endCoordinates.screenY, inputMeasure)
                    return;
                }
            }
            scrollToKeyboard(inputMeasure, e.endCoordinates.screenY, inputMeasure)
        })()
    }

    function handleKeyboardWillHide() {
        if(Platform.OS == 'android' || iosHideBehavior == 'revert') {
            yTranslate.value = withTiming(0, closeAnimation(animationTime))
            return;
        }
        const scrollsToAdjustedForTranslate = currentScroll.current - yTranslate.value;
        const scrollY = Math.min(scrollsToAdjustedForTranslate, scrollMax.current)
        
        if(scrollsToAdjustedForTranslate >= scrollMax.current) {
            // In cases where there is no room to actually scroll the scroll view we just animate back to the
            // start position.
            yTranslate.value = withTiming(0, closeAnimation(animationTime))
            return;
        }
        
        scrollviewRef.current?.scrollTo({ y: scrollY, animated: false },)
        yTranslate.value = 0;
    }

    useKeyboardHandlers({
        showHandler: handleKeyboardWillShow,
        hideHandler: handleKeyboardWillHide
    })
    return (
        <ScrollContext.Provider
            value={
                useMemo(() => {
                    return {
                        registerView: ({id, view}) => {
                            registeredSectionViews.current[id] = view
                        },
                        unregisterView: (id)=>{
                            delete registeredSectionViews.current[id];//
                        }
                    }
                }, [])
            }
        >
            <ScrollView
                ref={scrollviewRef}
                scrollEventThrottle={1}
                {...props}
                onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                    if (props.onScroll) props.onScroll(e);
                    currentScroll.current = e.nativeEvent.contentOffset.y
                    scrollMax.current = e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height
                    scrollViewHeight.current = e.nativeEvent.layoutMeasurement.height;
                }}
            >
                <Animated.View
                    style={[yTranslateStyle, { flex: 1, }]}
                >
                    {props.children}
                </Animated.View>
            </ScrollView>
        </ScrollContext.Provider>
    )
}

export function useScrollViewContext() {
    return useContext(ScrollContext);
}