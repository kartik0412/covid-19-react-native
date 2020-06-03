'use strict';
import React, { useEffect, useState, useContext } from 'react'
import { ThemeContext } from './App'
import { Platform, NativeModules, StyleSheet, Image, StatusBar, ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Animated, Picker, SafeAreaView } from 'react-native';
import axios from 'axios';
import Card from "./Card"
import PieChart from './Piechart';
import LineChart from './LineChart';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
const rem = 16;


export default function CardList() {

    let { theme: { islight }, settheme } = useContext(ThemeContext)
    let [state, setState] = useState({ isloading: true, statewise: [], st: 0 })
    let [mode, setMode] = useState({ current: 0, last: 0 })

    let slideup = useState({ slide: new Animated.Value(0) })[0]

    useEffect(() => {
        const getData = async () => {
            let { data } = await axios("https://api.covid19india.org/data.json");
            setState({
                statewise: data.statewise,
                timeseries: data.cases_time_series,
                st: 0, isloading: false
            })
        }
        getData()
    }, [])



    const getLasteUpdateTime = (x) => {
        x = x.split("/");
        let oldDate = new Date(`${x[1]}/${x[0]}/${x[2]}`);
        let curDate = new Date();
        let h = (24 + curDate.getHours() - oldDate.getHours()) % 24;
        let m = (60 + curDate.getMinutes() - oldDate.getMinutes()) % 60;
        let res = "";
        if (h >= 24) {
            let d = Math.floor(h / 24);
            h %= 24;
            res += `${d} day${d > 1 ? "s" : ""} `;
        }
        if (h > 0) res += `${h} hour${h > 1 ? "s" : ""} `;
        if (m > 0) res += `${m} minute${m > 1 ? "s" : ""} `;
        if (h || m) res += " ago";
        return " " + res;
    }
    if (state.isloading) {
        return <ActivityIndicator style={{ margin: 0, padding: 0, top: "50%" }} size="large" />
    }
    else {
        let { statewise, st, timeseries } = state
        let { current, last } = mode
        let lightsrc = './assets/images/light.png'
        let nightsrc = './assets/images/night.png'
        let linecolor = current == 0 ? "rgb(255, 7, 58)" : current == 1 ? "rgb(40, 167, 69)" : "#919191"
        let currentbgcolor = current == 0 ? "rgba(255, 7, 58,0.2)" : current == 1 ? "rgba(40, 167, 69,0.18)" : "rgba(108, 117,125,0.2)"
        let lastbgcolor = last == 0 ? "rgba(255, 7, 58,0.2)" : last == 1 ? "rgba(40, 167, 69,0.18)" : "rgba(108, 117,125,0.2)"

        Animated.timing(
            slideup.slide,
            {
                toValue: 1,
                duration: 700,
                useNativeDriver: false
            }
        ).start();

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar translucent={true} backgroundColor={islight ? "rgb(0, 123, 255)" : "#121212"} />
                <ScrollView
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[{ backgroundColor: islight ? "rgb(0, 123, 255)" : "#121212" }, styles.container]}>
                        <TouchableOpacity activeOpacity={1} style={styles.imagestyle} onPress={() => settheme({ islight: !islight })}>
                            <Image style={{ width: 30, height: 30 }} source={islight ? require(nightsrc) : require(lightsrc)} />
                        </TouchableOpacity>

                        <Image style={styles.img} resizeMode="contain" source={require("./assets/images/cv.png")} />
                        <Animated.View style={[{
                            backgroundColor: islight ? "white" : "#000000",
                            height: slideup.slide.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0%", "79%"]
                            })
                        }, styles.CardListcontainer]}>

                            <View style={[{ borderColor: islight ? "#121212" : "white" }, styles.select]}>
                                <Picker
                                    selectedValue={st}
                                    style={{ color: islight ? "#121212" : "white", height: 50, width: 220 }}
                                    onValueChange={(itemValue) => setState(prevst => ({ ...prevst, st: itemValue }))}
                                >
                                    {statewise.map((i, j) => <Picker.Item key={j} label={i.state} value={j} />)}
                                </Picker>
                            </View>
                            <View style={styles.lastupdate}>
                                <Text style={{ fontFamily: "Quicksand-SemiBold", color: islight ? "#121212" : "white" }}>
                                    Last updated :{" "}{statewise[st] && getLasteUpdateTime(statewise[st].lastupdatedtime)}
                                </Text>
                            </View>

                            <View style={styles.cardBoxContainer}>
                                <Card color={"rgb(255, 7, 58)"}
                                    title={"Confirmed"}
                                    delta={statewise[st] ? Number(statewise[st].deltaconfirmed) : 0}
                                    value={statewise[st] ? statewise[st].confirmed : 0}
                                    color2={"rgba(255, 7, 58,0.2)"} />

                                <Card color={"rgb(0, 123, 255)"}
                                    title={"Active"}
                                    value={statewise[st] ? statewise[st].active : 0}
                                    color2={"rgba(0, 123, 255, 0.18)"} />

                                <Card color={"rgb(40, 167, 69)"}
                                    title={"Recovered"}
                                    delta={statewise[st] ? statewise[st].deltarecovered : 0}
                                    value={statewise[st] ? statewise[st].recovered : 0}
                                    color2={"rgba(40, 167, 69,0.18)"} />

                                <Card
                                    color={"#919191"}
                                    title={"Deaths"}
                                    delta={statewise[st] ? statewise[st].deltadeaths : 0}
                                    value={statewise[st] ? statewise[st].deaths : 0}
                                    color2={"rgba(108, 117,125,0.2)"} />

                            </View>
                            {statewise[st] && statewise[st].confirmed > 0 &&
                                <View style={{ height: "26%", width: "100%", marginBottom: 30 }}>
                                    <PieChart data={statewise[st]} />
                                </View>
                            }
                            <View style={styles.bar}>

                                <View style={{ display: "flex", flexDirection: "row", width: "95%", height: 35 }}>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setMode(prevst => ({ current: 0, last: prevst.current }))}
                                        style={[{ backgroundColor: current == 0 ? "rgb(255, 7, 58)" : islight ? "white" : "black" }, styles.barButton]}>
                                        <Text style={[{ color: current == 0 ? "white" : islight ? "black" : "white" }, styles.barText]} >Confirmed</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setMode(prevst => ({ current: 1, last: prevst.current }))}
                                        style={[{ backgroundColor: current == 1 ? "rgb(40, 167, 69)" : islight ? "white" : "black" }, styles.barButton]} >
                                        <Text style={[{ color: current == 1 ? "white" : islight ? "black" : "white" }, styles.barText]}>Recovered</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setMode(prevst => ({ current: 2, last: prevst.current }))}
                                        style={[{ backgroundColor: current == 2 ? "#919191" : islight ? "white" : "black" }, styles.barButton]}>
                                        <Text style={[{ color: current == 2 ? "white" : islight ? "black" : "white" }, styles.barText]}>Deaths</Text>
                                    </TouchableOpacity>
                                </View>
                                {timeseries && <LineChart color={linecolor} currentbgcolor={currentbgcolor} lastbgcolor={lastbgcolor} mode={current} timeseries={timeseries} />}
                            </View>
                        </Animated.View>
                    </View >
                </ScrollView>
            </SafeAreaView >
        )
    }
}


