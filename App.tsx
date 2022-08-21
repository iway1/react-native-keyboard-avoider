import React, { useState } from 'react';
import { Text, TextInput, View, ViewStyle, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import KeyboardAvoiderView, { KeyboardAvoidMode } from './package/src/components/KeyboardAvoiderView';
import KeyboardAvoiderScrollView from './package/src/components/KeyboardAvoiderScrollView';
import KeyboardAvoiderProvider, { useAppHeight } from './package/src/components/KeyboardAvoiderProvider';
import KeyboardAvoiderInsets from './package/src/components/KeyboardAvoiderInsets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import KeyboardAvoiderScrollSection from './package/src/components/KeyboardAvoiderScrollSection';
import { ScrollView } from 'react-native-gesture-handler';
import ReactNativeExample, { ReactNativeFixedExample } from './examples/react-native';

const inputStyle: ViewStyle = {
  padding: 50,
  borderColor: 'black',
  borderWidth: 1,
  borderRadius: 20,
  backgroundColor: 'rgba(50, 150, 100, 0.2)'
}

function TestKeyboardAvoidingView() {
  const [flex, setFlex] = useState<'flex-end' | 'flex-start'>('flex-end');
  const [avoidMode, setAvoidMode] = useState<KeyboardAvoidMode>('whole-view')
  return (
    <View
      style={{
        flex: 1,
        justifyContent: flex
      }}
    >
      <KeyboardAvoiderView
        avoidMode={avoidMode}
      >
        <TouchableOpacity onPress={() => { setAvoidMode(avoidMode == 'whole-view' ? 'focused-input' : 'whole-view') }}>
          <Text>
            {`Avoid mode: ${avoidMode}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFlex(flex == 'flex-end' ? 'flex-start' : 'flex-end')}
        >
          <Text>
            {`Flex: ${flex}`}
          </Text>
        </TouchableOpacity>
        <TextInput style={inputStyle} />
        <TextInput style={inputStyle} />
      </KeyboardAvoiderView>
    </View>

  )
}

function TestKeyboardAvoidingScrollView() {
  const appHeight = useAppHeight();
  const [c, setC] = useState<number>(0);
  return (
    <KeyboardAvoiderScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'flex-end',
      }}
    >
      <View
        style={{
          height: appHeight.appHeight,
        }}
      />
      <TextInput style={inputStyle} />
      <View
        style={{
          height: appHeight.appHeight,
        }}
      />
      <Text
        style={{
          marginBottom: 16,
          fontWeight: '900',
          fontSize: 32,
        }}
      >
        Section One
      </Text>
      <KeyboardAvoiderScrollSection>
        <TextInput style={inputStyle} />
        <TextInput style={inputStyle} />
      </KeyboardAvoiderScrollSection>
      <Text
        style={{
          marginBottom: 16,
          marginTop: 8,
          fontWeight: '900',
          fontSize: 32,
        }}
      >
        Section Two
      </Text>
      <KeyboardAvoiderScrollSection>
        <TextInput style={inputStyle} />
        <TextInput style={inputStyle} />
      </KeyboardAvoiderScrollSection>
      <View
        style={{ height: appHeight.appHeight }}
      />
      <KeyboardAvoiderScrollSection>
        <TextInput style={inputStyle} />
        <TextInput style={inputStyle} />
      </KeyboardAvoiderScrollSection>
    </KeyboardAvoiderScrollView>
  )
}

function TestPaddingView() {
  return (
    <View
      style={{ flex: 1, justifyContent: 'flex-start' }}
    >
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0
        }}
      >
        <TextInput style={inputStyle} />
        <KeyboardAvoiderInsets />
      </View>
    </View>

  )
}
// Breaks:
// __iOS__
// 1. when keyboard opens in extra height area (bottom of input <-> bottom of input + extra height)
// 2. weird scroll behavior to extra height (uses scroll + insets)
// 3. with react-navigation header
// 4. janky reset behavior

// Disadvantages:
// 1. Less responsive 

function TestCompetition() {
  const appHeight = useAppHeight().appHeight;
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <KeyboardAwareScrollView
        extraHeight={100}
        enableOnAndroid={true}
        enableResetScrollToCoords={true}
        keyboardOpeningTime={0}
      >
        <View
          style={{
            height: appHeight
          }}
        />
        <TextInput style={inputStyle} />
        <View
          style={{
            height: appHeight
          }}
        />
      </KeyboardAwareScrollView>
    </View>
  )
}

type Test = keyof typeof testComponents;

const testComponents = {
  'KeyboardAvoiderView': TestKeyboardAvoidingView,
  'KeyboardAvoiderScrollView': TestKeyboardAvoidingScrollView,
  'KeyboardAvoiderInsets': TestPaddingView,
  'react-native-keyboard-aware-scrollview': TestCompetition,
  'README Example #1: React Native': ReactNativeExample,
  'README Example #1: Fixed': ReactNativeFixedExample
}

const App = () => {
  const [test, setTest] = useState<Test>('KeyboardAvoiderView');
  const [headerShown, setHeaderShown] = useState<'shown' | 'hidden'>('shown');


  return (
    <KeyboardAvoiderProvider>
      <SafeAreaView style={{ flex: 1, }}>
        {headerShown == 'shown' &&
          <>
            <View
              style={{ height: 100, top: 0, left: 0, right: 0, width: '100%', }}
            >
              <ScrollView
                horizontal
                contentContainerStyle={{
                  alignItems: 'center',
                  padding: 20,
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                }}
              >
                <Text
                  style={{
                    fontWeight: '900',
                    marginRight: 20,
                  }}
                >
                  {`Select Example ->`}
                </Text>
                {Object.keys(testComponents).map(componentName => (
                  <TouchableOpacity
                    style={{
                      marginRight: 16,
                      borderRadius: 20,
                      padding: 10,
                      paddingHorizontal: 20,
                      backgroundColor: 'lightgrey'
                    }}
                    activeOpacity={0.9}
                    onPress={() => {
                      setTest(componentName as Test)
                    }}
                    key={componentName}
                  >
                    <Text>
                      {componentName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: 'rgba(0,0,0,0.2)',
                paddingLeft: 20,
                flexDirection: 'column',
              }}
            >
              <Text>
                {`Selected Example: ${test}`}
              </Text>

            </View>
          </>
        }
        <View
          style={{ flex: 1, paddingHorizontal: 20, }}
        >
          {
            (() => {
              const C = testComponents[test];
              return <C />
            })()
          }
        </View>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            padding: 5,
            backgroundColor: 'black',
          }}
          onPress={() => {
            setHeaderShown(old => old == 'hidden' ? 'shown' : 'hidden')
          }}
        >
          <Text style={{ color: 'white' }}>{`Header: ${headerShown}`}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoiderProvider>
  );
};

const exampleItemStyle = {

}

export default App;