import bcrypt, { compare } from "bcryptjs";
import User from "@/models/userModel";

// ############################################
// ########## UPDATE PROFILE DETAILS ##########
// ############################################
export const updateProfile = async (req, res) => {
  try {
    // details to be updated: details OR password
    const { userId, update: to_be_updated } = req.query;
    // get the user associated with the userId
    const user = await User.findById(userId);

    // ########## UPDATING USER DETAILS ##########
    if (to_be_updated === "details") {
      const { firstname, lastname, username, email } = await JSON.parse(
        req.body
      );

      // check if email is already registered
      /*
      This feature will work should you decide to implement multiple users in the CMS
    */
      const emailExists = await User.findOne({
        email,
      }).select("-password");

      // check if email entered is associated with another account
      if (emailExists && !emailExists._id.equals(user._id)) {
        return res.status(400).json({
          error: "A user with this email already exist.",
        });
      }

      // update user details
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          firstname,
          lastname,
          username,
          email,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      return res.status(302).json({
        success: "User updated successfully.",
        user: {
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
        },
      });
    }

    // ########## PASSWORD UPDATE ##########
    if (to_be_updated === "password") {
      const { password, confirmPassword } = await JSON.parse(req.body);

      if (password !== confirmPassword) {
        return res.status(400).json({
          error: "Passwords do not match.",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters long.",
        });
      }

      // compare if new password matches current password
      const new_Password_Is_Same_As_Old_Password = await bcrypt.compare(
        password,
        user.password
      );

      if (new_Password_Is_Same_As_Old_Password) {
        return res.status(400).json({
          error: "New password cannot be the same as old password.",
        });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { password: hashedPassword },
        {
          new: true,
          runValidators: true,
        }
      );

      return res.status(302).json({
        success: "Password updated successfully.",
      });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
