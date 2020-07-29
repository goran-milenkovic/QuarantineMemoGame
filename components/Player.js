import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';

class Player extends React.Component {
    constructor(props) {
        super(props)
    }
    //add zero to the beginning of the one-digit number
    leadingZero = (number) => (number <= 9 ? `0${number}` : number);

    render = () => {
        return (
            <View style={styles.container}>
                <View style={styles.textShorter}>
                    <Text style={styles.text}>
                        {this.props.index}
                    </Text>
                </View>
                <View style={styles.textLonger}>
                    <Text style={styles.text}>
                        {this.props.username}
                    </Text>
                </View>
                <View style={styles.textShorter}>
                    <Text style={styles.text}>
                        {this.props.clicks}
                    </Text>
                </View>
                <View style={styles.textLonger}>
                    <Text style={styles.text}>
                        {this.props.time == 'Time' ? 'Time' :
                            `${this.leadingZero(Math.floor(this.props.time / 3600))} : ${this.leadingZero(Math.floor((this.props.time % 3600) / 60))} : ${this.leadingZero(Math.floor(this.props.time % 60))}`}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#03fccf",
        height: 30,
        justifyContent: "center",
        color: "#0a8a72",
    },
    textShorter: {
        borderWidth: 1,
        borderColor: "#0fb9bf",
        width: Dimensions.get("window").width / 6
    },
    textLonger: {
        borderWidth: 1,
        borderColor: "#0fb9bf",
        width: Dimensions.get("window").width / 4
    },
    text: {
        textAlign: "center",
        color: "#0a8a72"
    }
});

export default Player;