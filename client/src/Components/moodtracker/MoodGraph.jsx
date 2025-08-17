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
  Button,
  Divider,
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { useNavigate } from "react-router-dom";

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
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/mood/moods/graph`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.data || !Array.isArray(res.data)) {
          throw new Error("Invalid data format received from server");
        }

        const moodsData = res.data;
        const now = Date.now();
        const points = [];

        moodsData.forEach(({ mood, date }) => {
          if (!mood || !date) return;
          const moodDate = new Date(date);
          const diffMs = now - moodDate.getTime();
          if (diffMs <= 24 * 60 * 60 * 1000) {
            points.push({
              x: moodDate.getTime(),
              y: moodToY[mood] ?? null,
            });
          }
        });

        setData(points);
      } catch (error) {
        console.error("Failed to fetch mood graph data:", error);
        const serverMessage =
          error.response?.data?.message || error.message || "Unknown error";
        setErrorMessage(`Error fetching mood graph data: ${serverMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress />
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh" textAlign="center">
        <Typography variant="h6" color="error">
          {errorMessage}
        </Typography>
      </Box>
    );
  }

  const xTickFormatter = (tick) =>
    new Date(tick).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const yTickFormatter = (tick) => yToMood[tick] || "";

  const moodCounts = moods.map((m) => ({
    mood: m,
    count: data.filter((p) => p.y === moodToY[m]).length,
  }));

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Back Button */}
      <Button
        variant="contained"
        sx={{
            backgroundColor: "#004346",
            color: "#fff",
            marginBottom: 3,
            '&:hover': { backgroundColor: "#00332e" }
          }}
        onClick={() => navigate("/moodtracker")}
      >
        Back to Mood Tracker
      </Button>

      {/* Header */}
      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 1 }}
      >
        Mood Tracker Overview
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, color: "text.secondary" }}>
        Visual representation of your mood patterns over the last 24 hours.
      </Typography>

      {/* Mood Cards */}
      <Grid container spacing={2} sx={{ mb: 5 }}>
        {moodCounts.map((m) => (
          <Grid item xs={6} sm={4} md={2} key={m.mood}>
            <Card
              sx={{
                backgroundColor: `${moodColors[m.mood]}20`,
                border: `1px solid ${moodColors[m.mood]}`,
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ color: moodColors[m.mood], fontWeight: "bold" }}>
                  {m.mood}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
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

      <Grid container spacing={4}>
        {/* Scatter Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 5 }}>
            <Typography variant="h6" gutterBottom>
              Mood Scatter Chart
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={xTickFormatter}
                  name="Time"
                  tick={{ fontSize: 12, fill: "#555" }}
                  scale="time"
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  domain={[0, 4]}
                  ticks={[0, 1, 2, 3, 4]}
                  tickFormatter={yTickFormatter}
                  name="Mood"
                  tick={{ fontSize: 14, fontWeight: "bold", fill: "#555" }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
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

            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              The scatter chart shows your mood entries over time in the past 24 hours. Each dot represents a mood recorded at a specific time. Use it to spot patterns in mood fluctuations during the day.
            </Typography>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 5 }}>
            <Typography variant="h6" gutterBottom>
              Mood Distribution (Pie Chart)
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={moodCounts}
                  dataKey="count"
                  nameKey="mood"
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {moodCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={moodColors[entry.mood]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value, name) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>

            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              The pie chart represents the proportion of each mood recorded in the last 24 hours. It helps you quickly identify which moods dominate your day.
            </Typography>
          </Paper>
        </Grid>

        {/* Vertical Bar Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 5 }}>
            <Typography variant="h6" gutterBottom>
              Mood Frequency (Vertical Bar)
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={moodCounts}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mood" tick={{ fontSize: 14, fontWeight: "bold" }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {moodCounts.map((entry, index) => (
                    <Cell key={`cell-bar-${index}`} fill={moodColors[entry.mood]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              The vertical bar chart shows the frequency of each mood recorded in the last 24 hours. Use it to compare how often each mood occurs and detect trends.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MoodGraph;
