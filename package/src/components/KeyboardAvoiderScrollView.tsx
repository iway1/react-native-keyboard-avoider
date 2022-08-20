import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Alert, findNodeHandle, Keyboard, KeyboardEventListener, NativeScrollEvent, Platform, ScrollResponderEvent, ScrollViewProps, TextInput, UIManager, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { Layout, scrollTo, useAnimatedRef, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { DEFAULT_ANIMATION_TIME, DEFAULT_EXTRA_SPACE } from "../defaults";
import { useKeyboardHandlers } from "../hooks";
import { measureFocusedInputBottomY, measureFocusedInputBottomYAsync } from "../utilities";

const ScrollContext = createContext<{ registerView: (view: View) => void } | null>(null);

interface Props extends ScrollViewProps {
    /**
     * Extra space between the keyboard and the keyboard avoiding element.
     * Defaults to 20.
     */
    extraSpace?: number,
    /**
     * If true, the scroll view will scroll when the keyboard closes on android by the system pan amount.
     * This attempts to mimic the iOS behavior. Defaults to true.
     */
    androidScrollOnClose?: boolean,
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
    androidScrollOnClose = false,
    ...props
}: Props) {
    const scrollviewRef = useAnimatedRef<ScrollView>();
    const registeredSectionViews = useRef<View[]>([]);
    const keyboardTopRef = useRef<number>(0);
    const currentScroll = useRef<number>(0);
    const scrollMax = useRef<number>(0);
    const androidPannedBy = useRef<number>(0);
    const androidFocusScrolledBy = useRef<number>(0);
    const scrollViewHeight = useRef<number>(0);
    const spacerHasLayout = useRef<boolean>(false);
    const [bottomInset, setBottomInset] = useState<number>(0);
    const scroll = useSharedValue(0);
    const yTranslate = useSharedValue(0);

    const yTranslateStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: yTranslate.value }]
    }))

    useDerivedValue(() => {
        scrollTo(scrollviewRef, 0, scroll.value, false)
    })

    function scrollBy(y: number, animated: boolean = true) {
        yTranslate.value = withTiming(-y, { duration: DEFAULT_ANIMATION_TIME })
        // scrollviewRef.current?.scrollTo({ y: currentScroll.current! + y, animated })
    }

    function scrollAndHandleOverflowWithInsets(scrollByY: number) {
        const maxScrollableSpace = scrollMax.current - currentScroll.current - scrollViewHeight.current;
        const rem = scrollByY - Math.min(scrollByY, maxScrollableSpace);
        if (rem) {
            scrollBy(scrollByY - rem);
            setBottomInset(rem);
            return scrollByY - rem;
        } else {
            scrollBy(scrollByY);
            return scrollByY
        }
    }

    function scrollToKeyboard(y: number, keyboardY: number) {
        spacerHasLayout.current = false;
        if (Platform.OS == 'android') {
            androidPannedBy.current = Math.max(0, y - keyboardY);
            if (androidPannedBy.current) {
                androidFocusScrolledBy.current = scrollAndHandleOverflowWithInsets(extraSpace);
            } else {
                // might need to scroll to ensure extra space is met.
                const distance = keyboardY - y;
                if (distance > 0 && distance < extraSpace) {
                    const scroll = extraSpace - distance;
                    androidFocusScrolledBy.current = scrollAndHandleOverflowWithInsets(scroll);;
                }
            }
            return;
        } else if (Platform.OS == 'ios') {

            const scrollByY = y + extraSpace - keyboardY;
            if (scrollByY <= 0) return;
            scrollAndHandleOverflowWithInsets(scrollByY)
        }
    }

    const handleKeyboardWillShow: KeyboardEventListener = (e) => {
        keyboardTopRef.current = e.endCoordinates.screenY;
        const promises = registeredSectionViews.current.map(e => measureView(e));
        const t = new Date().getTime();

        (async function () {
            const inputMeasurePromise = measureFocusedInputBottomYAsync();
            const sectionViewMeasures = await Promise.all(promises);
            const inputMeasure = await inputMeasurePromise;

            for (var sectionMeasure of sectionViewMeasures) {
                if (inputMeasure <= sectionMeasure.bottom && inputMeasure >= sectionMeasure.top) {
                    scrollToKeyboard(sectionMeasure.bottom, e.endCoordinates.screenY)
                    return;
                }
            }
            scrollToKeyboard(inputMeasure, e.endCoordinates.screenY)
        })()


    }
    function handleKeyboardWillHide() {
        setBottomInset(0);
        scrollviewRef.current?.scrollTo({ y: currentScroll.current - yTranslate.value, animated: false },)
        yTranslate.value = 0;
        if (Platform.OS == 'android' && androidPannedBy.current && androidScrollOnClose) {
            scrollBy(androidPannedBy.current - androidFocusScrolledBy.current, false)
        }
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
                        registerView: (view) => {
                            registeredSectionViews.current.push(view);
                        }
                    }
                }, [])
            }
        >
            <ScrollView
                ref={scrollviewRef}
                scrollEventThrottle={1}
                keyboardDismissMode='interactive'
                {...props}
                onScroll={(e: any) => {
                    if (props.onScroll) props.onScroll(e);
                    currentScroll.current = e.nativeEvent.contentOffset.y
                    scrollMax.current = e.nativeEvent.contentSize.height
                    scrollViewHeight.current = e.nativeEvent.layoutMeasurement.height;
                }}

            >
                <Animated.View
                    style={[yTranslateStyle, { flex: 1, }]}
                >
                    {props.children}
                    {!!bottomInset &&
                        <Animated.View
                            style={{
                                height: bottomInset
                            }}
                            onLayout={() => {
                                // scrolling is deferred until this spacer view renders
                                if (!spacerHasLayout.current) {
                                    scrollviewRef.current?.scrollToEnd();
                                    spacerHasLayout.current = true;
                                }
                            }}
                            layout={Layout.duration(150)}
                        />
                    }
                </Animated.View>
            </ScrollView>
        </ScrollContext.Provider>
    )
}

export function useScrollViewContext() {
    return useContext(ScrollContext);
}