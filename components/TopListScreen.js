import React from 'react';
import { StyleSheet, Text, FlatList, TextInput, Alert, View, Share } from 'react-native';
import { writeAsStringAsync, documentDirectory, getInfoAsync, readAsStringAsync } from 'expo-file-system'

import Screen from './Screen'
import Button from './Button'
import Player from './Player'

class TopListScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sortedTopList: [],
            //index of current result in sortedTopList array
            index: -1,
            //result in top 10
            isTopListScore: false,
            //validation for username input, only one username submit per game
            isInputSubmitted: false
        }
        this.getTopList()
    }

    shareResult = () => {
        //open native API share dialog
        Share.share({
            message: `I played Quarantine Memo Game and won ${this.state.index + 1}. place at (${this.props.route.params.level}x${this.props.route.params.level}) level`,
        }).then(_ => { }).catch(error => {
            console.log(error);
        });
    }

    //update username while user typing only in toplist, not in file
    updateUsername = (text) => {
        let toplist = this.state.sortedTopList
        toplist[this.state.index]["username"] = text
        this.setState({
            sortedTopList: [...toplist],
        });
    }

    //generate native alert
    alert = (title, message) => Alert.alert(title, message, [{ text: "OK" }], { cancelable: false })

    //update toplist file on submit
    updateTopListFile = () => {
        //already submitted -> alert
        if (this.state.isInputSubmitted) {
            this.alert("Thank You", "Username already submitted")
        }
        //input validation
        else if (this.state.sortedTopList[this.state.index]["username"] != "") {
            //write to json file new sorted toplist as string asynchronously, one json file per level
            writeAsStringAsync(documentDirectory + `/level_${this.props.route.params.level}.json`,
                JSON.stringify(this.state.sortedTopList)).then(_ => {
                    //update state
                    this.setState({
                        isInputSubmitted: true
                    })
                }).catch(error => console.log(error))
        }
        else {
            this.alert("Empty Username", "Please enter your username", [{ text: "OK" }], { cancelable: false });
        }
    }

    quitGame = () => {
        this.props.navigation.replace("Welcome")
    }

    getTopList = () => {
        //get seconds of given stopwatch's state
        let newTime = this.props.route.params.stopwatchState.hrs * 3600
            + this.props.route.params.stopwatchState.min * 60
            + this.props.route.params.stopwatchState.sec
        //check if file with toplist of played level exist...
        getInfoAsync(documentDirectory + `/level_${this.props.route.params.level}.json`).then(fileInfo => {
            if (fileInfo.exists) {
                //... and if exist get toplist for played level
                readAsStringAsync(documentDirectory + `/level_${this.props.route.params.level}.json`).then(rawTopList => {
                    //parse json content
                    let parsedTopList = JSON.parse(rawTopList)
                    //check if the result is for toplist
                    if (parsedTopList[parsedTopList.length - 1]["clicks"] > this.props.route.params.clickCounter
                        || (parsedTopList[parsedTopList.length - 1]["clicks"] == this.props.route.params.clickCounter
                            && parsedTopList[parsedTopList.length - 1]["time"] > newTime)) {
                        //check if toplist for played level is already full
                        if (parsedTopList.length == 10) {
                            parsedTopList[9] = {
                                "username": "",
                                "clicks": this.props.route.params.clickCounter,
                                "time": newTime
                            }
                        }
                        //case when toplist for played level is not full
                        else {
                            parsedTopList[parsedTopList.length] = {
                                "username": "",
                                "clicks": this.props.route.params.clickCounter,
                                "time": newTime
                            }
                        }
                        //sort toplist based on requirements
                        let sortedTopList = parsedTopList.sort(function (a, b) {
                            return a.clicks - b.clicks != 0 ? a.clicks - b.clicks : a.time - b.time
                        })
                        //get index of current result in newly sorted toplist
                        const index = sortedTopList.findIndex(item => item.username === '');
                        this.setState({
                            sortedTopList: [...sortedTopList],
                            index: index,
                            isTopListScore: true
                        });
                    }
                    //case when newly result is not in top 10
                    else {
                        this.setState({
                            sortedTopList: [...parsedTopList],
                        });
                    }
                }).catch(error => console.log(error));
            }
            //case when file not exist, i.e. toplist not exist
            else {
                this.setState({
                    sortedTopList: [{
                        "username": "",
                        "clicks": this.props.route.params.clickCounter,
                        "time": newTime
                    }],
                    index: 0,
                    isTopListScore: true
                });
            }
        }).catch(error => { console.log(error) })
    }

    newGame = () => {
        this.props.navigation.replace("Welcome")
    }

    render() {
        return (
            <Screen>
                <View style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    {/* only show when result is in top 10 */}
                    {this.state.isTopListScore && <View style={[styles.parent, { marginBottom: "6%" }]}>
                        <Text
                            style={styles.winner}>
                            {`Congratulations!\n You won ${this.state.index + 1}. place at (${this.props.route.params.level}x${this.props.route.params.level}) level`}
                        </Text>
                        <Button
                            onPress={() => this.shareResult()}
                            text={'Share Result'}>
                        </Button>
                    </View>}
                    <Player
                        /* Header */
                        index={'No'}
                        username={'Username'}
                        clicks={'Clicks'}
                        time={'Time'}>
                    </Player>
                    <FlatList
                        /* create table, one row is one Player */
                        data={this.state.sortedTopList}
                        keyExtractor={(_, index) => 'key' + index}
                        renderItem={({ item, index }) =>
                            <Player
                                index={index + 1}
                                username={item.username}
                                clicks={item.clicks}
                                time={item.time}>
                            </Player>}
                    />
                    {/* only show when result is in top 10 */}
                    {this.state.isTopListScore && <View style={styles.parent}>
                        <TextInput
                            placeholder="Enter your username here..."
                            selectionColor='#428AF8'
                            editable={this.state.isInputSubmitted ? false : true}
                            style={styles.username}
                            onChangeText={text => this.updateUsername(text)}
                            onSubmitEditing={() => this.updateTopListFile()}
                        />
                        <Button
                            onPress={() => this.updateTopListFile()}
                            text={'Confirm'}>
                        </Button>
                    </View>}
                    <View style={{ marginTop: "6%" }}>
                        <Button
                            onPress={() => this.newGame()}
                            text={'New Game'}>
                        </Button>
                    </View>
                </View>
            </Screen>
        );
    }
}

const styles = StyleSheet.create({
    winner: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#cc2b0e",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#0fb9bf",
        height: 50,
        width: "60%",
        textAlign: "center",
        justifyContent: "center",
        fontSize: 16,
        color: "#cc7d0e",
        marginRight: "2%",
    },
    username: {
        width: "60%",
        height: 30,
        marginRight: "1%"
    },
    parent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: "8%"
    }
})

export default TopListScreen;