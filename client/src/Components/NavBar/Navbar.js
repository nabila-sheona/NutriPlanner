import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import logo from "./images/logo.png";
import MessageModal from "../MessageModal/MessageModal";
import { AuthContext } from "../../context/AuthContext";

const Navbar = ({ title, children }) => {
  const { user, logout } = useContext(AuthContext); // use AuthContext
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRestrictedNavigation = (path) => {
    if (user) {
      navigate(path);
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/login");
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          display: "flex",
          backgroundColor: "#fff",
          color: "#000",
          padding: "10px 20px",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box display="flex" alignItems="center" gap={2}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{ marginLeft: "50px" }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "contain",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box component="span" sx={{ color: "#00352c" }}>
                    Nutri
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      border: "2px solid #669999",
                      borderRadius: "4px",
                      padding: "0px 4px",
                      marginLeft: "4px",
                      color: "#669999",
                    }}
                  >
                    Planner
                  </Box>
                </Typography>
              </Box>
            </Link>
          </Box>

          {/* Navigation Links + Login/Logout Button */}
          <Box display="flex" gap={2} alignItems="center">
            {[
              { label: "Home", path: "/" },
              { label: "Community", path: "/community" },
              { label: "My Recipes", path: "/myrecipes" },
              { label: "Mood Meal", path: "/moodtracker" },
              { label: "Meal Planner", path: "/mealplanner" },
            ].map((link) => (
              <Button
                key={link.path}
                variant="text"
                sx={{
                  textTransform: "capitalize",
                  backgroundColor:
                    location.pathname === link.path ? "#004346" : "transparent",
                  color: location.pathname === link.path ? "#fff" : "#000",
                  borderRadius: "20px",
                  padding: "5px 15px",
                  "&:hover": {
                    backgroundColor: "#004346",
                    color: "#fff",
                  },
                }}
                onClick={() =>
                  [
                    "/services",
                    "/community",
                    "/profile",
                    "/myrecipes",
                    "/mealplanner",
                    "/moodtracker",
                  ].includes(link.path)
                    ? handleRestrictedNavigation(link.path)
                    : navigate(link.path)
                }
              >
                {link.label}
              </Button>
            ))}

            {/* Conditional Login or Logout Button */}
            {!user ? (
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "20px",
                  borderColor: "#004346",
                  color: "#004346",
                  textTransform: "capitalize",
                  padding: "5px 15px",
                  "&:hover": {
                    backgroundColor: "#004346",
                    color: "#fff",
                  },
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            ) : (
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "20px",
                  borderColor: "#d32f2f",
                  color: "#d32f2f",
                  textTransform: "capitalize",
                  padding: "5px 15px",
                  "&:hover": {
                    backgroundColor: "#d32f2f",
                    color: "#fff",
                  },
                }}
                onClick={logout}
              >
                Logout
              </Button>
            )}
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            {user && (
              <Avatar
                src={user.img || ""}
                alt={user.username || "User"}
                sx={{
                  width: "40px",
                  height: "40px",
                  border: "2px solid #004346",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/profile")}
              />
            )}
          </Box>
        </Toolbar>

        <MessageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          message="You have to log in to access this feature."
        />
      </AppBar>

      {/* Render children */}
      {children && <Box>{React.cloneElement(children, { user })}</Box>}
    </>
  );
};

export default Navbar;
