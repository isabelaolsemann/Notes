// Elements 
const createNoteInput = document.querySelector("#create-note");
const notesContainer = document.querySelector("#notes-container");
const searchInput = document.querySelector("#search-input");

// Buttons 
const buttonCreateNote = document.querySelector("#btn-create-note");
const buttonExport = document.querySelector("#btn-export");

// Functions 

function showNotesLS() {
    cleanNotes();
    getNotes().forEach((note) => {
        const noteElement = createNote(note.id, note.content, note.fixed);
    
        notesContainer.appendChild(noteElement);
    });
}

function addNoteObject() {
    // Save notes Local Storage
    const notes = getNotes();

    const noteObjetct = {
        id: generateId(),
        content: createNoteInput.value,
        fixed: false,
    }

    const noteElement = createNote(noteObjetct.id, noteObjetct.content);

    notesContainer.appendChild(noteElement);

    // save 
    notes.push(noteObjetct);
    saveNotes(notes);

    // Clean Input 
    createNoteInput.value = "";
}

// avoit repit 
function generateId() {
    return Math.floor(Math.random() * 5000);
}

function createNote(id, content, fixed) {

    // Template 
    const element = document.createElement("div");
    element.classList.add("note");

    const textArea = document.createElement("textarea");
    textArea.placeholder = "Add your note";
    textArea.value = content;
    element.appendChild(textArea);

    const iconPin = document.createElement("i");
    iconPin.classList.add(...["bi", "bi-pin"]);
    element.appendChild(iconPin);

    if(fixed) {
        element.classList.add("fixed");
    }

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add(...["bi", "bi-x-lg"]);
    element.appendChild(deleteIcon);

    const duplicateIcon = document.createElement("i");
    duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"]);
    element.appendChild(duplicateIcon);

    // Events icons
    element.querySelector("textarea").addEventListener("keyup", (e) => {

        const noteContent = e.target.value;

        updateNote(id, noteContent);
        
    })

    element.querySelector(".bi-pin").addEventListener("click", () => {
        toggleFixNote(id);
    });

    element.querySelector(".bi-x-lg").addEventListener("click", () => {
        deleteNote(id, element);
    });

    element.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
        copyNote(id);
    });
    

    return element;
}

function deleteNote(id, element) {
    // remove notes with !== id
    const notes = getNotes().filter((note) => note.id !== id);

    // save
    saveNotes(notes); 

    // remove dom 
    notesContainer.removeChild(element);
}

function copyNote(id) {
    const notes = getNotes();
    const targetNote = notes.filter((note) => note.id === id)[0];
    
    const noteObject = {
        id: generateId(),
        content: targetNote.content,
        fixed: false,
    };

    const noteElement = createNote(
        noteObject.id, 
        noteObject.content, 
        noteObject.fixed
    );
    
    notesContainer.appendChild(noteElement);

    notes.push(noteObject);

    saveNotes(notes);
}

function toggleFixNote(id) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    targetNote.fixed = !targetNote.fixed;

    saveNotes(notes);
    showNotesLS();
}

function updateNote(id, newContent) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    targetNote.content = newContent;

    // save LS
    saveNotes(notes);
}

// Local Storage 
function getNotes() {
    // Ao iniciar, ele pega as notas ou um array vazio se estiver inicializando;
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");

    const orderedNotes = notes.sort((a, b) => a.fixed > b.fixed ? -1 : 1);

    return orderedNotes;
}


function saveNotes(notes) {
    // Add in Local Storage - Must sent as a JSON because it's a obj array
    localStorage.setItem("notes", JSON.stringify(notes));
}


// Fix pin 
function cleanNotes() {
    notesContainer.replaceChildren([]);
}

function searchNotes(search) {

    const searchResults = getNotes().filter((note) => {
        return note.content.includes(search);
    });

    // show notes again - new search 
    if(search !== "") {
        cleanNotes();

        searchResults.forEach((note) => {
            const noteElement = createNote(note.id, note.content);
            notesContainer.appendChild(noteElement);
        });

        return;
    };

    cleanNotes();
    showNotesLS();
};

// Export CSV 
function exportData() {

    const notes = JSON.parse(localStorage.getItem("notes") || "[]");

    // separa o dado por virgula e quegra a linha pela barra \n
    const csvString = [
        ["ID", "Content", "Fixed"],
        ...notes.map((note) => [note.id, note.content, note.fixed]),
    ].map((e) => e.join(","))
    // add coma
    .join("\n");
    // console.log(csvString);

    // Dowload
    const element = document.createElement("a");
    element.href = "data:text/csv;charset=utf-8" + encodeURI(csvString);

    element.target = "_blank"

    element.download = "notes.csv";

    element.click();
}




// Events
buttonCreateNote.addEventListener("click", (e) => addNoteObject());

searchInput.addEventListener("keyup", (e) => {

    const searchInputValue = e.target.value;
    searchNotes(searchInputValue);

});

createNoteInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter") {
        addNoteObject();
    }
})

buttonExport.addEventListener("click", () => {
    exportData();
})

// Initialization 
showNotesLS();