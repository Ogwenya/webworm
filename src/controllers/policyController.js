import Policy from "@/models/policyModel";

// ########################################
// ########## GET PRIVACY POLICY ##########
// ########################################
export const getPolicy = async (req, res) => {
	let policy = await Policy.find();

	if (policy.length === 0) {
		policy = await Policy.create({});
	}

	return res.status(200).json(policy[0]);
};

// ###########################################
// ########## UPDATE PRIVACY POLICY ##########
// ###########################################
export const updatePolicy = async (req, res) => {
	const content = await JSON.parse(req.body);
	const policy = await Policy.create({ content });
	return res.status(200).json({ success: "Saved." });
};
