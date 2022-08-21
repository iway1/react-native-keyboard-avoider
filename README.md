![alt text](promo-image.png)

# Keyboard Avoiding (finally) made easy.
A modern, developer friendly React Native keyboard avoiding solution that actually works all of the time and provides consistency across platforms. Provides a high quality user experience out of the box.

## Features
- Consistent cross platform behavior by default
- More responsive scroll view
    - Section based scrolling (show entire section when keyboard visible)
- Works with any layout
- Switch between "avoid entire view" and "show focused text input" behavior
- Compatible with Expo
- Avoids pitfalls of similar libraries that lead to bad DX and bad UX. 
    - Comparison with React Native's [KeyboardAvoidingView](#comparison-with-keyboardavoidingview)
    - Comparison with [react-native-keyboard-aware-scroll-view](#comparison-with-react-native-keyboard-aware-scroll-view)

## Installation
This library requires `react-native-gesture-handler` and `react-native-reanimated`.

To install:

```sh
yarn add @iway1/react-native-keyboard-avoider react-native-gesture-handler react-native-reanimated 
```

Install cocoapods: 
```sh
cd ios && pod install
```

## Usage
First, you need to wrap your app in `KeyboardAvoiderProvider`:

```jsx
export const App = () => (
  <KeyboardAvoiderProvider>
    <RestOfApp/>
  </KeyboardAvoiderProvider>
);
```

This library has three primary components that make implementing keyboard avoiding behavior easy. 

### 1. `KeyboardAvoiderView`
A view that simply gets out of the way of the keyboard regardless of what the rest of your screen and layout looks like:

```jsx
export const MyScreen = () => (
  <View style={{flex: 1}}>
    <View style={{flex: 1}}/>
    <KeyboardAvoiderView>
        <TextInput>
    </KeyboardAvoiderView>
  </View>
);
```
It wont break the rest of your layout, it's easy to understand, it just works.

### 2. `KeyboardAvoiderScrollView`
A more responsive keyboard aware `ScrollView` that behaves predictably:
```jsx
export const MyScreen = () => (
  <KeyboardAvoiderScrollView contentContainerStyle={{flexGrow: 1}}>
    <View style={{flex: 1}}/>
    <TextInput/>
  </KeyboardAvoiderScrollView>
);
```

#### Section based scrolling
Optionally, you can create a section based scroll with the `KeyboardAvoiderScrollSection` component:

```jsx
export const MyScreen = () => (
  <KeyboardAvoiderScrollView contentContainerStyle={{flexGrow: 1}}>

    <View style={{flex: 1}}/>
    <KeyboardAvoiderScrollSection>
        <TextInput/>
        <TextInput/>
    </KeyboardAvoiderScrollSection>
  </KeyboardAvoiderScrollView>
);
```

This makes it where the entire section will by shown when any input within that section is focused.

### 3. `KeyboardAvoiderInsets`
A component that creates keyboard avoiding insets. 
```jsx
export const MyScreen = () => (
  <KeyboardAvoiderScrollView contentContainerStyle={{flexGrow: 1}}>
    <View style={{flex: 1}}/>
    <TextInput/>
  </KeyboardAvoiderScrollView>
);
```

You can use this when you need some space to be created within a layout when the keyboard shows (like if you had a keyboard attached to the bottom of the screen.)

## Comparison with KeyboardAvoidingView
The biggest issue with the React Native's `KeyboardAvoidingView` is that, as a developer, it's hard to reason about how the behaviors will end up functioning within a screen and doesn't work in all layouts (even when it should work probably work). For example, lets look at a very simple layout:
```jsx
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
            <KeyboardAvoidingView
              behavior='padding' // None of the three supported behaviors will work here. That's bad.
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
```

![](gifs/react-native/sucks.gif)

`KeyboardAvoidingView` is not even able to avoid a keyboard in this very simple situation! None of its three behaviors will work here. That's crazy. This is a normal layout and it should be supported.

What if we just had a keyboard avoiding view that actually worked all the time, predictably? Well, now we do:


```jsx

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
```

![](gifs/keyboard-avoider/isgood.gif)

Oh, look, it actually works. 

Our `KeyboardAvoiderView` will work in every situation, and it's never going to break your layout because it uses translations instead of animating properties that affect your layout such as height and padding. It's just a view that gets out of the way of the keyboard in a predictable way.

If you do need to alter the layout, then you can use our `KeyboardAvoiderInsets` for all such use cases.

### No "behavior" prop
Unlike `<KeyboardAvoidingView/>` `behavior` prop, `<KeyboardAvoiderView/>` `avoidMode` doesn't make you think about implementation details. Instead, it simply tells the `<KeyboardAvoiderView/>` where you would like it to move when the keyboard shows.

## Comparison with react-native-keyboard-aware-scroll-view
This library has several advantages over the popular package `react-native-keyboard-aware-scroll-view`.

### better user experience
More responsive behavior on. `react-native-keyboard-aware-scroll-view` doesn't scroll fast enough to avoid the keyboard:

![](gifs/keyboard-aware-scroll-view/keyboard-hides-input.gif)

And it can act janky in certain circumstances:

![](gifs/keyboard-aware-scroll-view/jank-1.gif)

Our `<KeyboardAvoiderScrollView/>` does exactly what it should in all situations on iOS, it just gets the input out of the way with a smooth animation:

![](gifs/keyboard-avoider/scrollview.gif)

There is a noticeable UX improvement on Android as well.

### Consistent keyboard avoiding within your application
Keyboard avoiding will look the same both within and outside of scroll views. Extra height is always applied consistently.

### Less glitchy
No "bounce glitch". Unfortunately, this is a glitch that has existed for years in `react-native-keyboard-aware-scroll-view` and it likely isn't going to be fixed any time soon: https://github.com/APSL/react-native-keyboard-aware-scroll-view/issues/217

There is simply no way to reliably avoid the "bounce" if you're using `@react-navigation` (although you may be able to avoid it in some cases, it probably can't be solved for all).

React Native's KeyboardAvoidingView has issues with this as well. Our library avoids any such issues by measuring the absolute position of elements on the screen.

### section based scrolling 
This library allows for automatic scrolling to show entire views instead of only allowing scrolling to text inputs if the developer wants it. This feature can be used to create a better user experience if desired:

![](gifs/keyboard-avoider/section-scrolling.gif)

## Cross Platform Differences
This library aims to provide consistent behavior between platforms by default, but having matching behavior is impossible in some cases because Android doesn't allow developers to disable system keyboard avoiding behavior without disabling keyboard events entirely.

One noteable default difference is that on iOS, `<KeyboardAvoiderScrollView/>` will attempt to stay still when the keyboard hides. This behavior can be disabled so that the cross platform behavior matches, via the prop `iosHideBehavior='revert'`.

## Contributing
If this library is missing some feature that you'd find valueable, please open an issue! We're hoping the community can help guide us in deciding which features to add next to this package and are very open to suggestions at the moment. And we would like to avoid adding any features that we aren't sure have value to developers.

For developer convenience, this repo is a React Native project. You can just pull it down and work within the project. Pull requests should only touch the `src` folder.
