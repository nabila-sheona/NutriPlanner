import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

import { Settings } from "@mui/icons-material";
import axios from "axios";
import upload from "../../utils/upload.js";
import MealPlanCard from "../Namisa/MealPlanCard.jsx";

const Profile = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [mealplanrecipes, setmealplanRecipes] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    img: "",
  });
  const [wishlist, setWishlist] = useState([]);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  /************************N4M154**************************/
  useEffect(() => {
    const fetchMealPlans = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:4000/mealplans/myplans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMealPlans(res.data);
      } catch (err) {
        console.error("Failed to fetch meal plans:", err);
      }
    };

    fetchMealPlans();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "http://localhost:4000/mealplanrecipes/myrecipes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setmealplanRecipes(res.data);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
      }
    };
    fetchRecipes();
  }, []);

  /************************N4M154**************************/

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userResponse = await axios.get(
          "http://localhost:4000/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(userResponse.data);

        await fetchWishlistDetails();
      } catch (err) {
        console.error(err);
      }
    };

    const fetchWishlistDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4000/wishlist/wishlist/details",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWishlist(response.data);
      } catch (err) {
        console.error("Failed to fetch wishlist details:", err);
      }
    };

    fetchUser();
  }, []);

  const handleRemoveFromWishlist = async (petId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/wishlist/wishlistremove",
        { petId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setWishlist((prev) => prev.filter((pet) => pet._id !== petId));
      }
    } catch (err) {
      console.error("Failed to remove pet from wishlist:", err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSettingsOpen = () => setSettingsOpen(true);
  const handleSettingsClose = () => {
    setSettingsOpen(false);
    setPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setProfileImage(null);
    setImagePreview("");
    setMessage("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSettingsSave = async () => {
    if (!password) {
      setMessage("Please enter your current password to confirm changes.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      let imageUrl = user.img;
      if (profileImage) {
        imageUrl = await upload(profileImage);
      }

      const updateData = {
        img: imageUrl,
        password,
        newPassword: newPassword || undefined,
      };

      const response = await axios.put(
        "http://localhost:4000/users/update",
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(response.data);
      setMessage("Profile updated successfully.");
      handleSettingsClose();
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      {/* Profile Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 5,
        }}
      >
        <Avatar
          alt="Profile"
          src={imagePreview || user.img || "/default-pfp.png"}
          sx={{ width: 135, height: 135, mb: 2 }}
        />
        <Typography variant="h4" fontWeight="bold">
          {user.username || "Your Name"}
        </Typography>
        <Typography variant="body1" color="#337f83">
          {user.email}
        </Typography>
        <IconButton
          onClick={handleSettingsOpen}
          sx={{
            mt: 2,
            color: "#004346",
            display: "flex",
            alignItems: "center",
            gap: 1,
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
              backgroundColor: "transparent",
            },
            "&:hover .MuiTouchRipple-root": {
              display: "none",
            },
          }}
        >
          <Settings />
          <Typography variant="body2" color="#337f83">
            Update Profile
          </Typography>
        </IconButton>
      </Box>
      {/* Tabs */}
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="User Details" />
        <Tab label="Something" />
        <Tab label="Wishlist" />
        <Tab label="Meal Plans" />
        <Tab label="Meal Plan Recipes" />
      </Tabs>
      {/* Tab Content */}
      <Divider sx={{ my: 4 }} />
      {activeTab === 0 && (
        <Box
          sx={{
            padding: 3,
            backgroundColor: "#e8eaf6",
            borderRadius: 2,
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            color="black"
            sx={{ fontSize: "1.7rem", fontFamily: "Arial" }}
          >
            User Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  padding: 2,
                  backgroundColor: "#fff",
                  borderRadius: 3,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <AccountCircleIcon
                  color="#004346"
                  sx={{ fontSize: "2.7rem" }}
                />
                <Box>
                  <Typography
                    variant="subtitle1"
                    color="#337f83"
                    sx={{ fontSize: "1.1rem" }}
                  >
                    Username
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    sx={{ fontSize: "1.1em" }}
                  >
                    {user.username}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  padding: 2,
                  backgroundColor: "#fff",
                  borderRadius: 3,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <EmailIcon color="#004346" sx={{ fontSize: "2.7rem" }} />
                <Box>
                  <Typography
                    variant="subtitle1"
                    color="#337f83"
                    sx={{ fontSize: "1.1rem" }}
                  >
                    Email
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    sx={{ fontSize: "1.1rem" }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  padding: 2,
                  backgroundColor: "#fff",
                  borderRadius: 3,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <LocationOnIcon color="#004346" sx={{ fontSize: "2.7rem" }} />
                <Box>
                  <Typography
                    variant="subtitle1"
                    color="#337f83"
                    sx={{ fontSize: "1.1rem" }}
                  >
                    Area(s)
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    sx={{ fontSize: "1.1rem" }}
                  >
                    {user.areas && user.areas.join(", ")}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  padding: 2,
                  backgroundColor: "#fff",
                  borderRadius: 3,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <FoodBankIcon color="#004346" sx={{ fontSize: "2.7rem" }} />
                <Box>
                  <Typography
                    variant="subtitle1"
                    color="#337f83"
                    sx={{ fontSize: "1.1rem" }}
                  >
                    Something
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
      {activeTab === 1 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Something</Typography>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            message={message}
          />
        </Box>
      )}
      {activeTab === 2 && (
        <Box sx={{ padding: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 2 }}
          >
            Something
          </Typography>
        </Box>
      )}
      {/************************N4M154**************************/}{" "}
      {activeTab === 3 && (
        <Box sx={{ padding: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#004346",
            }}
          >
            <RestaurantMenuIcon sx={{ fontSize: "2rem" }} />
            Your Saved Meal Plans
          </Typography>

          {mealPlans.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                backgroundColor: "#f8f9fa",
                borderRadius: 2,
                border: "2px dashed #dee2e6",
              }}
            >
              <RestaurantMenuIcon
                sx={{ fontSize: "4rem", color: "#6c757d", mb: 2 }}
              />
              <Typography variant="h6" color="textSecondary">
                No meal plans saved yet
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Create your first meal plan to see it here!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {mealPlans.map((plan, index) => (
                <MealPlanCard key={index} plan={plan} index={index} />
              ))}
            </Grid>
          )}
        </Box>
      )}
      {activeTab === 4 && (
        <Box sx={{ padding: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#004346",
            }}
          >
            <RestaurantMenuIcon sx={{ fontSize: "2rem" }} />
            Your Saved Recipes
          </Typography>

          {mealplanrecipes.length === 0 ? (
            <Typography>No recipes saved yet</Typography>
          ) : (
            mealplanrecipes.map((rec, idx) => (
              <Box
                key={idx}
                sx={{ mb: 3, p: 2, background: "#fff", borderRadius: 2 }}
              >
                <Typography variant="h6">{rec.title}</Typography>
                <Typography variant="body2">{rec.mealType}</Typography>
                <ul>
                  {rec.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </Box>
            ))
          )}
        </Box>
      )}
      {/************************N4M154**************************/}
      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={handleSettingsClose}>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          {message && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {message}
            </Typography>
          )}
          <Button
            variant="outlined"
            component="label"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#004346",
              color: "white",
              "&:hover": {
                backgroundColor: "#4aedc4",
              },
            }}
          >
            Upload New Picture
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          {imagePreview && (
            <Box sx={{ mb: 2 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Box>
          )}
          <TextField
            label="Current Password"
            fullWidth
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="New Password"
            fullWidth
            variant="outlined"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm New Password"
            fullWidth
            variant="outlined"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsClose} color="#337f83">
            Cancel
          </Button>
          <Button onClick={handleSettingsSave} color="#004346">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
