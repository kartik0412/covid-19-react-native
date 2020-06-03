import React, { useContext, useEffect, useState } from 'react'
import { Animated, View, Text } from 'react-native'
import { ThemeContext } from './App'
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory-native'
import Slider from '@react-native-community/slider'

export default function LineChart(props) {

    let { theme: { islight } } = useContext(ThemeContext)
    let bg = new Animated.Value(0)
    let [slider, setSlider] = useState(Math.floor(props.timeseries.length / 2))
    useEffect(() => {
        Animated.timing(bg, {
            toValue: 1,
            duration: 700,
            useNativeDriver: false
        }).start()
    }, [props])


    const getData = () => {
        let data = []
        var { timeseries, mode } = props;
        for (let i = timeseries.length - slider; i < timeseries.length; i++) {
            var d = timeseries[i].date.split(" ")
            d = d[0] + " " + d[1].substr(0, 3)
            if (mode == 0) {
                data.push({
                    x: d,
                    y: Number(timeseries[i].totalconfirmed)
                })
            }
            else if (mode == 1) {
                data.push({
                    x: d,
                    y: Number(timeseries[i].totalrecovered)
                })
            }
            else {
                data.push({
                    x: d,
                    y: Number(timeseries[i].totaldeceased)
                })
            }
        }
        return data
    }
    let bgg = bg.interpolate({
        inputRange: [0, 1],
        outputRange: [props.lastbgcolor, props.currentbgcolor]
    })
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            height: "100%",
            width: "95%"

        }}>
            <View style={{ width: "95%", height: 40 }}>
                <Text style={{ fontFamily: "Quicksand-SemiBold", lineHeight: 40, color: islight ? "#121212" : "white" }}>Growth of Cases in Last {slider} days in India</Text>
            </View>
            <Slider
                value={slider}
                style={{ width: "100%", height: 40 }}
                minimumValue={10}
                step={1}
                thumbTintColor={props.color}
                onValueChange={value => setSlider(value)}
                maximumValue={Math.max(100, props.timeseries.length)}
                minimumTrackTintColor={props.color}
                maximumTrackTintColor={props.currentbgcolor}
            />
            <Animated.View style={{
                flex: 1,
                justifyContent: "center",
                alignContent: "center",
                height: "100%",
                width: "100%",
                backgroundColor: bgg,
                borderRadius: 15,
                padding: 5,
                paddingTop: 0,
            }}>

                <VictoryChart theme={VictoryTheme.material} >
                    <VictoryAxis
                        style={{
                            tickLabels: {
                                fill: islight ? "#333333" : "white",
                                fontSize: 12,
                                padding: 0
                            }
                        }}
                        dependentAxis fixLabelOverlap={true} />
                    <VictoryAxis
                        style={{
                            axisLabel: {
                                fill: islight ? "#333333" : "white",
                                fontSize: 18,
                                padding: 32
                            },
                            tickLabels: {
                                fill: islight ? "#333333" : "white",
                                fontSize: 9,
                                padding: 5
                            }
                        }}
                        fixLabelOverlap={true} />
                    <VictoryLine
                        animate={{
                            duration: 700,
                            onLoad: {
                                duration: 700
                            }
                        }}
                        style={{
                            data: { stroke: props.color },
                            parent: { border: "1px solid #ccc" }
                        }}
                        data={getData()}
                    />
                </VictoryChart>
            </Animated.View>

        </View>
    )
}