import { getServerSession } from "next-auth/next";
import authOptions from "../../auth/[...nextauth]";
import { connectDB } from "@/utils/db";
import { getPosts, createPost } from "@/controllers/postController";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

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
      getPosts(req, res);
      break;
    case "POST":
      createPost(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}

// export const config = {
//   api: {
//     bodyParser: false, // Disallow body parsing, consume as stream
//   },
// };