const styles = StyleSheet.create({

    container: {
        paddingTop: STATUSBAR_HEIGHT,
        flex: 1,
        padding: 0,
        margin: 0,
        height: 1200

    },
    imagestyle: {
        right: "-89%",
        marginTop: 10,
        width: 50,
        height: 50
    },
    img: {
        marginTop: 40,
        height: "20%",
        width: "100%",
        position: "absolute",
        zIndex: -1
    },
    heading: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        height: 80,
        justifyContent: "center",
    },
    headinginner: {
        color: "white",
        fontWeight: "bold",
        fontSize: 4.5 * rem,
    },
    CardListcontainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        paddingTop: 70,
        justifyContent: "center",
        bottom: 0,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        position: "absolute",
    },
    select: {
        width: "65%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: -55,
        borderWidth: 2,
        height: 40,
        borderRadius: 50,
        borderColor: "#919191"
    },
    lastupdate: {
        width: "100%",
        display: "flex",
        marginTop: -5,
        alignItems: "center",
        justifyContent: "center",
    },
    cardBoxContainer: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "15%",
        flexDirection: "row"
    },
    bar: {
        display: "flex",
        width: "100%",
        height: "52%",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    barButton: {
        width: "30%",
        marginRight: 15,
        borderRadius: 7,
    },
    barText: {
        lineHeight: 31,
        fontFamily: "Quicksand-Bold",
        fontSize: 17,
        textTransform: 'uppercase',
        textAlign: "center"
    }
});
