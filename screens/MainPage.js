import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, View, Animated, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, Card, Button, Icon, ThemeProvider, createTheme } from '@rneui/themed';
import { Header, HeaderProps } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import CardView from '../components/CardView'
import ListView from '../components/ListView';
import { deleteNotes } from '../modules/NoteStorage';
// import { TouchableOpacity } from 'react-native-gesture-handler';

const theme = createTheme({
    colors: {
        background: '#39373B',   // Background color of the app
        primary: '#773344',      // Your primary color
        secondary: '##D44D5C',    // Your secondary color
    },
    Text: {
        style: {
            color: '#F5E9E2',      // Text color
            fontSize: 16,
        },
    },
    mode: 'dark',
});

export default function App() {
    const navigation = useNavigation(true);

    const [showCardView, setShowCardView] = useState(true);
    const [selectionMode, setSelectionMode] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [triggerRefresh, setTriggerRefresh] = useState(false);

    const switchView = () => {
        setShowCardView(!showCardView);
        setSelectionMode(false);
        setSelectedItems([]);
        setTriggerRefresh(false);
    };

    const addNote = () => {
        console.log("Nav to card detail page");
        navigation.navigate("Detail", { id: "-1" });
        setTriggerRefresh(false);
    };

    const handleToggleSelectionMode = () => {

        console.log("here");

        setSelectionMode(!selectionMode);
        setSelectedItems([]);
        setTriggerRefresh(false);
    };

    const stopSelectionMode = () => {
        setSelectionMode(false);
        setTriggerRefresh(false);
    };

    const deleteSelected = async () => {
        console.log("Delete selected items");
        console.log(selectedItems);

        //loop at the items to delete and append their index to an index array
        let aIndexes = [];
        for (let i = 0; i < selectedItems.length; i++) {
            aIndexes.push(selectedItems[i].id);
        }

        console.log(aIndexes); //testing purposes
        let status = await deleteNotes(aIndexes);

        if (status === 'SUCCESS') {
            alert("Note cancellate con successo!") // @TO-DO: turn into modal (or remove?)
            // @TO-DO: refresh page content
            setSelectionMode(false);
            setTriggerRefresh(true);
        } else {
            alert("Non è stato possibile cancellare le note selezionate") // @TO-DO:turn into modal
        }

    };

    const handleSelectedItems = (newSelectedItems) => {
        setSelectedItems(newSelectedItems);
    };

    //handle message modal
    const [modalVisible, setModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleShowModal = (text) => {
        console.log("modal: " + modalVisible);
        setSuccessMessage(text);
        setModalVisible(true);
    };

    return (
        <SafeAreaProvider>
            <ThemeProvider theme={theme}>
                <View style={styles.container}>
                    <Header
                        containerStyle={{ backgroundColor: theme.colors.primary }}
                        leftComponent={
                            <Ionicons name={showCardView ? "menu" : "grid-outline"} size={24} color="#F5E9E2" onPress={switchView} />
                        }
                        rightComponent={selectionMode && <Ionicons name="close" size={24} onPress={stopSelectionMode} />}
                    />
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <TouchableOpacity
                            style={styles.modalBackdrop}
                            activeOpacity={1} // Prevent any interaction with the background
                            onPress={() => closeModal()} // Close the modal when pressed
                        />
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text>{successMessage}</Text>
                                {/* <Button title="Confirm" onPress={confirmNavigation} />
                                <Button title="Cancel" onPress={cancelNavigation} /> */}
                            </View>
                        </View>
                    </Modal>
                    {showCardView ? <CardView selectionMode={selectionMode} toggleSelectionMode={handleToggleSelectionMode}
                        handleSelectedItems={handleSelectedItems} selectedItems={selectedItems} refresh={triggerRefresh} /> :
                        <ListView selectionMode={selectionMode} toggleSelectionMode={handleToggleSelectionMode}
                            handleSelectedItems={handleSelectedItems} selectedItems={selectedItems} refresh={triggerRefresh} />}
                    <View style={styles.bottomContainer}>
                        <Button
                            icon={<Ionicons name={selectionMode ? "trash-outline" : "ios-add"} size={24} color="#F5E9E2" />}
                            buttonStyle={styles.addButton}
                            onPress={() => { if (!selectionMode) { addNote(); } else { deleteSelected(); } }}
                        />
                    </View>
                </View>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        // alignItems: 'flex-start',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    addButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: theme.colors.primary,
        padding: 20,
        borderRadius: 10,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    },
});
