import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "API key must be associated with a host"],
    },
    key: {
      type: String,
      unique: true,
      required: [true, "API key is required"],
    },
  },
  {
    timestamps: true,
  }
);

const ApiKey = mongoose.models.ApiKey || mongoose.model("ApiKey", apiKeySchema);

export default ApiKey;
