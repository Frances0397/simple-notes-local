import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput, PermissionsAndroid } from 'react-native';
import { Card, Input, Button } from '@rneui/themed';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import Metadata from './Metadata';
import { getNote, deleteNote } from '../modules/NoteStorage';

const screenWidth = Dimensions.get('window').width;
const cardWidthPercentage = 91; // Adjust this value to change the card width

const cardWidth = (screenWidth * cardWidthPercentage) / 100;
const marginValue = 15; // Adjust this value to set the desired margin  

export default function CardDetail({ content, title, deletedSuccessfully }) {

    var newNote = true; //I check wheter I'm editing an existing note or creating a new one by retrieving the id from the navigation

    const navigation = useNavigation();
    const route = useRoute();
    const noteId = route.params?.id;

    const [data, setData] = useState("");
    const [loading, setLoading] = useState(true);

    if (noteId !== '-1') {
        newNote = false;
    }

    useEffect(() => {
        if (noteId !== '-1') {
            fetchData(noteId);
            console.log("use effect event");
            console.log(data === "");
            console.log(loading);
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
        const data = await getNote(sId);
        setData(data);
    }

    //Make calculations for the metadata to show
    const currentDate = new Date;
    var currentDay = currentDate.getDay();
    var currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    if (currentDay.toString().length < 2) {
        currentDay = '0' + currentDay;
    }
    if (currentMonth.toString().length < 2) {
        currentMonth = '0' + currentMonth;
    }
    const dateToShow = currentDay + '/' + currentMonth + '/' + currentYear;
    console.log(dateToShow); //testing purposes

    var currentHour = currentDate.getHours();
    var currentMinute = currentDate.getMinutes();
    var currentSeconds = currentDate.getSeconds();

    const timeToShow = currentHour + ':' + currentMinute + ':' + currentSeconds;
    console.log(timeToShow); //testing purposes
    if (currentHour.toString().length < 2) {
        if (currentHour.toString().length < 1) {
            currentHour = '00';
        } else {
            currentHour = '0' + currentHour;
        }
    }
    if (currentMinute.toString().length < 2) {
        if (currentMinute.toString().length < 1) {
            currentMinute = '00';
        } else {
            currentMinute = '0' + currentMinute;
        }
    }
    if (currentSeconds.toString().length < 2) {
        if (currentSeconds.toString().length < 1) {
            currentSeconds = '00';
        } else {
            currentSeconds = '0' + currentSeconds;
        }
    }

    const countWords = (text) => {
        // Remove leading and trailing spaces and then split by spaces
        if (text !== undefined) {
            const wordsArray = text.trim().split(/\s+/);
            return wordsArray.length;
        } else {
            return 0;
        }
    }

    var wordsCount, characterCount;

    //calcolo la lunghezza in caratteri e parole direttamente dalla view
    console.log("content" + content);
    if (content !== '') {
        console.log("here");
        wordsCount = countWords(content);
        characterCount = content.length;
    } else {
        if (!newNote) {
            if (!loading) {
                console.log("culo");
                wordsCount = countWords(data.content);
                characterCount = data.content.length;
            }
        }
    }

    //HANDLE BUTTONS
    const onExport = async () => {
        if (content === '') {
            content = data.content;
        }

        if (title === '') {
            title = data.title;
        }

        console.log("exporting data");
        console.log(content);
        console.log(title);

        const permission = await MediaLibrary.requestPermissionsAsync();

        if (permission.granted) {
            try {
                let fileUri = FileSystem.documentDirectory + 'Download/' + title + '.txt';
                console.log('fileuri: ' + fileUri);
                await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 });
                const asset = await MediaLibrary.createAssetAsync(fileUri);
                await MediaLibrary.createAlbumAsync("SimpleNotes", asset, false);
                alert("File salvato con successo");
                navigation.navigate("Home");
            } catch (error) {
                console.error(error);
                alert("Non è stato possibile salvare la note come file");
            }
        }

    };

    const onDelete = async () => {
        const response = await deleteNote(noteId);

        if (response === 'SUCCESS') {
            alert("Nota cancellata con successo");
            navigation.navigate("Home");
        } else {
            alert("non è stato possibile cancellare la nota");
        }
    };

    const titleIsInitial = (title === '');

    if (loading) {
        return (<Text>Loading...</Text>);
    } else {
        return (
            <ScrollView>
                <Card
                    //  key={item.id} 
                    containerStyle={styles.cardContainer} wrapperStyle={styles.card}
                >
                    <Card.Title style={styles.title}>{titleIsInitial ? (newNote ? "" : data.title) : title}</Card.Title>
                    <Card.Divider />
                    <View style={styles.metadataContainer}>
                        <Metadata label='Data creazione:' value={newNote ? dateToShow : data.date_created} />
                        <Metadata label='Ora creazione:' value={newNote ? timeToShow : data.time_created} />
                        <Metadata label='Data ultima modifica:' value={newNote ? dateToShow : data.date_modified} />
                        <Metadata label='Ora ultima modifica:' value={newNote ? timeToShow : data.time_modified} />
                        <Metadata label='Numero parole:' value={wordsCount} />
                        <Metadata label='Numero caratteri:' value={characterCount} />
                    </View>
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity style={styles.exportButtonContainer} onPress={onExport}>
                            <Text>Esporta nota</Text>
                            <Ionicons name="log-out-outline" size={15} style={styles.buttonIcons} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButtonContainer} onPress={onDelete}>
                            <Ionicons name="trash-outline" size={15} />
                            <Text>Elimina</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
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
    bottomContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        // position: "absolute",
        // bottom: 10,
    },
    exportButtonContainer: {
        flexDirection: 'row',
        backgroundColor: "blue",
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        borderRadius: 15,
        justifyContent: 'space-evenly',
        width: 150,
        height: 30,
    },
    deleteButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        borderRadius: 15,
        justifyContent: 'space-evenly',
        width: 80,
        height: 30,
    },
    buttonIcons: {
        marginTop: 3,
    },
    title: {
        color: '#F5E9E2',
        fontSize: 21,
        fontWeight: 'bold',
    },
    metadataContainer: {
        flexDirection: 'column',
        marginBottom: 50,
    },
});