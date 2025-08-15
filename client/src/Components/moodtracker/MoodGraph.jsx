import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

const moods = ["Happy", "Sad", "Stressed", "Energetic", "Calm"];

const moodColors = {
  Happy: "#FFD700",
  Sad: "#4682B4",
  Stressed: "#8B0000",
  Energetic: "#32CD32",
  Calm: "#9370DB",
};

const moodToY = {
  Happy: 4,
  Sad: 3,
  Stressed: 2,
  Energetic: 1,
  Calm: 0,
};
const yToMood = {
  4: "Happy",
  3: "Sad",
  2: "Stressed",
  1: "Energetic",
  0: "Calm",
};

const MoodGraph = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/mood/moods/graph`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const moodsData = res.data;
        const now = Date.now();
        const points = [];

        moodsData.forEach(({ mood, date }) => {
          const moodDate = new Date(date);
          const diffMs = now - moodDate.getTime();
          if (diffMs <= 24 * 60 * 60 * 1000) {
            points.push({
              x: moodDate.getTime(),
              y: moodToY[mood],
            });
          }
        });

        setData(points);
      } catch (error) {
        console.error("Failed to fetch mood graph data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const xTickFormatter = (tick) =>
    new Date(tick).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const yTickFormatter = (tick) => yToMood[tick] || "";

  const moodCounts = moods.map((m) => ({
    mood: m,
    count: data.filter((p) => p.y === moodToY[m]).length,
  }));

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        Mood Tracker Overview
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3, color: "text.secondary" }}>
        Your mood patterns over the last 24 hours.
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {moodCounts.map((m) => (
          <Grid item xs={6} sm={4} md={2} key={m.mood}>
            <Card
              sx={{
                backgroundColor: `${moodColors[m.mood]}20`,
                border: `1px solid ${moodColors[m.mood]}`,
                borderRadius: 3,
                boxShadow: 2,
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ color: moodColors[m.mood] }}>
                  {m.mood}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {m.count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  entries
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Chart */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              domain={["dataMin", "dataMax"]}
              tickFormatter={xTickFormatter}
              name="Time"
              tick={{ fontSize: 12 }}
              scale="time"
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 4]}
              ticks={[0, 1, 2, 3, 4]}
              tickFormatter={yTickFormatter}
              name="Mood"
              tick={{ fontSize: 14, fontWeight: "bold" }}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "y") return yToMood[value];
                if (name === "x") return new Date(value).toLocaleString();
                return value;
              }}
            />
            <Legend />
            {moods.map((mood) => (
              <Scatter
                key={mood}
                name={mood}
                data={data.filter((p) => p.y === moodToY[mood])}
                fill={moodColors[mood]}
                line={{ stroke: moodColors[mood], strokeWidth: 2 }}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </Paper>

      {/* Explanation */}
      <Paper sx={{ mt: 3, p: 3, borderRadius: 3, backgroundColor: "#f9f9f9" }}>
        <Typography variant="h6" gutterBottom>
          Understanding the Chart
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Each dot corresponds to a mood entry recorded during the past 24
          hours.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          The vertical axis (Y-axis) categorizes moods from Calm at the bottom
          to Happy at the top.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          The horizontal axis (X-axis) represents the time of day when each mood
          was logged.
        </Typography>
        <Typography variant="body2">
          Use this chart to identify mood patterns and trends throughout your
          day.
        </Typography>
      </Paper>
    </Box>
  );
};

export default MoodGraph;
