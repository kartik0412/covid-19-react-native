import React, { useContext } from 'react'
import { Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { ThemeContext } from './App'

export default function Piechart(props) {
    let { theme: { islight } } = useContext(ThemeContext)
    data = [
        {
            name: "Confirmed",
            population: Number(props.data.confirmed),
            color: "rgba(255, 7, 50,1)",
            legendFontColor: islight ? "#121212" : "white",
            legendFontSize: 14,
        },
        {
            name: 'Active',
            population: Number(props.data.active),
            color: 'rgba(0, 123, 255,1)',
            legendFontColor: islight ? "#121212" : "white",
            legendFontSize: 14,
        },
        {
            name: 'Recovered',
            population: Number(props.data.recovered),
            color: 'rgba(40,167,69,1)',
            legendFontColor: islight ? "#121212" : "white",
            legendFontSize: 14,
        },
        {
            name: 'Deaths',
            population: Number(props.data.deaths),
            color: 'rgba(108, 117, 125,1)',
            legendFontColor: islight ? "#121212" : "white",
            legendFontSize: 14,
        },
    ]
    return (
        <PieChart
            data={data}
            width={Dimensions.get('window').width - 10}
            height={Math.floor(Dimensions.get('window').height / 3.5)}
            chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
            }}
            style={{
                marginVertical: 8,
                borderRadius: 16,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="6"
            absolute //for the absolute number remove if you want percentage
        />


    )
}