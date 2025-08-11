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
  Card,
  CardContent,
  CardActions,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { Favorite, Settings } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import upload from "../../utils/upload.js";
import MealPlanCard from "../MealPlan/MealPlanCard.jsx";
import ViewRecipeDialog from "../community/ViewRecipeDialog";
import MealPlanRecipeDialog from "../community/MealPlanCard";
import MealPlanRecipeCard from "../MealPlan/MealPlanRecipeCard.jsx";
import RecipeUploadsHeatmap from "../Heatmap/RecipeUploadsHeatmap";

const Profile = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [mealplanRecipes, setMealplanRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    img: "",
  });
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // New state for dialogs
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [selectedMealPlanRecipe, setSelectedMealPlanRecipe] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch user profile
        const userResponse = await axios.get(
          "http://localhost:4000/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(userResponse.data);

        // Fetch liked recipes (regular + meal plan)
        if (userResponse.data.username) {
          const [likedRegular, likedMealPlan] = await Promise.all([
            axios.get("http://localhost:4000/recipes/likedbyuser", {
              headers: { Authorization: `Bearer ${token}` },
              params: { username: userResponse.data.username },
            }),
            axios.get("http://localhost:4000/mealplanrecipes/likedbyuser", {
              headers: { Authorization: `Bearer ${token}` },
              params: { username: userResponse.data.username },
            }),
          ]);

          const combined = [
            ...(likedRegular.data.likedRecipes || []).map((r) => ({
              ...r,
              isMealPlan: false,
            })),
            ...(likedMealPlan.data.likedRecipes || []).map((r) => ({
              ...r,
              isMealPlan: true,
            })),
          ];

          setLikedRecipes(combined);
        }

        // Fetch meal plans
        const mealPlansResponse = await axios.get(
          "http://localhost:4000/mealplans/myplans",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMealPlans(mealPlansResponse.data);

        // Fetch meal plan recipes
        const mealplanRecipesResponse = await axios.get(
          "http://localhost:4000/mealplanrecipes/myrecipes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMealplanRecipes(mealplanRecipesResponse.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchUserData();
  }, []);

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
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        centered
        sx={{ color: "#004346" }}
      >
        <Tab label="User Details" />
        <Tab label="Recipe Uploads Contributions" />
        <Tab label="Liked Recipes" />
        <Tab label="Meal Plans" />
        <Tab label="Meal Plan Recipes" />
      </Tabs>
      {/* Tab Content */}
      <Divider sx={{ my: 4, color: "#004346" }} />
      {/* User Details Tab */}
      {activeTab === 0 && (
        <Box
          sx={{
            padding: 3,
            backgroundColor: "#b3c9c9",
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

            {/* <Grid item xs={12} sm={6}>
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
            </Grid> */}
          </Grid>
        </Box>
      )}
      {/* Heatmap Tab */}
      {activeTab === 1 && (
        <Box sx={{ padding: 1 }}>
          <Typography
            variant="h5"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            Recipe Uploads
          </Typography>
          <Box sx={{ width: "100%", maxWidth: 900, mx: "auto" }}>
            <RecipeUploadsHeatmap heatmapSize={900} />
          </Box>
        </Box>
      )}
      {/* Liked Recipes Tab */}
      {activeTab === 2 && (
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
            <Favorite sx={{ fontSize: "2rem" }} />
            Your Liked Recipes
          </Typography>

          {likedRecipes.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                backgroundColor: "#f8f9fa",
                borderRadius: 2,
                border: "2px dashed #dee2e6",
              }}
            >
              <Favorite sx={{ fontSize: "4rem", color: "#6c757d", mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No liked recipes yet
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Like some recipes to see them here!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ width: "100%" }}>
              {likedRecipes.map((recipe) => (
                <Box
                  key={recipe._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    mb: 2,
                    backgroundColor: "#fff",
                    borderRadius: 1,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {recipe.title}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                      <Chip
                        label={
                          recipe.isMealPlan ? recipe.mealType : recipe.category
                        }
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {(recipe.tags || []).slice(0, 2).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {Array.isArray(recipe.tags) && recipe.tags.length > 2 && (
                        <Chip
                          label={`+${recipe.tags.length - 2}`}
                          size="small"
                        />
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setSelectedRecipe(recipe)}
                      sx={{ color: "#004346", borderColor: "#004346" }}
                    >
                      View
                    </Button>

                    <IconButton
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("token");
                          const endpoint = recipe.isMealPlan
                            ? `http://localhost:4000/mealplanrecipes/${recipe._id}/like`
                            : `http://localhost:4000/recipes/${recipe._id}/like`;
                          await axios.post(
                            endpoint,
                            { username: user.username },
                            { headers: { Authorization: `Bearer ${token}` } }
                          );

                          // Update the liked recipes list
                          setLikedRecipes(
                            likedRecipes.filter((r) => r._id !== recipe._id)
                          );

                          setMessage("Recipe unliked successfully");
                        } catch (err) {
                          console.error("Failed to unlike recipe:", err);

                          setMessage("Failed to unlike recipe");
                        }
                      }}
                      color="error"
                      aria-label="Unlike recipe"
                      sx={{ ml: 1 }}
                    >
                      <Favorite />
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        {recipe.likeCount || 0}
                      </Typography>
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* View dialogs for liked recipes */}
          {selectedRecipe && selectedRecipe.isMealPlan ? (
            <MealPlanRecipeDialog
              open={!!selectedRecipe}
              onClose={() => setSelectedRecipe(null)}
              recipe={selectedRecipe}
            />
          ) : (
            <ViewRecipeDialog
              open={!!selectedRecipe}
              onClose={() => setSelectedRecipe(null)}
              recipe={selectedRecipe}
            />
          )}
        </Box>
      )}
      {/* Meal Plans Tab 
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
            <Box sx={{ width: "100%" }}>
              {mealPlans.map((plan, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    mb: 2,
                    backgroundColor: "#fff",
                    borderRadius: 1,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {plan.title || `Meal Plan ${index + 1}`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {plan.description || "No description provided"}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ color: "#004346", borderColor: "#004346" }}
                  >
                    <MealPlanCard plan={plan} index={index} />
                  </Button>
                </Box>
              ))}
            </Box>
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
            Your Saved Meal Plan Recipes
          </Typography>

          {mealplanRecipes.length === 0 ? (
            <Typography>No recipes saved yet</Typography>
          ) : (
            <Box sx={{ width: "100%" }}>
              {mealplanRecipes.map((rec, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    mb: 2,
                    backgroundColor: "#fff",
                    borderRadius: 1,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {rec.title || `Recipe ${idx + 1}`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {rec.mealType || "No meal type specified"}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ color: "#004346", borderColor: "#004346" }}
                  >
                    <MealPlanRecipeCard recipe={rec} />
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
      */}
      {/* Meal Plans Tab */}
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
            <Box sx={{ width: "100%" }}>
              {mealPlans.map((plan, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    mb: 2,
                    backgroundColor: "#fff",
                    borderRadius: 1,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {plan.title || `Meal Plan ${index + 1}`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {plan.goal || "No description provided"}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ color: "#004346", borderColor: "#004346" }}
                    onClick={() => setSelectedMealPlan(plan)}
                  >
                    View
                  </Button>
                </Box>
              ))}
            </Box>
          )}

          {/* Dialog for viewing meal plan */}
          <Dialog
            open={!!selectedMealPlan}
            onClose={() => setSelectedMealPlan(null)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>{selectedMealPlan?.title || "Meal Plan"}</DialogTitle>
            <DialogContent>
              {selectedMealPlan && (
                <MealPlanCard plan={selectedMealPlan} index={0} />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedMealPlan(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
      {/* Meal Plan Recipes Tab */}
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
            Your Saved Meal Plan Recipes
          </Typography>

          {mealplanRecipes.length === 0 ? (
            <Typography>No recipes saved yet</Typography>
          ) : (
            <Box sx={{ width: "100%" }}>
              {mealplanRecipes.map((rec, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    mb: 2,
                    backgroundColor: "#fff",
                    borderRadius: 1,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {rec.title || `Recipe ${idx + 1}`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {rec.mealType || "No meal type specified"}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ color: "#004346", borderColor: "#004346" }}
                    onClick={() => setSelectedMealPlanRecipe(rec)}
                  >
                    View
                  </Button>
                </Box>
              ))}
            </Box>
          )}

          {/* Dialog for viewing meal plan recipe */}
          <Dialog
            open={!!selectedMealPlanRecipe}
            onClose={() => setSelectedMealPlanRecipe(null)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {selectedMealPlanRecipe?.title || "Meal Plan Recipe"}
            </DialogTitle>
            <DialogContent>
              {selectedMealPlanRecipe && (
                <MealPlanRecipeCard recipe={selectedMealPlanRecipe} />
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setSelectedMealPlanRecipe(null)}
                sx={{ color: "#004346" }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

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
