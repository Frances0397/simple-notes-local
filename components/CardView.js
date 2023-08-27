import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Animated } from 'react-native';
import { Card, CheckBox } from '@rneui/themed';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getAllNotes } from '../modules/NoteStorage';

export default function CardView({ selectionMode, toggleSelectionMode, handleSelectedItems, selectedItems, refresh }) {
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const isFocused = useIsFocused();
    // const [isChecked, setIsChecked] = useState(false);
    const [itemChecked, setItemChecked] = useState([]);

    // Make the API call using Axios when the component mounts
    useEffect(() => {
        //Function to make the API call
        if (isFocused) {
            fetchData();
        }
        //I set all the chekboxes to unselected
        const initialChecked = new Array(data.length).fill(false);
        setItemChecked(initialChecked);
    }, [isFocused, refresh]);

    const fetchData = async () => {
        const response = await getAllNotes();
        setData(response);
        if (selectionMode) {
            toggleSelectionMode();
        }
    };

    const navigation = useNavigation(true);

    const onSeeContent = async (sId) => {
        console.log("Nav to " + sId);
        navigation.navigate("Detail", { id: sId });
    };

    const refreshData = async () => {
        // User is dragging down
        console.log('Dragging down');
        fetchData();
    };

    //handling of massive selection + deletion
    // const onHold = () => {
    //     console.log("you long pressed a note!");
    //     //show checkboxes for multiple selection
    //     setSelectionMode(true);
    // };

    const toggleItemCheck = (index, item) => {
        setItemChecked((prevChecked) => {
            const newChecked = [...prevChecked];
            newChecked[index] = !newChecked[index];
            return newChecked;
        });

        // Toggle the selection status of the item and update the selected items list
        const updatedSelectedItems = selectedItems.includes(item)
            ? selectedItems.filter((selectedItem) => selectedItem !== item)
            : [...selectedItems, item];

        // Call the function passed as a prop to update the selected items in the parent component
        handleSelectedItems(updatedSelectedItems);
    };

    //animation
    const [pulse] = useState(new Animated.Value(1));

    const pulseAnimation = () => {
        Animated.sequence([
            Animated.timing(pulse, { toValue: 1.1, duration: 300, useNativeDriver: true }),
            Animated.timing(pulse, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
    };

    return (
        <ScrollView styles={styles.mainContainer} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
        }>
            <View style={styles.container}>
                {data.map((item, index) => (
                    <TouchableOpacity key={item.id} onPress={() => { if (!selectionMode) { onSeeContent(item.id); } }}
                        style={styles.touchableCard} onLongPress={() => { if (!selectionMode) { toggleSelectionMode(); pulseAnimation(); } }}>
                        <Animated.View style={{ transform: [{ scale: pulse }] }}>
                            <Card key={item.id} containerStyle={styles.cardContainer} wrapperStyle={styles.card} >
                                <View style={styles.cardContent}>

                                    <Card.Title numberOfLines={1} ellipsizeMode='tail' color="#F5E9E2">{item.title}</Card.Title>
                                    <Card.Divider />
                                    <Text style={styles.text} numberOfLines={selectionMode ? 2 : 4} ellipsizeMode="tail">{item.content}</Text>
                                    {selectionMode && (<View style={styles.bottomContainer}>
                                        < CheckBox containerStyle={styles.checkboxContainer} checkedIcon="dot-circle-o"
                                            key={item.id}
                                            uncheckedIcon="circle-o" right='true' checked={itemChecked[index]}
                                            onPress={() => toggleItemCheck(index, item)}></CheckBox>
                                    </View>)}
                                </View>
                            </Card>
                        </Animated.View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    container: {
        // flex: 1,
        // // padding: 10,
        // backgroundColor: '#001524',
        // alignItems: 'flex-start',
        // // alignContent: 'center',
        // // alignSelf: 'center',
        flexDirection: 'row', // Set the flex direction to "row"
        flexWrap: 'wrap', // Allow the items to wrap to the next row
        justifyContent: 'space-between', // Align items with space between thems
    },
    touchableCard: {
        width: '50%',
        // height: 150,
    },
    cardContainer: {
        borderRadius: 15, // Customize the border radius as desired
        borderWidth: 0, // Remove the outline (border)
        backgroundColor: '#D44D5C',
        // flexDirection: 'row', // Set the flex direction to "row"
        // // flexWrap: 'wrap', // Allow the items to wrap to the next row
        // //elevation: 3, // Add elevation (shadow) for Android devices
        // width: '100%', // Set a fixed width for the card
        height: 150, // Set a fixed height for the card
        marginBottom: 15,
    },
    card: {
        // borderWidth: 0,
        // borderRadius: 20,
    },
    text: {
        color: '#F5E9E2',
    },
    checkboxContainer: {
        padding: 0,
        margin: 0,
        marginTop: 8,
        marginLeft: 20,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
    },
    cardContent: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    bottomContainer: {
        // position: 'absolute',
        backgroundColor: 'transparent',
        flexDirection: "row-reverse",
        alignItems: "flex-end",
        // bottom: -30,
        // right: 2,
    },
});

