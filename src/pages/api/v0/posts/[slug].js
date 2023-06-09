import { connectDB } from "@/utils/db";
import { getPost } from "@/controllers/client/clientController";
import { validate_api_key } from "@/utils/validate_api_key";

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;
  const auth_token = req.headers["x-api-key"];

  // return error message if api key is not provided
  if (!auth_token) {
    return res.status(401).send({ error: "No auth token provided" });
  }

  const isKeyValid = await validate_api_key(auth_token);

  // return error message if api key is invalid
  if (!isKeyValid) {
    return res.status(401).send({ error: "Invalid auth token" });
  }

  switch (method) {
    case "GET":
      getPost(req, res);
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
