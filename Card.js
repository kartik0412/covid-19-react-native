import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
export default function Card(props) {


    return (
        <View style={[{ backgroundColor: props.color2 }, styles.cardContainer]}>
            <View style={styles.num}>
                <Text style={[{ color: props.color }, styles.numText]}>{props.value && props.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
            </View>
            <View style={styles.inc}>
                <Text style={[{ color: props.color }, styles.incText]}>{props.delta && `[+${props.delta}]`}</Text>
            </View>
            <View style={styles.label}>
                <Text style={[{ color: props.color }, styles.labelText]}>{props.title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        height: "37%",
        width: "37%",
        display: "flex",
        margin: 10,
        borderRadius: 20,
        overflow: "hidden"
    },
    num: {
        width: "100%",
        height: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    inc: {
        width: "100%",
        height: "10%",
        display: "flex",
        marginTop: -10,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        width: "100%",
        height: "40%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    numText: {
        fontFamily: "Quicksand-SemiBold",
        fontSize: 25,
    },
    incText: {
        fontSize: 16,
        fontFamily: "Quicksand-Regular",
    },
    labelText: {
        fontSize: 20,
        // fontFamily: "Quicksand-SemiBold",
        textTransform: "capitalize",
    }

})