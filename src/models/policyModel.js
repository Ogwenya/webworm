import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
	{
		content: {
			type: String,
			default: "<p>Privacy policy goes here...</p>",
		},
	},
	{ capped: { size: 860, max: 1 } }
);

const Policy = mongoose.models.Policy || mongoose.model("Policy", policySchema);

export default Policy;
