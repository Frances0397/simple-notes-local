import AsyncStorage from '@react-native-async-storage/async-storage';
import Note from './Notes';
import { getModifiedDate, getModifiedTime, getNewId } from './NotesHelper';

const NOTES_KEY = 'notes';

export const getAllNotes = async () => {
    console.log("you requested to retrieve all notes from local storage");

    try {
        const notes = await AsyncStorage.getItem(NOTES_KEY);
        return notes ? JSON.parse(notes) : [];
    } catch (error) {
        console.error("Error retrieving notes: " + error);
        return [];
    }
};

export const getNote = async (id) => {
    console.log("you requested to retrieve a specific note by id: " + id);

    try {
        const allNotes = await AsyncStorage.getItem(NOTES_KEY);
        const notes = allNotes ? JSON.parse(allNotes) : [];

        const noteFound = notes.find(note => note.id === id)
        return noteFound;
    } catch (error) {
        console.error("Error retrieving the note of index " + index);
    }
};

export const createNote = async (title, content) => {
    console.log("you requested to create a new note");

    try {
        //creo un nuovo oggetto vuoto
        let newNote = {};
        //leggo le note già esistenti per staccare un nuovo id
        const allNotes = await AsyncStorage.getItem(NOTES_KEY);
        const notes = allNotes ? JSON.parse(allNotes) : [];
        //chiamo il metodo per staccare il nuovo id
        //assegno il nuovo id all'oggetto
        newNote.id = getNewId(notes);
        //assegno alla nuova nota titolo e contenuto
        newNote.title = title;
        newNote.content = content;
        //assegno alla nuova nota i timestamp richiamando i relativi metodi
        newNote.date_created = getModifiedDate();
        newNote.time_created = getModifiedTime();
        newNote.date_modified = getModifiedDate();
        newNote.time_modified = getModifiedTime();
        //pusho la nuova nota nell'array di note
        notes.push(newNote);
        //salvo l'array di note modificato
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
        //restituisco un messaggio di successo
        return "SUCCESS";
    } catch (error) {
        console.error(error);
        return "ERROR";
    }
};

export const updateNote = async (id, title, content) => {
    try {
        //TEST
        console.log("test update");
        console.log(id);
        console.log(title);
        console.log(content);

        //leggo le note già esistenti
        const allNotes = await AsyncStorage.getItem(NOTES_KEY);
        const notes = JSON.parse(allNotes);
        //prendo la nota con indice richiesto e ne modifico titolo, contenuto e timestamp modifica
        let note = notes.find(noteById => noteById.id === id);
        note.title = title;
        note.content = content;
        note.date_modified = getModifiedDate();
        note.time_modified = getModifiedTime();
        //salvo la nuova struttura -- not sure se serva cancellare e ricreare o se basta così
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));

        return "SUCCESS";
    } catch (error) {
        console.error(error);
        return "ERROR";
    }
};

export const deleteNote = async (index) => {
    try {
        const existingNotes = await AsyncStorage.getItem(NOTES_KEY);
        const notes = JSON.parse(existingNotes);

        //prendo la nota con indice richiesto e lo rimuovo dall'array delle note
        notes.splice(index, 1);
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
        return "SUCCESS";
    } catch (error) {
        console.error(error);
        return "ERROR";
    }
};

export const deleteNotes = async (indexes) => {
    try {
        console.log("Delete all notes");
        const existingNotes = await AsyncStorage.getItem(NOTES_KEY);
        const notes = JSON.parse(existingNotes);

        for (let i = 0; i < notes.length; i++) {
            if (indexes.includes(notes[i].id)) {
                console.log("delete"); //testing purposes
                notes.splice(i, 1);
                i--;
            }
        }

        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
        return 'SUCCESS';
    } catch (error) {
        console.error(error);
        return "ERROR";
    }
};

