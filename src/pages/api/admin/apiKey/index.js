import { getServerSession } from "next-auth/next";
import authOptions from "../../auth/[...nextauth]";
import { connectDB } from "@/utils/db";
import { getApiKeys, createApiKey } from "@/controllers/apiKeyController";

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(400).json({ error: "unauthorized" });
  }

  switch (method) {
    case "GET":
      getApiKeys(req, res);
      break;
    case "POST":
      createApiKey(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
