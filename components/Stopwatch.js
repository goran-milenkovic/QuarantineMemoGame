import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';

import Button from './Button'

class Stopwatch extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            sec: 0,
            min: 0,
            hrs: 0
        }
        //"start" stopwatch
        this.interval = setInterval(this.handleStopwatchUpdate, 1000)
    }

    //clear interval before component unmounts
    componentWillUnmount = () => {
        clearInterval(this.interval)
    }

    //update stopwatch state every second
    handleStopwatchUpdate = () => {
        if (this.state.sec !== 59) {
            this.setState({
                sec: ++this.state.sec
            });
        }
        else if (this.state.min != 59) {
            this.setState({
                sec: 0,
                min: ++this.state.min
            });
        }
        else {
            this.setState({
                sec: 0,
                min: 0,
                hrs: ++this.state.hrs
            });
        }
    };

    onPauseResume = () => {
        //if game is not paused, pause
        if (!this.props.isGamePaused) {
            this.props.pauseGame()
            clearInterval(this.interval)
        }
        //if game is paused, resume
        else {
            this.props.resumeGame()
            this.interval = setInterval(this.handleStopwatchUpdate, 1000)
        }
    }

    //reset stopwatch state to default and call parent function to generate new game
    onReset = () => {
        this.setState({
            min: 0,
            sec: 0,
            hrs: 0
        });
        this.props.resetGame()
        this.interval = setInterval(this.handleStopwatchUpdate, 1000)
    }

    onQuit = () => {
        this.props.quitGame()
    }

    //add zero to the beginning of the one-digit number
    leadingZero = (number) => (number <= 9 ? `0${number}` : number);

    render() {
        return (
            <View style={styles.container}>
                <View style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: "2%"
                }}>
                    <View style={styles.stopwatch}>
                        <Text style={styles.text}>{'  ' + this.leadingZero(this.state.hrs) + ' : '}</Text>
                        <Text style={styles.text}>{this.leadingZero(this.state.min) + ' : '}</Text>
                        <Text style={styles.text}>{this.leadingZero(this.state.sec)}</Text>
                    </View>
                    <View style={styles.counter}>
                        <Text style={styles.text}>
                            {this.props.clickCounter}
                        </Text>
                    </View>
                </View>
                <View style={styles.buttonParent}>
                    <Button
                        onPress={this.onPauseResume}
                        text={this.props.isGamePaused ? 'Resume' : 'Pause'}>
                    </Button>
                    {/* show only when game is paused */}
                    {this.props.isGamePaused &&
                        <Button
                            onPress={this.onReset}
                            text={'Reset'}>
                        </Button>}
                    {/* show only when game is paused */}
                    {this.props.isGamePaused &&
                        <Button
                            onPress={this.onQuit}
                            text={'Quit'}>
                        </Button>}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        maxHeight: Dimensions.get("window").height - Dimensions.get("window").width
    },
    stopwatch: {
        display: "flex",
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 80,
        borderColor: "#0fb9bf",
        backgroundColor: "#03fccf",
        paddingLeft: "6%",
        paddingRight: "6%",
        paddingTop: ".5%",
        paddingBottom: ".5%",
        maxWidth: "63%",
    },
    text: {
        fontSize: 22,
        color: "#0a8a72",
    },
    counter: {
        display: "flex",
        flexDirection: "column",
        borderWidth: 1,
        borderColor: "#0fb9bf",
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
        backgroundColor: "#03fccf",
        borderRadius: 100,
        marginTop: "1%",
    },
    buttonParent: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: "10%",
        marginBottom: "2%"
    }
});

export default Stopwatch;