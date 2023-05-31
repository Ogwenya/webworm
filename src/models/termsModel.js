const mongoose = require("mongoose");

const termsSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			default: "<p>Terms and conditions goes here...</p>",
		},
	},
	{ capped: { size: 860, max: 1 } }
);

const Term = mongoose.models.Term || mongoose.model("Term", termsSchema);

export default Term;
