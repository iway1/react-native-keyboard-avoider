![alt text](promo.png)

# Keyboard Avoiding (finally) made easy.
A modern, developer friendly React Native keyboard avoiding solution that actually works all of the time and provides consistency across platforms. Provides a high quality user experience out of the box.

## Features
- Consistent cross platform behavior by default
- More responsive scroll view
    - Section based scrolling (shows entire scroll view instead of just )
- Adjustable animations
- Works out of the box with any layout
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
```tsx
export const MyScreen = () => (
  <KeyboardAvoiderScrollView contentContainerStyle={{flexGrow: 1}}>
    <View style={{flex: 1}}/>
    <TextInput/>
  </KeyboardAvoiderScrollView>
);
```

#### Section based scrolling
Optionally, you can create a section based scroll with the `KeyboardAvoiderScrollSection` component:

```tsx
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
```tsx
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

`KeyboardAvoidingView` is not even able to avoid a keyboard in this very simple situation! None of its three behaviors will work here. That's crazy. This is a normal layout. It should be supported.

One option would be to completely redo your components layout and spend a lot of time trying to get it to work like you want. And maybe that will work in the short term, but that's a lot of wasted effort, and what if you need to change your components layout later on? It could easily break the keyboard avoiding behavior.

What if we just had a keyboard avoiding view that actually worked all the time, predictably?

Well, now we do

Our `KeyboardAvoiderView` will work in all of these situations, and it's never going to break your layout. It's just a view that gets out of the way of the keyboard in a predictable way. You can choose whether it avoids to the bottom of the view or to the focused text input, and it will make sure you get that behavior on both platforms. 

## Comparison with react-native-keyboard-aware-scroll-view
This library has several advantages over the popular package `react-native-keyboard-aware-scroll-view`:

### better user experience
More responsive behavior on iOS. `react-native-keyboard-aware-scroll-view` doesn't scroll fast enough to avoid the keyboard:

And it behaves inconsistently:

### Consistent keyboard avoiding within your application
Keyboard avoiding will look the same both within and outside of scroll views:

### Avoids long-standing bugs
No "bounce glitch". Unfortunately, this is a glitch that has existed for years in `react-native-keyboard-aware-scroll-view` and it likely isn't going to be fixed any time soon.

There is simply no way to reliably avoid the "bounce" (although you may be able to avoid it in some cases, it probably can't be solved for all).

### section based scrolling 
This library allows for automatic scrolling to show entire views instead of only allowing scrolling to text inputs if the developer wants it. This feature can be used to create a better user experience.

## Contributing
For developer convenience, this repo is a React Native project. You can just pull it down and work within the project. Pull requests should only touch the `src` folder.
