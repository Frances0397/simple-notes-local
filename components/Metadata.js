import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Metadata({ label, value }) {
    return (
        <View style={styles.metadataLine}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.content}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    metadataLine: {
        flexDirection: 'row',
        marginHorizontal: 10,
        alignContent: 'flex-start',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    label: {
        fontWeight: "bold",
        color: '#F5E9E2',
        margin: 10,
        fontSize: 15,
    },
    content: {
        color: '#F5E9E2',
        margin: 10,
        fontSize: 14,
    },
});