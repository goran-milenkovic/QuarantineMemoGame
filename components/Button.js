import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

class Button extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                //use function from parent
                onPress={this.props.onPress}>
                <Text style={styles.text}>
                    {this.props.text}
                </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#20dce3",
        marginBottom: "1%",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#0fb9bf",
        height: 40,
        width: "25%",
        justifyContent: "center"
    },
    text: {
        color: "#0a8a72",
        fontSize: 14,
        alignSelf: "center"
    }
})

export default Button;