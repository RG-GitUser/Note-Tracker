let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}
// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};
// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};
// activeNote is used to keep track of the note in the textarea
let activeNote = {};
// Declares activeNote but leaves it as a empty object. This is so that we can
// add things such as title and text. Can I add ID here? verdict: no.
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
  // When this is used. It sends http://localhost:3001/api/notes/undefined in my console. undefined must be id.
const renderActiveNote = () => {
  hide(saveNoteBtn);
  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    // noteId.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
    // noteId.value = activeNote.id;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    // noteId.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
    // noteId.value = '';
  }
};
// Added noteId to above function. Above would be function to show active note. How is this called?
const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
    // id: noteId.value
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};
// Above is the function that actually creates the new note. Keep this in mind when tracking your code.
// Learning note: I need to add more notes and do a better job of breaking down code before I start touching it.
// I am good at doing it but I am being lazy and not doing it. Be better and add notes to stuff future me.
// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();
  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;
  if (activeNote.id === noteId) {
    activeNote = {};
  }
  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};
// This renders the notes after one has been deleted? Yes.
// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
  // console.log('GET NOTES HERE')
};
// Sets the activeNote to and empty object and allows the user to enter a new note
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
// Above hides buttons if they are not relevant based on user input.
// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }
  let noteListItems = [];
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
  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }
  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);
    noteListItems.push(li);
  });
  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};
// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);
if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}
getAndRenderNotes();