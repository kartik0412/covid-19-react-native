import React, { useContext, useEffect, } from 'react'
import { ThemeContext } from './App'
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory-native'
import { Animated } from 'react-native'

export default function LineChart(props) {

    let { theme: { islight } } = useContext(ThemeContext)
    let bg = new Animated.Value(0)

    useEffect(() => {
        Animated.timing(bg, {
            toValue: 1,
            duration: 700,
            useNativeDriver: false
        }).start()
    }, [props.currentbgcolor])


    const getData = () => {
        let data = []
        var { timeseries, mode } = props;
        for (let i = timeseries.length - 45; i < timeseries.length; i++) {
            if (mode == 0) {
                data.push({
                    x: timeseries[i].date,
                    y: Number(timeseries[i].totalconfirmed)
                })
            }
            else if (mode == 1) {
                data.push({
                    x: timeseries[i].date,
                    y: Number(timeseries[i].totalrecovered)
                })
            }
            else {
                data.push({
                    x: timeseries[i].date,
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
        <Animated.View style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            height: "70%",
            width: "95%",
            padding: 10,
            paddingTop: 0,
            marginTop: 10,
            backgroundColor: bgg,
            borderRadius: 15
        }}>
            <VictoryChart theme={VictoryTheme.material} >
                <VictoryAxis
                    style={{
                        tickLabels: {
                            fill: islight ? "#333333" : "white",
                            fontSize: 12,
                            padding: 5
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
    )
}