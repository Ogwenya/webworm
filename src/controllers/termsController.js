import Term from "@/models/termsModel";

// ########################################
// ########## GET PRIVACY POLICY ##########
// ########################################
export const getTerms = async (req, res) => {
	let terms = await Term.find();

	if (terms.length === 0) {
		terms = await Term.create({});
	}

	return res.status(200).json(terms[0]);
};

// ###########################################
// ########## UPDATE PRIVACY POLICY ##########
// ###########################################
export const updateTerms = async (req, res) => {
	const content = await JSON.parse(req.body);
	const terms = await Term.create({ content });
	return res.status(200).json({ success: "Saved." });
};
