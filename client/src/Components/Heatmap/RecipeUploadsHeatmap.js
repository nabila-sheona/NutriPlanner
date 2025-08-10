import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Snackbar,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./heatmapcolor.css";

const RecipeUploadsHeatmap = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        if (!currentUser?.username) {
          navigate("/login");
          return;
        }

        setLoading(true);

        const response = await fetch(
          `http://localhost:4000/recipes/heatmap?username=${encodeURIComponent(
            currentUser.username
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Transform data for the heatmap component
        const transformedData = data.map((item) => ({
          date: item._id,
          count: item.count,
        }));

        setHeatmapData(transformedData);
      } catch (err) {
        console.error("Heatmap fetch failed:", err);
        setSnackbarMessage(err.message || "Failed to load heatmap data");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, [currentUser?.username, navigate]);

  // Helper function to get the date range for the heatmap
  const getStartDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 11); // Show 12 months of data
    date.setDate(1); // Start from first day of the month
    return date;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{ p: 3, display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Recipe Uploads Heatmap
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ overflowX: "auto", py: 2 }}>
            <CalendarHeatmap
              startDate={getStartDate()}
              endDate={new Date()}
              values={heatmapData}
              classForValue={(value) => {
                if (!value || !value.count) return "color-empty";
                return `color-github-${Math.min(4, value.count)}`;
              }}
              tooltipDataAttrs={(value) => ({
                "data-tip": value?.date
                  ? `${value.date}: ${value.count} recipe${
                      value.count !== 1 ? "s" : ""
                    } uploaded`
                  : "No data",
              })}
              showWeekdayLabels
              gutterSize={2}
            />
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" color="text.secondary">
            This heatmap shows your recipe upload activity over the past year.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Hover over squares to see details. Darker colors indicate more
            uploads.
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default RecipeUploadsHeatmap;
