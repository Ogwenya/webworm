import formidable from "formidable";
import slugify from "slugify";
import Post from "@/models/postModel";
import { uploadImage, deleteImage } from "@/utils/cloudinary_ops";

// ###################################
// ########## GET All Posts ##########
// ###################################
export const getPosts = async (req, res) => {
  try {
    let query = {};
    const page = parseInt(req.query.page, 10);
    const per_page = 10;
    const { search, filter } = req.query;

    if (filter === "published") {
      query.isPublished = true;
    } else if (filter === "unpublished") {
      query.isPublished = false;
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const startIndex = (page - 1) * per_page;
    const total_posts = await Post.find(query).count();
    const posts = await Post.find(query)
      .skip(startIndex)
      .limit(per_page)
      .sort({ updatedAt: -1 });

    const totalPages = Math.ceil(total_posts / per_page);
    return res
      .status(200)
      .json({ posts, total_posts, totalPages, startIndex, per_page });
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

// #################################
// ########## UPDATE POST ##########
// #################################
export const updatePost = async (req, res) => {
  try {
    const { slug, update } = req.query;
    const post = await Post.findOne({ slug });

    if (post === null) {
      return res.status(400).json({
        error: "This post does not exist.",
      });
    }

    // publish or unpublish article
    if (update === "publish") {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "An error occurred" });
        } else {
          const { isPublished } = fields;

          post.isPublished = isPublished;
          await post.save();

          return res.status(200).json({ success: "update successfull." });
        }
      });
    }

    // update article content
    if (update === "content") {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "An error occurred" });
        } else {
          const { title, body, excerpt, key_words } = fields;
          const { feature_image } = files;

          let update;

          if (feature_image) {
            // if feature image is provided, upload it
            const uploaded_image = await uploadImage(
              feature_image.filepath,
              "webworm/posts/feature_images"
            );

            update = {
              title: title,
              slug: slugify(title, { lower: true, locale: "en" }),
              excerpt: excerpt,
              feature_image: {
                url: uploaded_image.secure_url,
                public_id: uploaded_image.public_id,
              },
              body: body,
              key_words: key_words.split(","),
            };

            // delete previous feature image
            const deletedImage = await deleteImage(
              post.feature_image.public_id
            );
          } else {
            update = {
              title: title,
              slug: slugify(title, { lower: true, locale: "en" }),
              excerpt: excerpt,
              body: body,
              key_words: key_words.split(","),
            };
          }

          const updated_post = await Post.findByIdAndUpdate(post.id, update, {
            new: true,
            runValidators: true,
          });

          return res.status(200).json({
            success: "post edited successfully.",
            slug: updated_post.slug,
          });
        }
      });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// #################################
// ########## DELETE POST ##########
// #################################
export const deletePost = async (req, res) => {
  try {
    const { slug } = req.query;
    const post = await Post.findOne({ slug });

    // delete post and feature image
    const deleted_post = await Post.findByIdAndDelete(post._id);
    const deletedImage = await deleteImage(post.feature_image.public_id);

    return res.status(200).json({ success: "Article deleted" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
