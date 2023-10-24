let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
let clearBtn;
let activeNote = {};

if (window.location.pathname === '/notes.html') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.note-list');
  clearBtn = document.querySelector('.clear-btn');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote)
    .then(() => {
      getAndRenderNotes();
      renderActiveNote();
    })
    .catch((error) => {
      console.error('Error saving note:', error);
    });
};

// saved notes are added to left side of application 
saveNoteBtn.addEventListener('click', () => {
  const saveNewNote = { 
    title: noteTitle.value,
    text: noteText.value,
  };

  saveNote(saveNewNote) // Use saveNote function
    .then((savedNote) => {
      displaySavedNote(savedNote);

      // Clearing input fields 
      noteTitle.value = '';
      noteText.value = '';
    })
    .catch((error) => {
      console.error('Error saving note', error);
    });
});

// Function for adding saved note to left side of application 
function displaySavedNote(note) {
  const noteList = document.getElementById('note-list');
  const liElement = document.createElement('li');
  liElement.classList.add('list-group-item');
  liElement.innerHTML = `<strong>${note.title}</strong><br>${note.text}`;
  noteList.appendChild(liElement);
}

// Function for note save
// ...

// Function for note save
async function saveNewNote() {
  const noteTitleValue = noteTitle.value;
  const noteTextValue = noteText.value;

  if (!noteTitleValue || !noteTextValue) {
    return;
  }
  const newNote = {
    title: noteTitleValue,
    text: noteTextValue,
  };
  
  try {
    const response = await fetch('api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNote),
    });
  
    const savedNote = await response.json();
    displaySavedNote(savedNote);

    // Clear input fields
    noteTitle.value = '';  // Make sure you use semicolon here
    noteText.value = '';
  } catch (error) {
    console.error('Error saving note', error);
  }
}

// ...


// Attaching the saveNewNote function to save button 
saveNoteBtn.addEventListener('click', saveNewNote);


// Loads notes on page load
async function getAndRenderNotes() {
  try {
    const response = await fetch('/api/notes');
    const notes = await response.json();
    noteList.innerHTML = ''; // Clear the list

    if (notes.length === 0) {
      noteList.innerHTML = '<li class="list-group-item">No saved notes</li>';
    } else {
      notes.forEach((note) => {
        displaySavedNote(note);
      });
    }
  } catch (error) {
    console.error('Error rendering notes:', error);
  }
}

window.onload = getAndRenderNotes;


// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId)
    .then(() => {
      getAndRenderNotes();
      renderActiveNote();
    })
    .catch((error) => {
      console.error('Error deleting note:', error);
    });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to an empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  try {
    let jsonNotes = await notes.json();

    let noteListItems = [];

    if (jsonNotes.length === 0) {
      noteListItems.push(createLi('No saved Notes', false));
    }

    jsonNotes.forEach((note) => {
      const li = createLi(note.title);
      li.dataset.note = JSON.stringify(note);
      noteListItems.push(li);
    });

    if (window.location.pathname === '/notes') {
      noteList[0].innerHTML = '';
      noteListItems.forEach((note) => noteList[0].append(note));
    }
  } catch (error) {
    console.error('Error rendering notes:', error);
  }
};


// Returns HTML element with or without a delete button
const createLi = (text, delBtn = true) => {
  const liEl = document.createElement('li');
  liEl.classList.add('list-group-item');

  const spanEl = document.createElement('span');
  spanEl.classList.add('list-item-title');
  spanEl.innerText = text;
  spanEl.addEventListener('click', handleNoteView);

  liEl.append(spanEl);

  if (delBtn) {
    const delBtnEl = document.createElement('i');
    delBtnEl.classList.add(
      'fas',
      'fa-trash-alt',
      'float-right',
      'text-danger',
      'delete-note'
    );
    delBtnEl.addEventListener('click', handleNoteDelete);

    liEl.append(delBtnEl);
  }

  return liEl;
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes.html') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
  clearBtn.addEventListener('click', renderActiveNote);
}

getAndRenderNotes();
