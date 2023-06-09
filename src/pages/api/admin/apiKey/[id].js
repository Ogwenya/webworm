import { getServerSession } from "next-auth/next";
import authOptions from "../../auth/[...nextauth]";
import { connectDB } from "@/utils/db";
import { deleteApiKey } from "@/controllers/apiKeyController";

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(400).json({ error: "unauthorized" });
  }

  switch (method) {
    case "DELETE":
      deleteApiKey(req, res);
      break;

    default:
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
