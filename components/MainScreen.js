import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import Screen from './Screen'
import Card from './Card'
import Stopwatch from './Stopwatch'
//dictionary which mapping image key to image source
import cardSources from '../card_sources'

function generateCards(level) {
    let NUMBER_OF_FRUIT_IMAGES = 48;
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48]
    let chosenNumbers = [];
    //shuffle all card ids
    for (let i = NUMBER_OF_FRUIT_IMAGES - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = numbers[i];
        numbers[i] = numbers[j];
        numbers[j] = tmp;
    }
    //generate array with the first Level numbers from numbers array repeated twice
    for (let i = 0; i < level * level / 2; i++) {
        chosenNumbers.push(numbers[i]);
        chosenNumbers.push(numbers[i]);
    }
    //shuffle newly created array and return it
    for (let i = level * level - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = chosenNumbers[i];
        chosenNumbers[i] = chosenNumbers[j];
        chosenNumbers[j] = tmp;
    }
    return chosenNumbers
}

//all card image sources set to default on new game
function initialSources(level) {
    let sources = {}
    for (let i = 0; i < level * level; i++)
        sources[i] = cardSources["default"]
    return sources
}

//class component
class MainScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sources: initialSources(this.props.route.params.level),
            //indices with matched cards during the game
            matchedCardIndices: [],
            //opened cards at the moment during the game, maximum two indices can contain
            openedCardIndices: [],
            gamePaused: false,
            //number of attempts, not included these attempts when gamePaused = true
            clickCounter: 0,
        }
        //timer returns to default sources after 1 sec when opened cards not matching
        this.openedCardsTimer = null;
        //referene on child component, use case to get stopwatch time
        this.stopwatchRef = React.createRef();
        this.cardNumbers = generateCards(this.props.route.params.level)
        //render elements
        this.rows = this.renderCards();
    }

    renderCards = () => {
        let level = this.props.route.params.level
        let rows = []
        //create Level rows
        for (let i = 0; i < level; i++) {
            let row = [];
            //create Level cards for every row
            for (let j = 0; j < level; j++) {
                let position = level * i + j
                let card = <Card
                    key={position.toString()}
                    onPress={() => this.onCardPress(position)}
                    source={this.state.sources[position]}
                    level={this.props.route.params.level}
                ></Card>
                row.push(card);
            }
            let tmp_row = <View key={i.toString()} style={{ flexDirection: "row" }}>{row}</View>;
            rows.push(tmp_row);
        }
        return rows
    }

    onCardPress = (position) => {
        const source = cardSources["default"]
        //irregular press:
        //-game paused
        //-card already matched
        //-second press equal to first press
        if (this.state.gamePaused || this.state.matchedCardIndices.indexOf(position) != -1
            || (this.state.openedCardIndices.length == 1 && this.state.openedCardIndices[0] == position))
            return

        //1.case - third press in less than 1 second
        if (this.state.openedCardIndices.length == 2) {
            //timer was set to 1 second, handle unexecuted timer in the meantime
            clearTimeout(this.openedCardsTimer)
            this.setState({
                sources: {
                    ...this.state.sources,
                    [this.state.openedCardIndices[0]]: source,
                    [this.state.openedCardIndices[1]]: source,
                    //sources for openeCardIndices[0] or openeCardIndices[0] will be replaced in case that position is equal to one of them
                    [position]: cardSources[this.cardNumbers[position]]
                },
                //increment counter
                clickCounter: ++this.state.clickCounter,
                openedCardIndices: [position]
            })
        }
        //2.case - first press
        else if (this.state.openedCardIndices.length == 0) {
            this.setState({
                clickCounter: ++this.state.clickCounter,
                openedCardIndices: [position],
                sources: { ...this.state.sources, [position]: cardSources[this.cardNumbers[position]] }
            });

        }
        //3.case - second press
        else {
            //3.1 subcase - cards match
            if (this.cardNumbers[this.state.openedCardIndices[0]] == this.cardNumbers[position]) {
                this.setState({
                    clickCounter: ++this.state.clickCounter,
                    matchedCardIndices: [...this.state.matchedCardIndices, position, this.state.openedCardIndices[0]],
                    sources: { ...this.state.sources, [position]: cardSources[this.cardNumbers[position]] },
                    openedCardIndices: []
                },
                    //callback to check are all cards in matched array
                    () => {
                        if (this.state.matchedCardIndices.length == (this.props.route.params.level * this.props.route.params.level)) {
                            this.setState({
                                gamePaused: true,
                            });
                            //remove interval in stopwatch using reference to child component
                            clearInterval(this.stopwatchRef.current.interval)
                            //navigate to final screen
                            this.props.navigation.replace("TopList", {
                                //send needed parameters: time, level and clicks counter
                                stopwatchState: this.stopwatchRef.current.state,
                                level: this.props.route.params.level,
                                clickCounter: this.state.clickCounter
                            })
                        }
                    }
                );
            }
            //3.2 subcase - cards dont match
            else {
                //first flip second card...
                this.setState({
                    clickCounter: ++this.state.clickCounter,
                    sources: { ...this.state.sources, [position]: cardSources[this.cardNumbers[position]] },
                    openedCardIndices: [this.state.openedCardIndices[0], position]
                });
                //...and after 1 second with this timer flip both cards back to default
                this.openedCardsTimer = setTimeout(() => {
                    //if game paused in the meantime handle flipping on game resume
                    if (!this.state.gamePaused && this.state.openedCardIndices.length == 2) {
                        this.setState({
                            sources: { ...this.state.sources, [this.state.openedCardIndices[0]]: source, [this.state.openedCardIndices[1]]: source },
                            openedCardIndices: []
                        });
                    }
                }, 1000);
            }
        }
    }


    pauseGame = () => {
        this.setState({
            gamePaused: true
        });
    }

    quitGame = () => {
        //if "main screen" means this screen
        //this.props.navigation.replace("Quarantine Memo Game", { level: this.props.route.params.level })

        //if "main screen" means first screen
        this.props.navigation.replace("Welcome")
    }

    resumeGame = () => {
        const source = cardSources["default"]
        //handle case when game is paused on active timer
        if (this.state.openedCardIndices.length == 2) {
            this.setState({
                sources: { ...this.state.sources, [this.state.openedCardIndices[0]]: source, [this.state.openedCardIndices[1]]: source },
                openedCardIndices: [],
                gamePaused: false
            })
        }
        else {
            this.setState({
                gamePaused: false
            });
        }
    }
    //initialize new game
    resetGame = () => {
        this.cardNumbers = generateCards(this.props.route.params.level)
        this.setState({
            openedCardIndices: [],
            matchedCardIndices: [],
            sources: initialSources(this.props.route.params.level),
            clickCounter: 0,
            gamePaused: false
        });
    }

    render() {
        this.rows = this.renderCards()
        return (<Screen>
            <Stopwatch
                ref={this.stopwatchRef}
                isGamePaused={this.state.gamePaused}
                clickCounter={this.state.clickCounter}
                level={this.props.route.params.level}
                pauseGame={this.pauseGame}
                resumeGame={this.resumeGame}
                resetGame={this.resetGame}
                quitGame={this.quitGame}
            ></Stopwatch>
            <View style={styles.grid}>
                {this.rows}
            </View>
        </Screen>)
    }
}

const styles = StyleSheet.create({
    grid: {
        display: "flex",
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "flex-end",
        //grid is square (width x width)
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").width
    }
})

export default MainScreen;