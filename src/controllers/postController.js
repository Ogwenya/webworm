import formidable from "formidable";
import slugify from "slugify";
import Post from "@/models/postModel";
import { uploadImage } from "@/utils/cloudinary_ops";

// ###################################
// ########## GET All Posts ##########
// ###################################
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// #####################################
// ########## CREATE NEW POST ##########
// #####################################
export const createPost = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    await form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred" });
      } else {
        const { title, body, excerpt, key_words } = fields;
        const { feature_image } = files;

        const uploaded_image = await uploadImage(
          feature_image.filepath,
          "webworm/posts/feature_images"
        );

        const post = await Post.create({
          title: title,
          slug: slugify(title, { lower: true, locale: "en" }),
          excerpt: excerpt,
          feature_image: {
            url: uploaded_image.secure_url,
            public_id: uploaded_image.public_id,
          },
          body: body,
          key_words: key_words.split(","),
        });

        return res.status(201).json({
          success: "post created successfully",
          slug: post.slug,
        });
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// #####################################
// ########## GET SINGLE Post ##########
// #####################################
export const getPost = async (req, res) => {
  try {
    const { slug } = req.query;
    const post = await Post.findOne({ slug });
    return res.status(200).json({ post });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
