const User = require("../Model/user.model"); // Ensure this path is correct
const createError = require("../utils/createError");

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (req.userId !== user._id.toString()) {
      return next(createError(403, "You can delete only your account."));
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("deleted.");
  } catch (err) {
    next(err); // Make sure to handle errors
  }
};

const getUser = async (req, res, next) => {
  try {
    let user;

    if (req.uid) {
      user = await User.findOne({ uid: req.uid });
    } else {
      user = await User.findById(req.userId);
    }

    if (!user) return res.status(404).send("User not found.");
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

// Update user information by either `uid` for Google users or `_id` for other users
const updateUser = async (req, res, next) => {
  try {
    const { username, email, img, newPassword } = req.body;
    const updatedData = { username, email, img };

    if (newPassword) updatedData.password = newPassword;

    // Use `uid` if available; otherwise, use `userId`
    const user = req.uid
      ? await User.findOneAndUpdate({ uid: req.uid }, updatedData, {
          new: true,
        })
      : await User.findByIdAndUpdate(req.userId, updatedData, { new: true });

    if (!user) return res.status(404).send("User not found.");
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

// Export the functions
module.exports = {
  deleteUser,
  getUser,
  updateUser,
};
