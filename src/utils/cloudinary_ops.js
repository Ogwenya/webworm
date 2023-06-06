import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ##################################
// ########## UPLOAD IMAGE ##########
// ##################################
export const uploadImage = async (file, folder) => {
  console.log({ file, folder });
  const image = await cloudinary.uploader.upload(
    file,
    { folder: folder },
    (result) => result
  );

  //   delete temp fle after upload
  await fs.unlink(file, (err) => {
    if (err) {
      console.error(err);
    }
  });
  return image;
};

// ##################################
// ########## DELETE IMAGE ##########
// ##################################
export const deleteImage = async (public_id) => {
  const image = await cloudinary.uploader.destroy(public_id);

  return image;
};
