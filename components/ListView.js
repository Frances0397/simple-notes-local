import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ListItem, CheckBox } from '@rneui/themed';
import { useNavigation, useIsFocused } from '@react-navigation/native';

export default function ListView({ selectionMode, toggleSelectionMode, handleSelectedItems, selectedItems, refresh }) {
    const [data, setData] = useState([]); //TO-DO: vedere se la parte di chiamata, visto che è uguale per le due viste, si può modularizzare
    const [refreshing, setRefreshing] = React.useState(false);
    const isFocused = useIsFocused();
    const [itemChecked, setItemChecked] = useState([]);

    console.log("selection mode " + selectionMode); //testing purposes

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
        try {
            const response = await axios.get('http://192.168.1.62:3000/notes');
            console.log(response.data);
            setData(response.data); // Store the fetched data in the state
            if (selectionMode) {
                toggleSelectionMode();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const refreshData = async () => {
        // User is dragging down
        console.log('Dragging down');
        fetchData();
    };

    //navigate to content page
    const navigation = useNavigation(true);

    const onSeeContent = async (sId) => {
        console.log("Nav to " + sId);
        navigation.navigate("Detail", { id: sId });
    };

    //handling of massive selection + deletion
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

    return (
        <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
        }>
            <View style={styles.container}>
                {data.map((item, index) => (
                    <ListItem key={item.id} style={styles.list} onPress={() => { if (!selectionMode) { onSeeContent(item.id); } }}
                        onLongPress={() => { if (!selectionMode) { toggleSelectionMode(); } }}>
                        <ListItem.Content>
                            <ListItem.Title numberOfLines={1} ellipsizeMode='tail'>{item.title}</ListItem.Title>
                            <Text style={styles.text} numberOfLines={4} ellipsizeMode="tail">{item.content}</Text>
                        </ListItem.Content>
                        {selectionMode && <CheckBox checkedIcon="dot-circle-o" uncheckedIcon="circle-o"
                            key={item.id} checked={itemChecked[index]} onPress={() => toggleItemCheck(index, item)}></CheckBox>}
                    </ListItem>
                ))}
            </View>
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 10,
        // backgroundColor: '#fff',
        // // alignItems: 'center',
        // // alignContent: 'center',
        // alignSelf: 'center',
        // flexDirection: 'row', // Set the flex direction to "row"
        // flexWrap: 'wrap', // Allow the items to wrap to the next row
        // justifyContent: 'flex-start', // Align items with space between thems
    },
    list: {
        flex: 1,
        backgroundColor: 'white',
        flexWrap: 'wrap',
    }
});