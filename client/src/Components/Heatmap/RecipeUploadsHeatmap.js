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

import * as d3 from "d3-scale";
import { interpolateRgb } from "d3-interpolate";

import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const RecipeUploadsHeatmap = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const colorScale = d3
    .scaleLinear()
    .domain([0, 10]) 
    .range(["#e6f0f0", "#004346"])
    .interpolate(interpolateRgb);

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

        setHeatmapData(
          data.map((item) => ({
            date: item._id,
            count: item.count,
          }))
        );
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

  const getStartDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 11);
    date.setDate(1);
    return date;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, display: "flex", flexDirection: "column" }}>
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
              gutterSize={3}
              showWeekdayLabels
              tooltipDataAttrs={(value) => ({
                "data-tooltip-id": "heatmap-tooltip",
                "data-tooltip-content": value?.date
                  ? `${formatDate(value.date)} — ${value.count} upload${
                      value.count !== 1 ? "s" : ""
                    }`
                  : "No uploads",
              })}
              classForValue={(value) => {
                if (!value || !value.count) return "color-empty";
                return `color-github-${Math.min(4, value.count)}`;
              }}
              transformDayElement={(element, value) =>
                React.cloneElement(element, {
                  style: {
                    fill: value?.count ? colorScale(value.count) : "#f0f0f0",
                    rx: 4, 
                    ry: 4,
                    transition: "fill 0.2s ease-in-out",
                  },
                })
              }
            />
            <Tooltip id="heatmap-tooltip" />
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" color="text.secondary">
            This heatmap shows your recipe upload activity over the past year.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Hover over squares to see details. Darker colors indicate more uploads.
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
