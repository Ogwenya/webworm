import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			unique: true,
			required: [true, "post must have a title"],
		},
		slug: {
			type: String,
			unique: true,
			required: [true, "post must have a slug"],
		},
		excerpt: {
			type: String,
			required: [true, "post must have an excerpt"],
		},
		feature_image: {
			url: String,
			public_id: String,
		},

		body: {
			type: String,
			required: [true, "post must have a body"],
		},

		key_words: {
			type: [String],
		},

		isPublished: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
