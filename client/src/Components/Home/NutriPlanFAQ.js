import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Heart, Smile, Book, TrendingUp, Calendar, Target } from "lucide-react";

const NutriPlanFAQ = () => {
  const faqData = [
    {
      title: "How does the AI generate personalized meal plans?",
      description:
        "Our system uses Google Gemini AI to analyze your dietary preferences (vegetarian, keto, etc.) and health goals (weight loss, muscle gain) to create nutritionally balanced weekly meal plans tailored just for you.",
      icon: (
        <TrendingUp
          size={20}
          style={{ marginRight: "8px", color: "#1976D2" }}
        />
      ),
    },
    {
      title: "What does my recipe upload heatmap track?",
      description:
        "The heatmap visualizes your recipe creation activity, showing your most productive days. Darker squares indicate more uploads, helping you maintain cooking consistency and build healthy habits.",
      icon: (
        <Calendar size={20} style={{ marginRight: "8px", color: "#388E3C" }} />
      ),
    },
    {
      title: "How does mood-based recipe recommendation work?",
      description:
        "When you log your mood (happy, stressed, etc.), our AI suggests recipes with ingredients known to complement that emotional state - like comforting carbs when sad or energizing proteins when tired.",
      icon: (
        <Smile size={20} style={{ marginRight: "8px", color: "#D81B60" }} />
      ),
    },
    {
      title: "Can I share my created recipes with others?",
      description:
        "Yes! All your uploaded recipes automatically appear in the community feed where others can like them.",
      icon: (
        <Heart size={20} style={{ marginRight: "8px", color: "#FF5722" }} />
      ),
    },
    {
      title: "What's the benefit of tracking my cooking streak?",
      description:
        "The streak counter motivates consistent home cooking by celebrating your longest consecutive days of recipe uploads - helping build lasting healthy eating habits through friendly competition with yourself.",
      icon: (
        <Target size={20} style={{ marginRight: "8px", color: "#673AB7" }} />
      ),
    },
  ];

  return (
    <CardContent>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          marginBottom: "1rem",
          textAlign: "center",
          color: "#337f83",
        }}
      >
        NutriPlan FAQs
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {faqData.map((faq, index) => (
          <Accordion
            key={index}
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              boxShadow: "none",
              "&:before": { display: "none" },
              "&:hover": { backgroundColor: "#e8e8e8" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#555" }} />}
              aria-controls={`panel${index + 1}-content`}
              id={`panel${index + 1}-header`}
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {faq.icon}
              <Typography variant="h6">{faq.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ color: "#666" }}>
                {faq.description}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </CardContent>
  );
};

export default NutriPlanFAQ;
