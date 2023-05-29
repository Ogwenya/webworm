import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ###############################################
// ########## GET MEDIA FROM CLOUDINARY ##########
// ###############################################
export const getMedia = async (req, res) => {
	try {
		const assets = await cloudinary.search
			.expression("folder:webworm")
			.execute();

		return res.status(200).json(assets);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

// ##################################################
// ########## DELETE MEDIA FROM CLOUDINARY ##########
// ##################################################
export const deleteMedia = async (req, res) => {
	try {
		const { id, resource_type } = req.query;
		const options = { resource_type: resource_type };
		const result = await cloudinary.api.delete_resources(
			[`webworm/${id}`],
			options
		);

		return res.status(200).json({ success: "Asset deleted successfully" });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};
