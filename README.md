# QuarantineMemoGame (iOS, Android)

***Hybrid app created with React Native that can run natively on both iOS and Android***

##  Requirements
### General
- node-js v12 or higher
	-  <pre> sudo apt-get install python-software-properties  </pre>
	-  <pre> curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash – </pre>
	- <pre> sudo apt-get install nodejs  </pre>
- expo-cli
	- <pre> npm i -g expo-cli </pre>
### Android
- [android-emulator](https://docs.expo.io/workflow/android-studio-emulator/)
### iOS
- [ios-simulator](https://docs.expo.io/workflow/ios-simulator/)**

** Mac platform recommended

##  Run

- <pre> cd QuarantineMemoGame </pre>
- <pre> npm start </pre>
-  Choose preferred option and wait to finish javascript bundling

## The flow and rules

- The game has three levels:
	- (4x4)
	- (6x6)
	- (8x8)

- On game initialization user select the level -> Welcome screen

- Based on the level selection, the main screen is displayed which is the composition of the upper half - stopwatch and the lower half - grid with cards

- Stopwatch measures the effective time since the start of the game and user has option to pause the game and after paused it to resume, restart or quit the game. Also, there is and click counter which is incremented on card press only when the game is not paused

- On the beginning all cards on the grid have same image, that is default image. User clicks on two cards, one after another and if they match they remain on these sides. If they don't match, they return to default side after 1 second or after user in the meantime click on third image

- The game ends when all cards are matched and user can share result if it is in top 10 for that level. Also, top list is displayed and user is able to enter his username if result satisfies the previously stated condition

- User can start new game

*Fruit images taken from [@aisamanra](https://github.com/aisamanra/fruit-icons)

*Default/logo/splash-screen/favicon/icon image taken from [pngtree.com](https://pngtree.com/so/maskblue)
