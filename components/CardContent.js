import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { Card, Input, Button } from '@rneui/themed';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { getNote, createNote, updateNote } from '../modules/NoteStorage';

const screenWidth = Dimensions.get('window').width;
const cardWidthPercentage = 91; // Adjust this value to change the card width

const cardWidth = (screenWidth * cardWidthPercentage) / 100;
const marginValue = 15; // Adjust this value to set the desired margin  

export default function CardContent({ content, handleContent, switched, title, handleTitle, savedSuccessfully }) {
    var newNote = true; //I check wheter I'm editing an existing note or creating a new one by retrieving the id from the navigation

    const navigation = useNavigation();
    const route = useRoute();
    const noteId = route.params?.id;

    const [data, setData] = useState("");
    const [loading, setLoading] = useState(true);
    const [changeTitleTriggered, setTitleChangeTriggered] = useState(false);
    const [changeContentTriggered, setContentChangeTriggered] = useState(false);

    if (noteId !== '-1') {
        newNote = false;
    }

    useEffect(() => {
        console.log("note id: " + noteId); //testing purposes
        if (noteId !== '-1') {
            fetchData(noteId);
            console.log("use effect event");
            console.log(title);
        } else {
            setLoading(false); // Set loading to false when no noteId is provided
        }
    }, []);

    useEffect(() => {
        console.log("use effect 2");
        console.log(data);
        if (data !== "") {
            setLoading(false);// When data has been loaded then stop showing loader
        }
    }, [data]);

    const fetchData = async (sId) => {
        console.log("I'm here");
        const response = await getNote(sId);
        setData(response);
    };

    //HANDLE SAVING NOTES
    const inputTitle = useRef(null); // Create a ref for the title TextInput
    const inputContent = useRef(null); // Create a ref for the content TextInput

    const save = () => {
        var newTitle = title;
        var newContent = content;

        if (!newNote) {
            if (title == '') {
                newTitle = data.title;
            }
            if (content == '') {
                newContent = data.content;
            }

            updateData(noteId, newTitle, newContent);
        } else {
            createData(newTitle, newContent);
        }
    }

    const createData = async (title, content) => {
        const response = await createNote(title, content);
        if (response == 'SUCCESS') {
            savedSuccessfully("Nota creata con successo");
            navigation.navigate("Home");
        } else {
            alert("Non è stato possibile creare la nota");
        }
    };

    const updateData = async (id, title, content) => {
        const response = await updateNote(id, title, content);
        if (response == "SUCCESS") {
            savedSuccessfully("Nota aggiornata con successo");
            navigation.navigate("Home");
        } else {
            alert("Non è stato possibile aggiornare la nota");
        }
    };

    const titleIsInitial = (title === '');

    if (loading) {
        return <Text style={styles.text}>Loading...</Text>;
    } else {
        return (
            <ScrollView>
                <Card
                    //  key={item.id} 
                    containerStyle={styles.cardContainer} wrapperStyle={styles.card}
                >
                    <TextInput numberOfLines={1} ellipsizeMode="tail" style={styles.title} placeholder='Title' ref={inputTitle} onChangeText={(text) => {
                        handleTitle(text); console.log("title changed");
                        setTitleChangeTriggered(true);
                        console.log("title: " + title);
                    }}>{titleIsInitial ? (newNote ? "" : data.title) : title}</TextInput>
                    <Card.Divider />
                    <TextInput multiline numberOfLines={null} style={styles.text} placeholder='Content' ref={inputContent}
                        onChangeText={(text) => { handleContent(text); setContentChangeTriggered(true); }}>{changeContentTriggered ? content : data.content}</TextInput>
                    <View style={styles.bottomContainer}>
                        <Button
                            icon={<Ionicons name="checkmark-circle-outline" size={24} color="#FFECD1" />}
                            buttonStyle={styles.infoButton}
                            onPress={save}
                        />
                    </View>
                </Card>
            </ScrollView>
        );
    }
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
        width: cardWidth, // Set a fixed width for the card
        marginBottom: 15,
        marginHorizontal: marginValue,
    },
    card: {
        // borderWidth: 0,
        // borderRadius: 20,
    },
    text: {
        color: '#F5E9E2',
        fontSize: 17,
    },
    title: {
        color: '#F5E9E2',
        fontSize: 21,
        fontWeight: 'bold',
    },
    bottomContainer: {
        backgroundColor: '#D44D5C',
        flexDirection: "row-reverse",
        alignItems: "flex-end",
        marginTop: 10
    },
    infoButton: {
        backgroundColor: '#D44D5C',
    }
});