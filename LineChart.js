import React, { useContext } from 'react'
import { ThemeContext } from './App'
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory-native'

export default function LineChart(props) {

    let { theme: { islight } } = useContext(ThemeContext)

    const getData = () => {
        let data = []
        var { timeseries, mode } = props;
        for (let i = timeseries.length - 30; i < timeseries.length; i++) {
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

    return (
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
                label="Last 30 Days Stats"
                fixLabelOverlap={true} />
            <VictoryLine
                animate={{
                    duration: 700
                }}
                style={{
                    data: { stroke: props.color },
                    parent: { border: "1px solid #ccc" }
                }}
                data={getData()}
            />
        </VictoryChart>
    )
}