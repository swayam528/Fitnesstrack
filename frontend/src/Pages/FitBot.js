import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Avatar,
  CircularProgress,
  Paper,
  IconButton,
  Zoom,
  Fade,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import { keyframes } from "@emotion/react";
import { styled } from "@mui/material/styles";

// Pulse animation for the loading state
const pulse = keyframes`
  0% {
    transform: scale(0.95);
  }
  70% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.95);
  }
`;

const ChatContainer = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 64px)",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#f8f9fa", // Light background matching app style
  position: "relative",
}));

const Header = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 0,
  background: "white", // Match navbar color
  color: "#333", // Dark text like navbar
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // Subtle shadow like navbar
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
  position: "relative",
  zIndex: 10,
}));

const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isBot",
})(({ theme, isBot }) => ({
  padding: theme.spacing(1.5, 2),
  maxWidth: "70%",
  borderRadius: isBot ? "0 18px 18px 18px" : "18px 0 18px 18px",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  background: isBot ? "#ffffff" : "#00C851", // Green color matching the "Chat with FitBot" button
  color: isBot ? theme.palette.text.primary : "#fff",
  position: "relative",
  "& p": {
    margin: 0,
    fontSize: "0.95rem",
  },
  "& a": {
    color: isBot ? "#00C851" : "#fff", // Green links in bot messages
    textDecoration: "underline",
  },
  "& ul, & ol": {
    paddingLeft: theme.spacing(2.5),
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  "& pre": {
    backgroundColor: isBot ? "#f5f5f5" : "rgba(0, 0, 0, 0.1)",
    padding: theme.spacing(1),
    borderRadius: 4,
    overflowX: "auto",
    maxWidth: "100%",
    fontSize: "0.85rem",
  },
  "& code": {
    fontFamily: "monospace",
    backgroundColor: isBot ? "#f5f5f5" : "rgba(0, 0, 0, 0.1)",
    padding: "2px 4px",
    borderRadius: 4,
    fontSize: "0.85rem",
  },
}));

const BotAvatar = styled(Avatar)(({ theme }) => ({
  background: "#00C851", // Green to match app theme
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  background: "#76c7c0", // Complementary color
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
}));

const InputArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: "white",
  boxShadow: "0 -1px 3px rgba(0, 0, 0, 0.05)",
  borderTop: "1px solid",
  borderColor: "#eaeaea",
  position: "relative",
  zIndex: 5,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 25,
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
    },
    "&.Mui-focused": {
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    },
  },
}));

