import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import './BoardPage.css'

interface Note {
    _id: string;
    title: string;
    content: string;
    email: string;
}

const BoardPage = () => {
    const navigate = useNavigate()
    const email = localStorage.getItem('email');
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [deleteNoteEmail, setDeleteNoteEmail] = useState('');
    const [editNoteId, setEditNoteId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editNoteEmail, setEditNoteEmail] = useState('');
    const [filterEmail, setFilterEmail] = useState('');
    const [inputEmail, setInputEmail] = useState('');

    useEffect(() => {
        const email = localStorage.getItem('email')
        if (!email) {
          navigate('/login')
        }
      }, [navigate])

    const fetchNotes = async () => {
        try {
            const res = await api.get<Note[]>(`/notes?email=${filterEmail}`);
            setNotes(res.data);
        } catch(err) {
            alert("Notes could not be loaded");
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [filterEmail]);
    

    const handleAddNote = async () => {
        if (!title) {
            alert("Missing title");
            return;
        }
        try {
            await api.post<Note>('/notes', {
                title,
                content, 
                email
            });
            fetchNotes();
            setTitle('');
            setContent('');
        } catch (err) {
            alert('Adding note failed');
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (deleteNoteEmail !== email) {
            alert("Cannot delete this note, you are not the owner");
            return;
        }
        try {
            await api.delete(`/notes/${id}`);
            fetchNotes();
        } catch (err) {
            alert('Failed deleting note');
        }
    };

    const startEditing = (note: Note) => {
        setEditNoteId(note._id);
        setEditTitle(note.title);
        setEditContent(note.content);
        setEditNoteEmail(note.email);
    }

    const handleEditNote = async () => {
        if (!editNoteId || !editTitle || !editContent) {
            alert("Editing note failed");
            return;
        }

        if (editNoteEmail !== email) {
            alert("Cannot edit this note, you are not the owner")
        }
        
        try {
            await api.put(`notes/${editNoteId}`, {
                title: editTitle,
                content: editContent
            })
            fetchNotes();
            setEditNoteId(null);
            setEditTitle('');
            setEditContent('');
        } catch (err) {
            alert("Failed editing note");
        }
    };

    const handleFilter = () => {
        setFilterEmail(inputEmail.trim());
    };

    const handleClearFilter = () => {
        setInputEmail('');
        setFilterEmail('');
    };


    const handleLogout = () => {
        localStorage.removeItem('email')
        window.location.href = '/login'
    }

    return (
        <div className="board-container">
            <h2>Note Board</h2>
            <div className="user">
                <p>Logged in as: {email}</p>
                <button onClick={handleLogout}>Log out</button>
            </div>
            
            <div className="add-note"> 
                <h2>Add note</h2>
                <input 
                    type="search"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea 
                    placeholder="Note text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button onClick={handleAddNote}>Add note</button>
            </div>
            
                    
            <h1>Notes</h1>

            <div className="filter">
                <input 
                    type="search"
                    placeholder="Filter by email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                />
                <button onClick={handleFilter}>Filter</button>
                <button onClick={handleClearFilter}>Clear filter</button>
            </div>
            
            {notes.length === 0 ?
             (<p>Notes are empty</p>) :
             (<ul className="notes-list">
                {notes.map((note) => (
                    <li key={note._id}>
                        {
                            editNoteId === note._id ? (
                                <div>
                                    <input 
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                    <textarea 
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                    />
                                    <button onClick={handleEditNote}>Save</button>
                                    <button onClick={() => setEditNoteId(null)}>Cancel</button>
                                </div>
                            ) :
                            ( 
                                <div>
                                    <strong>{note.title}</strong>
                                    <br />
                                    <small>User: {note.email}</small>
                                    <p>{note.content}</p>
                                    {
                                        email === note.email && (
                                            <div className="note-buttons">
                                                <button onClick={() => 
                                                    startEditing(note)
                                                    }>
                                                    Edit
                                                </button>
                                                <button onClick={() => {
                                                        setDeleteNoteEmail(note.email);
                                                        handleDeleteNote(note._id);
                                                    }}>
                                                    Delete
                                                </button>
                                            </div>
                                        ) 
                                    }
                                    
                                </div>
                            )
                        }
                        
                    </li>
                ))}
             </ul>)}
        </div>
    )
}

export default BoardPage