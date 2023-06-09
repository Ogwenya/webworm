import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      required: [true, "API key is required"],
    },
    host: {
      type: String,
      unique: true,
      required: [true, "API key must be associated with a host"],
    },
  },
  {
    timestamps: true,
  }
);

const ApiKey = mongoose.models.ApiKey || mongoose.model("ApiKey", apiKeySchema);

export default ApiKey;