export default function FitBot() {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("fitbotai-messages");
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            role: "model",
            content:
              "Hello! Welcome to FitBot, your personal fitness assistant. I'm here to help you achieve your health and fitness goals. What can I assist you with today? Do you have a specific goal in mind, such as weight loss, muscle gain, or endurance training? Or perhaps you'd like some general advice on nutrition, workout routines, or injury prevention? Let me know, and I'll do my best to provide you with personalized guidance and support.",
          },
        ];
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const MAX_HISTORY_LENGTH = 10;
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("fitbotai-messages", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto focus the input field when the component mounts
    inputRef.current?.focus();
  }, []);

  const trimHistory = (history) => {
    if (history.length > MAX_HISTORY_LENGTH) {
      return history.slice(-MAX_HISTORY_LENGTH);
    }
    return history;
  };

  const scrollToBottom = () => {
    // Use setTimeout to ensure DOM is updated
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    // Add user message immediately
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userMessage },
    ]);

    // Show typing indicator
    setTyping(true);

    try {
      const response = await fetch("http://localhost:4000/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userMessage,
                },
              ],
            },
          ],
        }),
      });

      let newMessage = await response.json();

      if (typeof newMessage === "object" && newMessage !== null) {
        newMessage = newMessage.text || JSON.stringify(newMessage);
      }

      // Remove typing indicator and add bot response
      setTyping(false);
      setMessages((prevMessages) => {
        const updatedMessages = [
          ...prevMessages.filter((msg) => msg.role !== "typing"),
          { role: "model", content: newMessage },
        ].filter((msg) => msg.content && msg.content.trim() !== "");
        return trimHistory(updatedMessages);
      });
    } catch (e) {
      console.error("Error sending message:", e);
      setTyping(false);
      setMessages((prevMessages) => {
        const updatedMessages = [
          ...prevMessages.filter((msg) => msg.role !== "typing"),
          {
            role: "model",
            content: `Sorry, I encountered an error: ${e.message}`,
          },
        ].filter((msg) => msg.content && msg.content.trim() !== "");
        return trimHistory(updatedMessages);
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    const initialMessage = {
      role: "model",
      content:
        "Hello! Welcome to FitBot, your personal fitness assistant. I'm here to help you achieve your health and fitness goals. What can I assist you with today?",
    };
    setMessages([initialMessage]);
  };

  return (
    <ChatContainer>
      <Header elevation={1}>
        <SmartToyIcon sx={{ color: "#00C851" }} fontSize="large" />
        <Typography
          variant="h5"
          fontWeight="600"
          textAlign="center"
          color="#333"
        >
          FitBot AI
        </Typography>
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            right: 16,
            color: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={clearChat}
          title="Clear conversation"
        >
          <DeleteIcon />
        </IconButton>
      </Header>

      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages
          .filter(
            (msg) =>
              msg.content &&
              typeof msg.content === "string" &&
              msg.content.trim() !== ""
          )
          .map((msg, index) => (
            <Fade in={true} key={index} timeout={300}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.role === "model" ? "flex-start" : "flex-end",
                  gap: 1.5,
                  alignItems: "flex-start",
                  mb: 1.5,
                }}
              >
                {msg.role === "model" && (
                  <BotAvatar sx={{ width: 36, height: 36 }}>
                    <SmartToyIcon fontSize="small" />
                  </BotAvatar>
                )}
                <MessageBubble isBot={msg.role === "model"} elevation={1}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </MessageBubble>
                {msg.role === "user" && (
                  <UserAvatar sx={{ width: 36, height: 36 }}>
                    <PersonIcon fontSize="small" />
                  </UserAvatar>
                )}
              </Box>
            </Fade>
          ))}

        {typing && (
          <Fade in={typing} timeout={200}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                gap: 1.5,
                mb: 1.5,
              }}
            >
              <BotAvatar sx={{ width: 36, height: 36 }}>
                <SmartToyIcon fontSize="small" />
              </BotAvatar>
              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  alignItems: "center",
                  p: 1.5,
                  borderRadius: "0 18px 18px 18px",
                  bgcolor: "white",
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#00C851",
                    animation: `${pulse} 1s infinite ease-in-out`,
                    animationDelay: "0s",
                  }}
                />
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#00C851",
                    animation: `${pulse} 1s infinite ease-in-out`,
                    animationDelay: "0.2s",
                  }}
                />
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#00C851",
                    animation: `${pulse} 1s infinite ease-in-out`,
                    animationDelay: "0.4s",
                  }}
                />
              </Box>
            </Box>
          </Fade>
        )}

        <div ref={messagesEndRef} />
      </Box>

      <InputArea>
        <Stack direction="row" spacing={1.5}>
          <StyledTextField
            multiline
            maxRows={4}
            placeholder="Ask FitBot something..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            variant="outlined"
            size="medium"
            inputRef={inputRef}
            disabled={isLoading}
            InputProps={{
              sx: {
                py: 0.5,
                px: 2,
              },
            }}
          />
          <Zoom in={!isLoading || message.trim() !== ""}>
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={isLoading || !message.trim()}
              sx={{
                minWidth: 56,
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "#00C851", // Green to match app theme
                "&:hover": {
                  bgcolor: "#00a844", // Slightly darker green on hover
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <SendIcon />
              )}
            </Button>
          </Zoom>
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1.5, display: "block", textAlign: "center" }}
        >
          Press Enter to send, Shift + Enter for new line
        </Typography>
      </InputArea>
    </ChatContainer>
  );
}
