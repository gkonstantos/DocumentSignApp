import mongoose from "mongoose";

const Schema = mongoose.Schema;

const filesSchema = new Schema(
	{
		filename: {
			type: String,
			required: true,
		},
		contentType: {
			type: String,
			// required: true
		},
		size: {
			type: Number,
			required: true,
		},
		metadata: {
			type: Object,
		},
		owner: {
			type: String,
			required: true,
		},
		path: {
			type: String,
			required: true,
		},
		signed: {
			type: Boolean,
			required: true,
		},
	},
	{ timestamps: true }
);

export const File = mongoose.model("File", filesSchema);
File.createIndexes();

export default File;
