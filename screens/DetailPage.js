import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, View, Animated, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, Card, Button, Icon, ThemeProvider, createTheme } from '@rneui/themed';
import { Header, HeaderProps } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import CardContent from '../components/CardContent';
import CardDetail from '../components/CardDetail';

const theme = createTheme({
    colors: {
        background: '#39373B',   // Background color of the app
        primary: '#773344',      // Your primary color
        secondary: '#D44D5C',    // Your secondary color
    },
    Text: {
        style: {
            color: '##F5E9E2',      // Text color
            fontSize: 16,
        },
    },
    mode: 'dark',
});

export default function DetailPage() {
    const navBack = () => {
        navigation.goBack();
    };

    const navigation = useNavigation(true);

    const [showContent, setShowContent] = useState(true);
    const [content, setContent] = useState("");

    const switchView = () => {
        //TEST
        console.log('switch view');
        console.log(title);
        console.log(content);

        setSwitched(true);

        Animated.timing(rotationValue, {
            toValue,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setShowContent(!showContent);
            rotationValue.setValue(0);
        });
    };

    const handleContent = (value) => {
        setContent(value);
    };

    //handle keeping the content and the title when switching from one child view to the other
    const [title, setTitle] = useState('');
    const [switched, setSwitched] = useState(false);

    const handleTitle = (value) => {
        setTitle(value);
    };

    //card animation
    const rotationValue = new Animated.Value(0);

    const rotateInterpolation = rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    // const toValue = showContent ? 1 : 0;
    const toValue = 1;

    //handle message modal
    const [modalVisible, setModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleShowModal = (text) => {
        setSuccessMessage(text);
        setModalVisible(true);
    };

    const closeModal = () => {
        console.log("closing modal");
        setModalVisible(false);
        setSuccessMessage('');
    };

    return (
        <SafeAreaProvider>
            <ThemeProvider theme={theme}>
                <View style={styles.container}>
                    <Header
                        containerStyle={{ backgroundColor: theme.colors.primary }}
                        leftComponent={
                            <Ionicons name={"chevron-back"} size={24} color="white" onPress={navBack} />
                        }
                        rightComponent={
                            <Ionicons name={showContent ? "information-outline" : "repeat"} size={24} color="white" onPress={switchView} />
                        }
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
                    <Animated.View style={{ transform: [{ rotateY: rotateInterpolation }] }}>
                        {showContent ? <CardContent content={content} handleContent={handleContent}
                            switched={switched} title={title} handleTitle={handleTitle} savedSuccessfully={handleShowModal} />
                            : <CardDetail content={content} title={title} deletedSuccessfully={handleShowModal} />}
                    </Animated.View>
                </View>
            </ThemeProvider>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'flex-start',
        flexDirection: "column"
        // alignSelf: 'center',
        // justifyContent: 'center',
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