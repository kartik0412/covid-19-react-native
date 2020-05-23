import React, { useEffect, useState, useContext } from 'react'
import { ThemeContext } from './App'
import { StyleSheet, Dimensions, Image, StatusBar, View, Text, TouchableOpacity, ActivityIndicator, Animated, Picker } from 'react-native';
import axios from 'axios';
import Card from "./Card"
import PieChart from './Piechart';

const rem = 16;

export default function CardList() {

    let { theme: { islight }, settheme } = useContext(ThemeContext)
    let [state, setState] = useState({ isloading: true, statewise: [], st: 0 })
    let [slideup, setslideup] = useState({ slide: new Animated.Value(0) })

    useEffect(() => {
        const getData = async () => {
            let { data } = await axios("https://api.covid19india.org/data.json");
            setState({
                statewise: data.statewise,
                st: 0, isloading: false
            })
        }
        Animated.timing(
            slideup.slide,
            {
                toValue: 1,
                duration: 700,
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
        let { statewise, st } = state
        let lightsrc = './assets/images/light.png'
        let nightsrc = './assets/images/night.png'
        return (
            <View style={[{ backgroundColor: islight ? "rgb(0, 123, 255)" : "#121212" }, styles.container]}>
                <StatusBar translucent backgroundColor="transparent" />

                <TouchableOpacity activeOpacity={1} style={styles.imagestyle} onPress={() => settheme({ islight: !islight })}>
                    <Image style={{ width: 25, height: 25 }} source={islight ? require(nightsrc) : require(lightsrc)} />
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
                            color={"rgb(108, 117, 125)"}
                            title={"Deaths"}
                            delta={statewise[st] ? statewise[st].deltadeaths : 0}
                            value={statewise[st] ? statewise[st].deaths : 0}
                            color2={"rgba(108, 117,125, 0.13)"} />

                    </View>
                    <View style={{ height: "100%", width: "100%" }}>
                        {statewise[st] && <PieChart data={statewise[st]} />}
                    </View>
                </Animated.View>
            </View >
        )
    }
}


const styles = StyleSheet.create({
    container: {
        padding: 0,
        margin: 0,
        paddingTop: 40,
        height: "100%",
        width: "100%"

    },
    imagestyle: {
        right: "-90%",
        marginTop: -5,
        width: 25,
        zIndex: 100,
        height: 25
    },
    img: {
        marginTop: 40,
        height: "35%",
        width: "100%",
        position: "absolute"
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
        height: "32%",
        flexDirection: "row"
    }
});
