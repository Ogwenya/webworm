import { getServerSession } from "next-auth/next";
import authOptions from "../auth/[...nextauth]";
import { connectDB } from "@/utils/db";
import { updateProfile } from "@/controllers/userController";

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(400).json({ error: "unauthorized" });
  }

  switch (method) {
    case "PATCH":
      updateProfile(req, res);
      break;

    default:
      res.setHeader("Allow", ["PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
