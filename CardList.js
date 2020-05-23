import React, { useEffect, useState, useContext } from 'react'
import { ThemeContext } from './App'
import { StyleSheet, Image, StatusBar, View, Text, TouchableOpacity, ActivityIndicator, Animated, Picker } from 'react-native';
import axios from 'axios';
import Card from "./Card"
import { PieChart } from "react-native-chart-kit";

const data = [
    {
        name: "Seoul",
        population: 21500000,
        color: "rgba(131, 167, 234, 1)",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: "Toronto",
        population: 2800000,
        color: "#F00",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: "Beijing",
        population: 527612,
        color: "red",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: "New York",
        population: 8538000,
        color: "#ffffff",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: "Moscow",
        population: 11920000,
        color: "rgb(0, 0, 255)",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    }
];

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
        return (
            <View style={styles.CardListcontainer}>
                <ActivityIndicator size="large" />
            </View>
        )
    } else {
        let { statewise, st } = state
        let lightsrc = './assets/images/light.png'
        let nightsrc = './assets/images/night.png'
        return (
            <View style={[{ backgroundColor: islight ? "rgb(0, 123, 255)" : "#121212" }, styles.container]}>
                <StatusBar translucent backgroundColor="transparent" />

                <TouchableOpacity activeOpacity={1} style={styles.imagestyle} onPress={() => settheme({ islight: !islight })}>
                    <Image style={{ width: 25, height: 25 }} source={islight ? require(nightsrc) : require(lightsrc)} />
                </TouchableOpacity>
                <PieChart
                    data={data}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
                {/* <Image
                    style={styles.img}
                    source={require("./assets/images/cv.png")}
                /> */}
                <Animated.View style={[{
                    backgroundColor: islight ? "white" : "#000000",
                    height: slideup.slide.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "65%"]
                    })
                }, styles.CardListcontainer]}>

                    <View style={[{ borderColor: islight ? "black" : "white", }, styles.select]}>
                        <Picker
                            selectedValue={st}
                            style={{ color: islight ? "black" : "white", height: 50, width: 220 }}
                            onValueChange={(itemValue) => setState(prevst => ({ ...prevst, st: itemValue }))}
                        >
                            {statewise.map((i, j) => <Picker.Item key={j} label={i.state} value={j} />)}
                        </Picker>
                    </View>
                    <View style={styles.lastupdate}>
                        <Text style={{ color: islight ? "black" : "white" }}>
                            Last updated :{" "}{statewise[st] && getLasteUpdateTime(statewise[st].lastupdatedtime)}
                        </Text>
                    </View>

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

                </Animated.View>
            </View >
        )
    }
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 55,
        height: "100%",
        width: "100%",
        zIndex: 1
    },
    imagestyle: {
        right: "-90%",
        marginTop: -23,
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
        paddingTop: 40,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        paddingTop: 70,
        justifyContent: "center",
        bottom: 0,
        position: "absolute",
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
    },
    select: {
        width: "60%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: -55,
        borderWidth: 1,
        height: 40,
        borderRadius: 50
    },
    lastupdate: {
        width: "100%",
        display: "flex",
        marginTop: -5,
        alignItems: "center",
        justifyContent: "center"
    }
});
