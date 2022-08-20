import React, { useState } from 'react';
import { Text, TextInput, View, ViewStyle, TouchableOpacity, SafeAreaView } from 'react-native';
import KeyboardAvoiderView, { KeyboardAvoidMode } from './package/src/components/KeyboardAvoiderView';
import KeyboardAvoiderScrollView from './package/src/components/KeyboardAvoiderScrollView';
import KeyboardAvoiderProvider, { useAppHeight } from './package/src/components/KeyboardAvoiderProvider';
import KeyboardAvoiderInsets from './package/src/components/KeyboardAvoiderInsets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import KeyboardAvoiderScrollSection from './package/src/components/KeyboardAvoiderScrollSection';

const inputStyle: ViewStyle = {
  height: 100, borderRadius: 2, borderColor: 'black', borderWidth: 1,
  backgroundColor: 'rgba(255, 150, 100, 0.2)'
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
      <KeyboardAvoiderScrollSection>
        <TextInput style={inputStyle} />
        <TextInput style={inputStyle} />
        <TextInput style={inputStyle} />
      </KeyboardAvoiderScrollSection>
      <TextInput style={inputStyle} />
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

type Test = 'view' | 'scrollview' | 'padding-view' | 'competition';

function getNextTest(test: Test): Test {
  const arr: Test[] = ['view', 'scrollview', 'padding-view', 'competition'];
  const idx = arr.findIndex(e => e == test);
  return arr[(idx + 1) % arr.length];
}

const App = () => {
  const [selectedTest, setSelectedText] = useState<Test>('view');

  return (
    <KeyboardAvoiderProvider>
      <SafeAreaView style={{ flex: 1, }}>
        <TouchableOpacity
          onPress={() => setSelectedText(getNextTest(selectedTest))}
          style={{
            padding: 20,
            backgroundColor: 'lightblue'
          }}
        >
          <Text>
            {`Testing: ${selectedTest}`}
          </Text>
        </TouchableOpacity>
        {selectedTest == 'view' &&
          <TestKeyboardAvoidingView />
        }
        {selectedTest == 'scrollview' &&
          <TestKeyboardAvoidingScrollView />
        }
        {selectedTest == 'padding-view' &&
          <TestPaddingView />
        }
        {selectedTest == 'competition' &&
          <TestCompetition />
        }
      </SafeAreaView>
    </KeyboardAvoiderProvider>
  );
};

export default App;