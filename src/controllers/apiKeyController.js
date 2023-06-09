import bcrypt from "bcryptjs";
import ApiKey from "@/models/apiKeyModel";

// ##################################
// ########## GET API KEYS ##########
// ##################################
export const getApiKeys = async (req, res) => {
  try {
    const keys = await ApiKey.find().select("-key").sort({ updatedAt: -1 });
    res.status(200).json(keys);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// #####################################
// ########## CREATE API KEYS ##########
// #####################################
export const createApiKey = async (req, res) => {
  try {
    const { name } = await JSON.parse(req.body);

    // check if provided name already exist
    const nameExists = await ApiKey.findOne({ name });

    if (nameExists) {
      return res
        .status(400)
        .json({ error: "Name already associated with existing api key" });
    }

    // generate API Key and hash it
    const generatedKey = [...Array(30)]
      .map((e) => ((Math.random() * 36) | 0).toString(36))
      .join("");

    const salt = await bcrypt.genSalt(10);
    const encryptedKey = await bcrypt.hash(generatedKey, salt);

    // save api key to db
    const apiKey = await ApiKey.create({
      name,
      key: encryptedKey,
    });

    return res
      .status(200)
      .json({ sucess: "API Key generated successfully", apiKey: generatedKey });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ####################################
// ########## DELETE API KEY ##########
// ####################################
export const deleteApiKey = async (req, res) => {
  try {
    const { id } = req.query;
    const deleted_key = await ApiKey.findByIdAndDelete(id);
    return res.status(200).json({ success: "API Key deleted" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
