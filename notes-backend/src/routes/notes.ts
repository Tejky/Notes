import {Router} from 'express';
import {Note} from '../models/Note';

const router = Router();

// get all notes
router.get('/', async (req, res) => {
    try {
        const {email} = req.query;
        let notes;
        if (email) {
            notes = await Note.find({email});
        } else {
            notes = await Note.find();
        }
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ message: 'Error getting notes' });
    }
});

// add note
router.post('/', async (req, res) => {
    try {
        const { title, content, email } = req.body;
        if (!title) res.status(400).json({ message: 'Missing required fields' });

        const note = new Note({ title, content, email });
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ message: 'Error posting note' });
    }
});

// delete note
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Note.findByIdAndDelete(req.params.id);
        if (!deleted) res.status(404).json({ message: 'Note not found' });

        res.json({ message: 'Note deleted', note: deleted });
    } catch(err) {
        res.status(500).json({ message: 'Error deleting note' });
    }
    
});

// edit note
router.put('/:id', async (req, res) => {
    try {
        const updated = await Note.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!updated) res.status(404).json({message: 'Note not fou'});
        
        res.json(updated);
    } catch(err) {
        res.status(500).json({message: 'Error updating note'});
    }
});

export default router;