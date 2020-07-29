import React from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';

class Card extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View
                style={{
                    width: Dimensions.get("window").width / this.props.level,
                    height: Dimensions.get("window").width / this.props.level,
                    alignItems: "center"
                }}
            >
                < TouchableOpacity onPress={this.props.onPress} >
                    <Image
                        style={{
                            //(1 + 1 / this.props.level) - parameter which represents "separator" between images
                            width: Dimensions.get("window").width / (this.props.level * (1 + 1 / this.props.level)),
                            height: Dimensions.get("window").width / (this.props.level * (1 + 1 / this.props.level)),
                        }}
                        source={this.props.source}
                    />
                </TouchableOpacity >
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {}
})

export default Card;