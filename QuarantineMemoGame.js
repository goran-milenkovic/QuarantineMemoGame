import * as React from "react";
import { registerRootComponent } from 'expo';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

//three main screens
import MainScreen from "./components/MainScreen"
import WelcomeScreen from "./components/WelcomeScreen"
import TopListScreen from "./components/TopListScreen"

class QuarantineMemoGame extends React.Component {
  constructor(props) {
    super(props)
  }
  render = () => {
    return (
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    );
  }
}

//navigation
const Stack = createStackNavigator();
const StackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
    <Stack.Screen
      options={{
        transitionSpec: {
          //triggers
          open: screenTransitionConfig,
          close: screenTransitionConfig,
        },
      }}
      name="Welcome"
      component={WelcomeScreen} />
    <Stack.Screen
      options={{
        //hide navigation header on this screen
        headerShown: false,
        transitionSpec: {
          open: screenTransitionConfig,
          close: screenTransitionConfig,
        },
      }}
      name="Quarantine Memo Game"
      component={MainScreen} />
    <Stack.Screen
      options={{
        transitionSpec: {
          open: screenTransitionConfig,
          close: screenTransitionConfig,
        },
      }}
      name="TopList"
      component={TopListScreen} />
  </Stack.Navigator>

);

const screenTransitionConfig = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

registerRootComponent(QuarantineMemoGame);
