import { getServerSession } from "next-auth/next";
import authOptions from "../auth/[...nextauth]";
import { connectDB } from "@/utils/db";
import { getTerms, updateTerms } from "@/controllers/termsController";

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(400).json({ error: "unauthorized" });
  }

  switch (method) {
    case "GET":
      getTerms(req, res);
      break;
    case "PATCH":
      updateTerms(req, res);
      break;

    default:
      res.setHeader("Allow", ["GET", "PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
