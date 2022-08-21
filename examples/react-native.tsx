import React from "react";
import { Dimensions, Image, KeyboardAvoidingView, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import KeyboardAvoiderView from "../package/src/components/KeyboardAvoiderView";
import { textInputStyle } from "./styles";

export default function ReactNativeExample() {
    return (
        <View style={{
            flex: 1,
        }}>
            <View
                style={{
                    height: Dimensions.get('window').height - 400,
                    width: '100%',
                    justifyContent: 'flex-start'
                }}
            >
                <Image
                    style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain'
                    }}
                    source={require('../promo-image.png')}
                />
            </View>
            <KeyboardAvoidingView
                behavior='height'
            >
                <TextInput
                    style={textInputStyle}
                />
                <TextInput
                    style={textInputStyle}
                />
            </KeyboardAvoidingView>
        </View>
    )
}

export function ReactNativeFixedExample() {
    return (
        <View style={{
            flex: 1,
        }}>
            <View
                style={{
                    height: Dimensions.get('window').height - 400,
                    width: '100%',
                    justifyContent: 'flex-start'
                }}
            >
                <Image
                    style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain'
                    }}
                    source={require('../promo-image.png')}
                />
            </View>
            <KeyboardAvoiderView>
                <TextInput
                    style={textInputStyle}
                />
                <TextInput
                    style={textInputStyle}
                />
            </KeyboardAvoiderView>
        </View>
    )
}

function DoesntWork() {
    return (
        <View style={{
            flex: 1,
        }}>
            <View
                style={{
                    height: Dimensions.get('window').height - 300,
                    width: '100%',
                    justifyContent: 'flex-start'
                }}
            />
            <KeyboardAvoidingView>
                <TextInput
                    style={textInputStyle}
                />
                <TextInput
                    style={textInputStyle}
                />
            </KeyboardAvoidingView>
        </View>
    )
}