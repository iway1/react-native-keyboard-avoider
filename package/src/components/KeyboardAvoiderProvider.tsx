import React, { createContext, ReactNode, useContext, useState } from "react";
import { Dimensions, View } from "react-native";

const KeyboardAvoidingContext = createContext<{ appHeight: number }>({ appHeight: 0 })

export default function KeyboardAvoiderProvider({
    children,
}: {
    children: ReactNode
}) {
    const [appHeight, setAppHeight] = useState<number>(Dimensions.get('window').height);

    return (
        <KeyboardAvoidingContext.Provider
            value={{
                appHeight,
            }}
        >
            <View
                style={{
                    flex: 1,
                }}
                onLayout={(e)=>setAppHeight(e.nativeEvent.layout.height)}
            >
                {children}
            </View>
        </KeyboardAvoidingContext.Provider>
    )
}

export function useAppHeight() {
    return useContext(KeyboardAvoidingContext);
}