import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

import Screen from './Screen'
import Button from './Button'

class WelcomeScreen extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Screen>
                <View style={styles.container}>
                    <Text style={styles.text}>Choose level</Text>
                    <Button
                        onPress={() => this.props.navigation.navigate("Quarantine Memo Game", { level: 4 })}
                        text={'(4x4)'}>
                    </Button>
                    <Button
                        onPress={() => this.props.navigation.navigate("Quarantine Memo Game", { level: 6 })}
                        text={'(6x6)'}>
                    </Button>
                    <Button
                        onPress={() => this.props.navigation.navigate("Quarantine Memo Game", { level: 8 })}
                        text={'(8x8)'}>
                    </Button>
                </View>
                <Image
                    style={{
                        width: 200,
                        height: 200,
                        justifyContent: "space-around",
                        alignSelf: "center"
                    }}
                    source={require('../assets/default.png')} />
            </Screen>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        paddingTop: "5%",
        justifyContent: "center",
        alignItems: "center",

    },
    text: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#03fccf",
        marginBottom: "8%",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#0fb9bf",
        height: 30,
        width: "40%",
        textAlign: "center",
        justifyContent: "center",
        fontSize: 18,
        color: "#0a8a72",
    }
})

export default WelcomeScreen;