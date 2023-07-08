import mongoose from "mongoose";

const Schema = mongoose.Schema;

const filesSchema = new Schema({
    filename: {
        type: String,
        required: true,

    },
    contentType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    metadata: {
        type: Object,
    },
    owner: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        // ref: 'User',
        required: true
    },
    path: {
        type: String,
        required: true
    }
}, {timestamps: true});


export const File = mongoose.model('File', filesSchema);
File.createIndexes();
// filesSchema.index({ filename: 1, owner: 1 }, { unique: true });

export default File;
