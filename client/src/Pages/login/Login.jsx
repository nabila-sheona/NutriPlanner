import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import image from "./signup.jpeg";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { auth, provider, signInWithPopup } from "../../firebase.js";
import newRequest from "../../utils/newRequest.js";
import { useAuth } from "../../context/AuthContext.js"; // Import the AuthContext

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f7f7f7",
      paper: "#ffffff",
    },
    text: {
      primary: "#004346",
      secondary: "#337f83",
    },
    primary: {
      main: "#004346",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h5: {
      fontWeight: 700,
    },
    body2: {
      fontSize: "0.9rem",
    },
  },
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login function from AuthContext

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // State for verification dialog, human check, and login method
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  const [loginMethod, setLoginMethod] = useState(""); // "normal" or "google"

  // Drag and drop handlers for pinky promise in dialog
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", "pinky-promise");
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (data === "pinky-promise") {
      setIsHumanVerified(true);
    }
  };

  // Open verification dialog for regular login
  const handleLoginClick = (e) => {
    e.preventDefault();
    setLoginMethod("normal");
    setVerificationDialogOpen(true);
  };

  // Open verification dialog for Google login
  const handleGoogleLoginClick = (e) => {
    e.preventDefault();
    setLoginMethod("google");
    setVerificationDialogOpen(true);
  };

  // Function to actually call the login API after human verification
  const submitLogin = async () => {
    try {
      const res = await newRequest.post("http://localhost:4000/auth/login", {
        username,
        password,
      });
      const { token, user } = res.data;
      login(user, token); // Use the login function from AuthContext
      navigate("/"); // Always redirect to home
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  // Google login logic remains unchanged
  const submitGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      const res = await newRequest.post(
        "http://localhost:4000/auth/google-login",
        {
          uid: googleUser.uid,
          username: googleUser.displayName,
          email: googleUser.email,
          img: googleUser.photoURL,
        }
      );
      const { token, user } = res.data;
      login(user, token); // Use the login function from AuthContext
      navigate("/"); // Always redirect to home
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      setError("Google login failed. Please try again.");
    }
  };

  // Called when user confirms the pinky promise verification in the dialog
  const handleDialogConfirm = async () => {
    if (isHumanVerified) {
      setVerificationDialogOpen(false);
      setIsHumanVerified(false);
      if (loginMethod === "normal") {
        await submitLogin();
      } else if (loginMethod === "google") {
        await submitGoogleLogin();
      }
      setLoginMethod("");
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Card
          sx={{
            display: "flex",
            width: "80%",
            maxHeight: 500,
            maxWidth: 850,
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
            margin: "0 auto",
            mt: 5,
          }}
        >
          {/* Left Side - Welcome Section */}
          <Box
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              padding: 0.5,
              width: "40%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={image}
              alt="Logo"
              style={{
                display: "block",
                width: "100%",
                cursor: "pointer",
                height: "100%",
              }}
            />
          </Box>

          {/* Right Side - Sign In Section */}
          <CardContent
            sx={{
              width: "60%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 4,
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
              Sign In
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: 10, mb: 1, textAlign: "center" }}
            >
              Become a member of NutriPlanner to enjoy our full facilities
            </Typography>

            <Box component="form" sx={{ width: "100%", mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleLoginClick}
                sx={{
                  mt: 3,
                  mb: 1,
                  backgroundColor: "#00352c",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#337066",
                  },
                }}
              >
                Login
              </Button>

              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}

              <Typography align="center" variant="body2" sx={{ mt: 3 }}>
                or
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mb: 1 }}
                onClick={handleGoogleLoginClick}
              >
                Sign in with Google
              </Button>
              <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
                <Grid item>
                  <Link to="/register">
                    <MuiLink variant="body2">
                      {"Don't have an account?"}
                    </MuiLink>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Dialog
        open={verificationDialogOpen}
        onClose={() => setVerificationDialogOpen(false)}
      >
        <DialogTitle>Human Verification</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 1,
          }}
        >
          <Typography variant="body2">
            Drag the pinky icon to the circle to verify you're human:
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!isHumanVerified && (
              <Box
                draggable
                onDragStart={handleDragStart}
                sx={{
                  width: 50,
                  height: 50,
                  backgroundColor: "#00352c",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "grab",
                  marginRight: 2,
                  transition: "transform 0.3s ease",
                }}
              >
                <Typography variant="body1" sx={{ color: "white" }}>
                  🤞
                </Typography>
              </Box>
            )}

            <Box
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              sx={{
                width: 60,
                height: 60,
                border: "2px dashed #00695f",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isHumanVerified ? (
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#00352c",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body1" sx={{ color: "white" }}>
                    🤞
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#00695f",
                    textAlign: "center",
                  }}
                >
                  Drop Here
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerificationDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDialogConfirm}
            disabled={!isHumanVerified}
            sx={{
              backgroundColor: "#00352c",
              color: "white",
              "&:hover": { backgroundColor: "#00695f" },
            }}
          >
            Confirm and Login
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Login;
