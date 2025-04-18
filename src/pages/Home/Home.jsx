import "./Home.css";
import { useEffect, useState } from "react";
import { db, auth } from "../../firebase/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc, 
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth"; 
import { Link } from "react-router-dom"; 

const Home = () => {
  const [user, setUser] = useState(null);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null); 
  const [editText, setEditText] = useState(""); 

  const notesCollectionRef = collection(db, "notes");

  //  Check User Login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Notes Load
  useEffect(() => {
    if (user) {
      const q = query(notesCollectionRef, where("uid", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesList);
      });

      return () => unsubscribe();
    } else {
      setNotes([]); 
    }
  }, [user]);

  //  Add Note
  const handleAddNote = async () => {
    if (note.trim() !== "") {
      await addDoc(notesCollectionRef, {
        text: note,
        uid: user.uid,
      });
      setNote("");
    }
  };

  //  Delete Note
  const handleDeleteNote = async (id) => {
    const noteDoc = doc(db, "notes", id);
    await deleteDoc(noteDoc);
  };

  // Start Editing Note
  const handleEditNote = (id, currentText) => {
    setEditingNoteId(id);
    setEditText(currentText);
  };

  // Save Edited Note
  const handleSaveEdit = async (id) => {
    const noteDoc = doc(db, "notes", id);
    await updateDoc(noteDoc, { text: editText });
    setEditingNoteId(null);
    setEditText("");
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditText("");
  };

  // 🚪 Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      
    } catch (error) {
      console.error("Logout failed:", error.message);
      alert("Logout failed.");
    }
  };

  return (
    <div className="home-container">
      <h1>Your Notes</h1>
      {user ? (
        <div className="actions">
          <div className="add-note">
            <input
              type="text"
              placeholder="Take a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button onClick={handleAddNote}>Add Note</button>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="guest-view">
          <h2>Welcome to Note App!</h2>
          <p>Organize your thoughts and ideas effortlessly.</p>
          <div className="auth-buttons">
            <Link to="/login" className="login-button">
              Login
            </Link>
            <Link to="/register" className="register-button">
              Register
            </Link>
          </div>
        </div>
      )}

      <div className="notes-list">
        {notes.map((n) => (
          <div className="note" key={n.id}>
            {editingNoteId === n.id ? (
              <div className="edit-note-section">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className="edit-actions">
                  <button onClick={() => handleSaveEdit(n.id)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="note-content">
                <p>{n.text}</p>
                <div className="note-actions">
                  <button onClick={() => handleEditNote(n.id, n.text)}>Edit</button>
                  <button onClick={() => handleDeleteNote(n.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <footer>
        <p>&copy; {new Date().getFullYear()} Note App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;