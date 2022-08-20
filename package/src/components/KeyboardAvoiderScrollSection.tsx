import { View, ViewProps } from "react-native";
import { useScrollViewContext } from "./KeyboardAvoiderScrollView";
import React, { useRef } from "react";

export default function KeyboardAvoiderScrollSection(props: ViewProps) {
    const ref = useRef<View | null>(null);
    const hasSetRef = useRef<boolean>(false);
    const context = useScrollViewContext();
    
    if(context!==null){
        return (
            <View
                {...props}
                ref={ref}
                onLayout={()=>{
                    if(!hasSetRef.current && ref.current) {
                        hasSetRef.current = true;
                        context.registerView(ref.current);
                    }
                }}
            />
        )
    }

    return (
        <View
            {...props}
        />
    )
}