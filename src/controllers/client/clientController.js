/* 
        this file contains all the query calls that will be made from the blogging client
 */

import Policy from "@/models/policyModel";
import Term from "@/models/termsModel";
import Post from "@/models/postModel";

// ########################################
// ########## GET PRIVACY POLICY ##########
// ########################################
export const getPolicy = async (req, res) => {
  let policy = await Policy.find();

  if (policy.length === 0) {
    policy = await Policy.create({});
  }

  return res.status(200).json(policy[0]);
};

// ########################################
// ########## GET PRIVACY POLICY ##########
// ########################################
export const getTerms = async (req, res) => {
  let terms = await Term.find();

  if (terms.length === 0) {
    terms = await Term.create({});
  }

  return res.status(200).json(terms[0]);
};

// ###################################
// ########## GET All Posts ##########
// ###################################
export const getPosts = async (req, res) => {
  try {
    let query = { isPublished: true };
    const page = parseInt(req.query.page, 10) || 1; //current page
    const per_page = parseInt(req.query.per_page, 10) || 10; //number of posts per page
    const { search } = req.query;

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
// ########## GET SINGLE POST ##########
// #####################################
export const getPost = async (req, res) => {
  try {
    const { slug } = req.query;
    const post = await Post.findOne({ slug, isPublished: true });
    return res.status(200).json({ post });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
