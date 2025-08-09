const User = require("../Model/user.model");

const getUserProfile = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    // Step 1: Find the user by email
    const user = await User.findOne({ email }).select("username email");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Step 2: Fetch reviews where the user is the reviewer (reviewsAsDonator)
    const reviewsAsDonator = await Review.find({ reviewerId: user._id })
      .populate("reviewingId", "username") // Populate the reviewing user (adopter)
      .populate("petId", "name") // Populate the pet details
      .select("content timestamp reviewingId petId replies");

    // Step 3: Fetch reviews where the user is being reviewed (reviewsAsAdopter)
    const reviewsAsAdopter = await Review.find({ reviewingId: user._id })
      .populate("reviewerId", "username") // Populate the reviewer
      .populate("petId", "name") // Populate the pet details
      .select("content timestamp reviewerId petId replies");

    // Step 4: Format reviews to user-friendly data
    const formattedReviewsAsDonator = reviewsAsDonator.map((review) => ({
      content: review.content,
      petName: review.petId?.name || "N/A",
      reviewedBy: review.reviewingId?.username || "Unknown", // username populated here
      timestamp: review.timestamp,
      replies: review.replies.map((reply) => ({
        content: reply.content,
        timestamp: reply.timestamp,
      })), // Include replies here
    }));

    const formattedReviewsAsAdopter = reviewsAsAdopter.map((review) => ({
      content: review.content,
      petName: review.petId?.name || "N/A",
      reviewer: review.reviewerId?.username || "Unknown", // username populated here
      timestamp: review.timestamp,
      replies: review.replies.map((reply) => ({
        content: reply.content,
        timestamp: reply.timestamp,
      })), // Include replies here
    }));

    // Step 5: Send the response with user profile and reviews
    res.status(200).json({
      username: user.username,
      email: user.email,
      reviewsAsAdopter: formattedReviewsAsAdopter,
      reviewsAsDonator: formattedReviewsAsDonator,
    });
  } catch (error) {
    console.error("Error fetching user profile and reviews:", error);
    next(error); // Pass error to error-handling middleware
  }
};

module.exports = {
  getUserProfile,
};
