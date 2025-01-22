import React, { useState } from "react";

// CSS Styles
const styles = {
  container: {
    fontFamily: "Poppins, sans-serif",
    margin: "20px",
    textAlign: "center",
  },
  header: {
    color: "#4CAF50",
  },
  feedContainer: {
    maxWidth: "600px",
    margin: "auto",
    textAlign: "left",
  },
  article: {
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    cursor: "pointer",
  },
  articleTitle: {
    margin: "0",
    color: "#333",
  },
  articleSummary: {
    color: "#555",
  },
  fullArticle: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    margin: "20px auto",
    maxWidth: "600px",
    textAlign: "left",
  },
  backButton: {
    display: "block",
    margin: "10px auto",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

// Hardcoded articles
const articles = [
  {
    title: "Understanding the Mediterranean Diet",
    summary:
      "Learn why the Mediterranean diet is celebrated for its health benefits.",
    fullArticle:
      "The Mediterranean diet is based on traditional eating patterns of countries bordering the Mediterranean Sea. It emphasizes whole grains, fruits, vegetables, lean proteins, and healthy fats such as olive oil. This diet is known for reducing the risk of chronic diseases and promoting heart health.",
  },
  {
    title: "Top 10 Foods for a Balanced Plant-Based Diet",
    summary: "Discover essential foods for a plant-based diet.",
    fullArticle:
      "A balanced plant-based diet includes a variety of fruits, vegetables, whole grains, nuts, seeds, and legumes. Key foods include quinoa, lentils, chickpeas, tofu, kale, and chia seeds. These foods provide essential nutrients like protein, fiber, and vitamins for optimal health.",
  },
  {
    title: "Fresh Herbs vs. Dried Herbs: Which is Better?",
    summary: "Explore the differences between fresh and dried herbs.",
    fullArticle:
      "Fresh herbs are ideal for vibrant flavors in salads and finishing dishes, while dried herbs are concentrated and best suited for cooking. Both have unique benefits, but the choice depends on the recipe and desired flavor intensity.",
  },
  {
    title: "Top 10 Foods for a Balanced Plant-Based Diet",
    summary: "Discover essential foods for a plant-based diet.",
    fullArticle:
      "A balanced plant-based diet includes a variety of fruits, vegetables, whole grains, nuts, seeds, and legumes. Key foods include quinoa, lentils, chickpeas, tofu, kale, and chia seeds. These foods provide essential nutrients like protein, fiber, and vitamins for optimal health.",
  },
  {
    title: "5 Benefits of the Mediterranean Diet",
    summary:
      "Learn why the Mediterranean diet is considered one of the healthiest.",
    fullArticle:
      "The Mediterranean diet emphasizes fresh vegetables, fruits, whole grains, and healthy fats like olive oil. It has been shown to reduce the risk of heart disease, improve brain health, support weight management, and promote longevity.",
  },
  {
    title: "The Importance of Hydration for Weight Loss",
    summary: "Find out how staying hydrated can aid in shedding pounds.",
    fullArticle:
      "Drinking enough water can boost metabolism, reduce appetite, and improve digestion. Staying hydrated ensures your body efficiently processes nutrients and eliminates waste, making it an essential component of any weight loss plan.",
  },
  {
    title: "Understanding Intermittent Fasting",
    summary: "Explore the basics and benefits of intermittent fasting.",
    fullArticle:
      "Intermittent fasting involves cycling between eating and fasting periods. Common methods include the 16:8 method and 5:2 diet. Benefits include improved insulin sensitivity, weight management, and cellular repair processes.",
  },
  {
    title: "Why Whole Grains Are a Must for Your Diet",
    summary: "Discover the health benefits of whole grains.",
    fullArticle:
      "Whole grains like oats, brown rice, and quinoa are packed with fiber, vitamins, and minerals. They help regulate blood sugar levels, reduce cholesterol, and improve digestive health, making them an essential part of a balanced diet.",
  },
  {
    title: "10 Superfoods to Boost Your Immune System",
    summary: "Strengthen your immunity with these nutrient-rich foods.",
    fullArticle:
      "Superfoods like berries, spinach, garlic, turmeric, and green tea are rich in antioxidants and vitamins. They help fight inflammation, support immune health, and protect against chronic diseases.",
  },
  {
    title: "Meal Prepping for a Healthier Lifestyle",
    summary: "Simplify your meals and stick to your health goals.",
    fullArticle:
      "Meal prepping involves planning and preparing meals in advance. This approach saves time, reduces food waste, and helps maintain portion control, making it easier to stick to a healthy eating plan.",
  },
  {
    title: "The Role of Protein in Muscle Building",
    summary: "Learn how protein supports muscle growth and repair.",
    fullArticle:
      "Protein is essential for building and repairing muscles. Incorporate high-protein foods like eggs, chicken, fish, and beans into your diet to support recovery and maximize muscle gains after workouts.",
  },
  {
    title: "Debunking Common Diet Myths",
    summary: "Separate facts from fiction in the world of nutrition.",
    fullArticle:
      "Popular diet myths, like 'carbs are bad for you' or 'eating fat makes you fat,' can be misleading. A balanced diet that includes all macronutrients is key to sustainable health and wellness.",
  },
  {
    title: "How to Stay Healthy During the Holidays",
    summary: "Tips for maintaining your fitness goals during celebrations.",
    fullArticle:
      "Enjoy holiday treats in moderation, stay active with family activities, and plan balanced meals to maintain your health. Staying hydrated and managing stress also help you stick to your goals during festive times.",
  },
  // Add more articles as needed...
];

const DietFeed = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleTitleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleBackClick = () => {
    setSelectedArticle(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Diet and Nutrition Feed</h1>

      {selectedArticle ? (
        <div style={styles.fullArticle}>
          <h2>{selectedArticle.title}</h2>
          <p>{selectedArticle.fullArticle}</p>
          <button style={styles.backButton} onClick={handleBackClick}>
            Back to Feed
          </button>
        </div>
      ) : (
        <div style={styles.feedContainer}>
          {articles.map((article, index) => (
            <div
              key={index}
              style={styles.article}
              onClick={() => handleTitleClick(article)}
            >
              <h2 style={styles.articleTitle}>{article.title}</h2>
              <p style={styles.articleSummary}>{article.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DietFeed;
