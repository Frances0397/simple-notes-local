export const getModifiedDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${day}/${month}/${year}`;

    console.log(formattedDate); // Example output: "2023-07-24"
    return (formattedDate);
};

export const getModifiedTime = () => {
    const currentDate = new Date();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
};

export const getNewId = (notes) => {
    console.log(notes); //testing purposes
    //build array of ids
    var aIds = getAllIds(notes);;
    console.log("Id trovatii: ", aIds);
    //find first free id
    var newId = getFreeId(aIds);

    return newId;
};

const getAllIds = (notes) => {
    if (notes != null) {
        let aIds = []
        for (let i = 0; i < notes.length; i++) {
            let id = notes[i].id;
            aIds.push(parseInt(id));
        }
        aIds.sort((a, b) => a - b);
        return aIds;
    } else {
        return [];
    }
};

const getFreeId = (aIds) => {
    let freeId = 1;
    if (aIds.length > 0) {
        for (let i = 0; i < aIds.length; i++) {
            console.log(freeId); //testing purposes
            console.log(aIds[i]);
            console.log(freeId === aIds[i]); //testing purposes
            if (freeId === aIds[i]) {
                freeId = freeId + 1;
                console.log("old id " + aIds[i]); //test
                console.log("new id: " + freeId); //test
            } else {
                console.log("here"); //test
                break;
            }
        }
    }

    freeId = freeId.toString();
    return freeId;
};

