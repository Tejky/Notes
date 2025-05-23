import {Schema, model} from 'mongoose';

const NoteSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String},
    email: {type: String, required: true},
}, {timestamps: true});

export const Note = model('Note', NoteSchema);