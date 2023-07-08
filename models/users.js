import mongoose from "mongoose";

const Schema = mongoose.Schema;

// defines the structure of documents.
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});


export const User = mongoose.model('User', userSchema);
User.createIndexes();

export default User;
