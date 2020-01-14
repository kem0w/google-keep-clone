import React from 'react';
import { NotesContainer } from '../../components/NoteForm/NoteFormElements';
import NoteForm from '../../components/NoteForm/NoteForm';
import NotesList from '../../components/NotesList/NotesList';

function Notes() {
  return (
    <NotesContainer>
      <NoteForm />
      <NotesList isPinnedList={true} />
      <NotesList isPinnedList={false} />
    </NotesContainer>
  );
}

export default Notes;
