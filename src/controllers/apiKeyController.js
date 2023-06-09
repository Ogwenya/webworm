import bcrypt, { compare } from "bcryptjs";
import ApiKey from "@/models/apiKeyModel";

// validate url string
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

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
    const { host } = await JSON.parse(req.body);
    const validadedUrl = await isValidUrl(host);

    // check if provided host is valid
    if (!validadedUrl) {
      return res.status(400).json({ error: "The URL provided is invalid" });
    }

    // check if provided host already exist
    const hostExists = await ApiKey.findOne({ host });

    if (hostExists) {
      return res
        .status(400)
        .json({ error: "Host already associated with existing api key" });
    }

    // generate API Key and hash it
    const generatedKey = [...Array(30)]
      .map((e) => ((Math.random() * 36) | 0).toString(36))
      .join("");

    const salt = await bcrypt.genSalt(10);
    const encryptedKey = await bcrypt.hash(generatedKey, salt);

    // save api key to db
    const apiKey = await ApiKey.create({
      host,
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
