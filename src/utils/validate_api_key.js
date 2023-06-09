import bcrypt from "bcryptjs";
import ApiKey from "@/models/apiKeyModel";

export const validate_api_key = async (auth_token) => {
  // initialized variable to hold truthy value for authentication
  let keyExists;

  // get all hashed api keys from db
  const apiKeys = await ApiKey.find();

  // loop through the api keys and compare them to the auth token provided until a match is found
  for (var i = 0; i < apiKeys.length; i++) {
    const key = apiKeys[i].key;

    keyExists = await bcrypt.compare(auth_token, key);
    // break out of the loop once match is found
    if (keyExists == true) {
      break;
    }
  }
  return keyExists;
};
