import React, { useEffect, useState, useContext } from 'react'
import { ThemeContext } from './App'
import { StyleSheet, Image, StatusBar, ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Animated, Picker, SafeAreaView } from 'react-native';
import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
import axios from 'axios';
import Card from "./Card"
import PieChart from './Piechart';
import LineChart from './LineChart';


const rem = 16;

export default function CardList() {

    let { theme: { islight }, settheme } = useContext(ThemeContext)
    let [state, setState] = useState({ isloading: true, statewise: [], st: 0 })
    let [mode, setMode] = useState(0)
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
        Animated.timing(
            slideup.slide,
            {
                toValue: 1,
                duration: 700,
                useNativeDriver: false
            }
        ).start();
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
        let lightsrc = './assets/images/light.png'
        let nightsrc = './assets/images/night.png'


        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} >
                    <View style={[{ backgroundColor: islight ? "rgb(0, 123, 255)" : "#121212" }, styles.container]}>
                        <StatusBar translucent={true} backgroundColor={islight ? "rgb(0, 123, 255)" : "#121212"} />
                        <TouchableOpacity activeOpacity={1} style={styles.imagestyle} onPress={() => settheme({ islight: !islight })}>
                            <Image style={{ width: 30, height: 30 }} source={islight ? require(nightsrc) : require(lightsrc)} />
                        </TouchableOpacity>

                        <Image style={styles.img} resizeMode="contain" source={require("./assets/images/cv.png")} />
                        <Animated.View style={[{
                            backgroundColor: islight ? "white" : "#000000",
                            height: slideup.slide.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0%", "65%"]
                            })
                        }, styles.CardListcontainer]}>

                            <View style={[{ borderColor: islight ? "#121212" : "white", }, styles.select]}>
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
                                    color2={"rgba(255, 7, 58, 0.13)"} />

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
                                    color2={"rgba(108, 117,125, 0.13)"} />

                            </View>
                            <View style={{ height: "28%", width: "100%" }}>
                                {statewise[st] && statewise[st].confirmed > 0 && <PieChart data={statewise[st]} />}
                            </View>

                            <View style={styles.bar}>

                                <View style={{ display: "flex", flexDirection: "row", width: "95%", height: 40 }}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => setMode(0)} style={{ width: "30%", borderColor: islight ? "black" : "white", borderBottomWidth: mode == 0 ? 5 : 0 }}>
                                        <Text style={[{ color: islight ? "black" : "white" }, styles.barText]} >Confirmed</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={1} onPress={() => setMode(1)} style={{ width: "30%", borderColor: islight ? "black" : "white", borderBottomWidth: mode == 1 ? 5 : 0 }}>
                                        <Text style={[{ color: islight ? "black" : "white" }, styles.barText]}>Recovered</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={1} onPress={() => setMode(2)} style={{ width: "30%", borderColor: islight ? "black" : "white", borderBottomWidth: mode == 2 ? 5 : 0 }}>
                                        <Text style={[{ color: islight ? "black" : "white" }, styles.barText]}>Deaths</Text>
                                    </TouchableOpacity>

                                </View>
                                <View style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    height: "75%",
                                    width: "95%",
                                    padding: 10,
                                    marginTop: 10,
                                    borderRadius: 15,
                                    backgroundColor: mode == 0 ? "rgba(255, 7, 58, 0.13)" : mode == 1 ? "rgba(40, 167, 69,0.18)" : "rgba(108, 117,125, 0.13)"
                                }}>
                                    {timeseries && <LineChart color={mode == 0 ? "rgb(255, 7, 58)" : mode == 1 ? "rgb(40, 167, 69)" : "#919191"} mode={mode} timeseries={timeseries} />}
                                </View>

                            </View>
                        </Animated.View>
                    </View >
                </ScrollView>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({

    container: {
        paddingTop: STATUSBAR_HEIGHT,
        flex: 1,
        padding: 0,
        margin: 0,
        height: 1150

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
        height: "80%",
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
        height: "50%",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    barText: {
        lineHeight: 40,
        fontFamily: "Quicksand-Bold",
        fontSize: 17,
        textTransform: 'uppercase'
    }
});
