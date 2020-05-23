import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
export default function Card(props) {


    return (
        <View style={[{ borderColor: props.color, backgroundColor: props.color2 }, styles.cardContainer]}>
            <View style={styles.num}>
                <Text style={[{ color: props.color }, styles.numText]}>{props.value && props.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
            </View>
            <View style={styles.inc}>
                <Text style={[{ color: props.color }, styles.incText]}>{props.delta && `+${props.delta}`}</Text>
            </View>
            <View style={styles.label}>
                <Text style={[{ color: props.color }, styles.labelText]}>{props.title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        height: "80%",
        width: "23%",
        display: "flex",
        flexWrap: "nowrap",
        margin: 3,
        marginTop: 13,
        borderRadius: 15,
        overflow: "hidden",
        position: "relative",
        borderWidth: 2
    },
    num: {
        width: "100%",
        height: "40%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    inc: {
        width: "100%",
        height: "25%",
        display: "flex",
        marginTop: -10,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    label: {
        width: "100%",
        height: "25%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    numText: {
        fontFamily: "Quicksand-Bold",
        fontSize: 18,
    },
    incText: {
        fontSize: 14,
        fontFamily: "Quicksand-SemiBold",
    },
    labelText: {
        fontSize: 15,
        fontFamily: "Quicksand-Bold",
        textTransform: "capitalize",
    }

})