import React, { useContext } from 'react'
import { Dimensions, View } from 'react-native';
import { VictoryPie, VictoryLegend } from 'victory-native'
import { ThemeContext } from './App'

export default function Piechart(props) {
    let { theme: { islight } } = useContext(ThemeContext)
    const graphicData = [
        { x: ' ', y: Number(props.data.active) },
        { x: ' ', y: Number(props.data.recovered) },
        { x: ' ', y: Number(props.data.deaths) }
    ];
    const graphicColor = ['rgba(0, 123, 255,1)', 'rgba(40,167,69,1)', '#919191'];
    return (

        <View style={{ display: "flex", flexDirection: "row", width: "100%", height: "100%" }}>
            <View style={{ width: "50%", height: "100%" }}>
                <VictoryPie
                    padAngle={1}
                    origin={{
                        x: Dimensions.get('screen').width / 3,
                        y: Dimensions.get('window').height / 6.5
                    }}
                    animate={{ easing: 'exp', duration: 700 }}
                    data={graphicData}
                    width={Dimensions.get('screen').width / 1.4}
                    height={Dimensions.get('screen').height / 3.4}
                    colorScale={graphicColor}
                    innerRadius={Dimensions.get('screen').height / 7.5}
                />
            </View>
            <View style={{ width: "50%", height: "100%" }}>
                <VictoryLegend
                    y={Dimensions.get('screen').height / 12}
                    x={Dimensions.get('screen').width / 7.2}
                    height={Dimensions.get('screen').width / 2}
                    width={Dimensions.get('screen').width / 2}
                    orientation="vertical"
                    gutter={20}
                    style={{
                        labels: { fill: islight ? "#212121" : "white", fontSize: 16, fontFamily: "Quicksand-SemiBold" },
                    }}
                    data={[
                        { name: "Active", symbol: { fill: "rgb(0,123,255)" } },
                        { name: "Recovered", symbol: { fill: "rgb(40,167,69)" } },
                        { name: "Deaths", symbol: { fill: "#919191" } }
                    ]}
                />

            </View>
        </View>
    )
}