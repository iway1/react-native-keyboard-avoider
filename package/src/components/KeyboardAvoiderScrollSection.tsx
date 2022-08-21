import { View, ViewProps } from "react-native";
import { useScrollViewContext } from "./KeyboardAvoiderScrollView";
import React, { useRef } from "react";
import uuid from 'react-native-uuid';

export default function KeyboardAvoiderScrollSection(props: Omit<ViewProps, 'collapsable'>) {
    const id = useRef(uuid.v4())
    const context = useScrollViewContext();
    
    if(context!==null){
        return (
            <View
                {...props}
                ref={el=>{
                    
                    if(el) 
                        context.registerView({id: id.current as string, view: el});
                    else
                        context.unregisterView(id.current as string);
                }}
                collapsable={false} // makes sure we can measure the view.
            />
        )
    }

    return (
        <View
            {...props}
        />
    )
}