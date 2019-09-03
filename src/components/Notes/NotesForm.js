import React, { useState, useEffect } from "react";
import {
  FormContainer,
  FormGroup,
  TitleField,
  NoteField,
  IconButton
} from "./notes-elements";
import FormNoteList from "../FormNoteList/FormNoteList";
import TagList from "../TagList/TagList";
import NotesFormMenu from "../NotesFormFooter/NotesFormFooter";
import TextareaAutosize from "react-autosize-textarea";
import { connect } from "react-redux";
import { addNote } from "../../redux/notes";
import {
  getListBasedOnLineTextBreak,
  getSingleNoteBasedOnList,
  checkIfTargetIsForm
} from "../../utils";

function NotesForm({ addNote }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [checkList, setCheckList] = useState({});
  const [isPinned, setIsPinned] = useState(false);
  const [tags, setTags] = useState([]);
  const [bgColor, setBgColor] = useState("transparent");
  const [isInputOpen, setInputOpen] = useState(false);
  const [noteEditorMode, setNoteEditorMode] = useState(false);

  const toggleNoteEditorMode = () => {
    let newNote = "";
    let newNoteCheckList = {};

    if (noteEditorMode) {
      newNote = getSingleNoteBasedOnList(checkList);
    } else {
      newNoteCheckList = getListBasedOnLineTextBreak(note);
    }
    setNote(newNote);
    setCheckList(newNoteCheckList);
    setNoteEditorMode(!noteEditorMode);
  };

  const resetForm = () => {
    setTitle("");
    setNote("");
    setTags([]);
    setCheckList({});
    setIsPinned(false);
    setBgColor("transparent");
    setNoteEditorMode(false);
    setInputOpen(false);
  };

  const validateFields = () => {
    return (note + title).trim() !== "" || Object.values(checkList).length > 0;
  };

  const handleBodyClick = e => {
    const targetIsForm = checkIfTargetIsForm(e.target);
    if (targetIsForm) {
      return;
    } else if (!targetIsForm && validateFields()) {
      const newNote = {
        title,
        note,
        checkList,
        isPinned,
        tags,
        bgColor,
        column: 1,
        row: 1
      };
      addNote(newNote);
    }
    setInputOpen(false);
    resetForm();
  };

  const deleteListItem = e => {
    const newCheckListItems = { ...checkList };
    delete newCheckListItems[e.target.name];
    setCheckList(newCheckListItems);
  };

  useEffect(() => {
    document.body.addEventListener("mousedown", handleBodyClick);
    console.log(tags);
    return () => {
      document.body.removeEventListener("mousedown", handleBodyClick);
    };
  }, [tags]);

  return (
    <FormContainer bgColor={bgColor} className="note-form">
      {isInputOpen && (
        <FormGroup>
          <TitleField
            name="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Tytuł"
          />
          <IconButton
            className={isPinned ? "icon-pin" : "icon-pin-outline"}
            onClick={() => setIsPinned(!isPinned)}
          />
        </FormGroup>
      )}
      <FormGroup>
        {noteEditorMode ? (
          <FormNoteList
            checkList={checkList}
            setCheckList={setCheckList}
            deleteListItem={deleteListItem}
          />
        ) : (
          <TextareaAutosize
            style={{ ...NoteField, resize: "none" }}
            name="note"
            value={note}
            onChange={e => setNote(e.target.value)}
            onClick={() => setInputOpen(true)}
            placeholder="Utwórz notatkę..."
          />
        )}
        {!isInputOpen && (
          <IconButton
            className="far fa-check-square fa-lg"
            onClick={() => {
              setNoteEditorMode(true);
              setInputOpen(true);
            }}
          />
        )}
      </FormGroup>
      <TagList tags={tags} setTags={setTags} />

      {isInputOpen && (
        <NotesFormMenu
          chosenTags={tags}
          setTags={setTags}
          bgColor={bgColor}
          setBgColor={setBgColor}
          handleCloseClick={resetForm}
          noteEditorMode={noteEditorMode}
          handleToggleClick={toggleNoteEditorMode}
        />
      )}
    </FormContainer>
  );
}

const mapDispatchToProps = {
  addNote
};

export default connect(
  null,
  mapDispatchToProps
)(NotesForm);
