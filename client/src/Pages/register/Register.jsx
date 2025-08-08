import React, { useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Container,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../../firebase";
import image from "./loginpage.jpeg";

const theme = createTheme({
  palette: {
    primary: {
      main: "#004346",
    },
    background: {
      default: "#f4f4f4",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h1: {
      fontSize: "1.8rem",
      fontWeight: 700,
      color: "#333333",
    },
    body1: {
      color: "#666666",
    },
  },
});

const Register = () => {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [emailError, setEmailError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
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

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Google Sign-in Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.email.includes("@")) {
      setEmailError("Please enter a valid email.");
      return;
    }
    setEmailError("");
    setLoading(true);
    const imgUrl = file ? await upload(file) : "";

    try {
      await newRequest.post("http://localhost:4000/auth/register", {
        ...user,
        img: imgUrl,
      });
      setSignupSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Error during registration:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <ThemeProvider theme={theme}>
        <Grid
          style={{
            maxWidth: "100%",
            display: "flex",
            marginLeft: "5%",
            marginRight: "5%",
            justifyContent: "space-between",
          }}
        >
          <Container
            maxWidth="100%"
            sx={{ minHeight: "100vh", py: 4 }}
            style={{
              maxWidth: "100%",
              display: "flex",
            }}
          >
            {/* Left Panel */}
            <Grid
              item
              xs={12}
              md={6}
              style={{
                backgroundColor: theme.palette.background.paper,
                padding: "5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h1" align="center" gutterBottom>
                Sign Up
              </Typography>
              <Typography variant="body1" align="center" gutterBottom>
                Fill the form below to create your account
              </Typography>
              <form
                onSubmit={handleSubmit}
                style={{ maxWidth: 400, margin: "0 auto" }}
              >
                <TextField
                  fullWidth
                  label="UserName"
                  name="username"
                  margin="normal"
                  variant="outlined"
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  margin="normal"
                  variant="outlined"
                  onChange={handleChange}
                  error={!!emailError}
                  helperText={emailError}
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  type="file"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setFile(e.target.files[0])}
                />

                {signupSuccess && (
                  <Typography
                    variant="body1"
                    align="center"
                    color="success.main"
                  >
                    Signup successful!
                  </Typography>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  color="#004346"
                  type="submit"
                  disabled={loading}
                  style={{ marginTop: "1rem" }}
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: "#00352c",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#337066",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Sign Up"}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="#004346"
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  style={{ marginTop: "1rem" }}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Sign up with Google"
                  )}
                </Button>
              </form>
              <Typography
                variant="body2"
                align="center"
                style={{ marginTop: "1rem" }}
              >
                Already have an account? <a href="/login">Sign in</a>
              </Typography>
            </Grid>

            {/* Right Panel */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={image}
                alt="Logo"
                style={{
                  width: "500px",
                  height: "500px",
                  objectFit: "cover",
                }}
              />
            </Grid>
          </Container>
        </Grid>
      </ThemeProvider>
    </Box>
  );
};

export default Register;
