import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  Container,
  AccordionDetails,
  Card,
  CardContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Heart, Smile, Book } from "lucide-react";

const DietAndMoodFAQ = () => {
  const faqData = [
    {
      title: "How does food affect my mood and energy levels?",
      description:
        "Your diet has a direct impact on your brain chemistry. Nutrient-rich foods like whole grains, fruits, and omega-3 fats help stabilize mood and improve energy throughout the day.",
      icon: <Book size={20} style={{ marginRight: "8px", color: "#1976D2" }} />,
    },
    {
      title: "What are the best foods to improve focus and productivity?",
      description:
        "Foods rich in antioxidants, good fats, and fiber—like berries, leafy greens, and nuts—support brain health and help maintain concentration and alertness.",
      icon: (
        <Smile size={20} style={{ marginRight: "8px", color: "#388E3C" }} />
      ),
    },
    {
      title: "Can poor nutrition contribute to anxiety or depression?",
      description:
        "Yes. Diets high in sugar, processed foods, and refined carbs are linked to mood disorders. Improving nutrition can be a key part of managing mental health.",
      icon: (
        <Heart size={20} style={{ marginRight: "8px", color: "#D81B60" }} />
      ),
    },
    {
      title: "What should I eat during stressful or emotional periods?",
      description:
        "Opt for complex carbs, lean proteins, and magnesium-rich foods like bananas and dark chocolate. Avoid emotional eating by planning nourishing meals in advance.",
      icon: <Book size={20} style={{ marginRight: "8px", color: "#1976D2" }} />,
    },
  ];

  return (
    <Container maxWidth="md">
      <Card
        sx={{
          padding: "2rem",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: 4,
        }}
      >
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
            Frequently Asked Questions
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
      </Card>
    </Container>
  );
};

export default DietAndMoodFAQ;
