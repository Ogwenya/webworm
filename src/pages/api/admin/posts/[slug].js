import { getServerSession } from "next-auth/next";
import authOptions from "../../auth/[...nextauth]";
import { connectDB } from "@/utils/db";
import { getPost, updatePost, deletePost } from "@/controllers/postController";

export const config = {
  api: {
    bodyParser: false, // Disable built-in bodyParser
  },
};

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(400).json({ error: "unauthorized" });
  }

  switch (method) {
    case "GET":
      getPost(req, res);
      break;
    case "PATCH":
      updatePost(req, res);
      break;
    case "DELETE":
      deletePost(req, res);
      break;

    default:
      res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
