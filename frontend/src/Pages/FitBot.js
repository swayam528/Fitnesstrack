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
} from "@mui/material";

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
  const MAX_HISTORY_LENGTH = 10;

  useEffect(() => {
    localStorage.setItem("fitbotai-messages", JSON.stringify(messages));
  }, [messages]);

  const trimHistory = (history) => {
    if (history.length > MAX_HISTORY_LENGTH) {
      return history.slice(-MAX_HISTORY_LENGTH);
    }
    return history;
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:4000/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message,
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

      setMessages((prevMessages) => {
        const updatedMessages = [
          ...prevMessages,
          { role: "user", content: message },
          { role: "model", content: newMessage },
        ].filter((msg) => msg.content && msg.content.trim() !== "");
        return trimHistory(updatedMessages);
      });
    } catch (e) {
      console.error("Error sending message:", e);
      setMessages((prevMessages) => {
        const updatedMessages = [
          ...prevMessages,
          { role: "user", content: message },
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

  const messagesEndRef = useRef(null);
  console.log(messages.length);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const filteredMessages = messages.filter(
      (msg) => msg.content && msg.content.trim() !== ""
    );
    localStorage.setItem("fitbotai-messages", JSON.stringify(filteredMessages));
  }, [messages]);

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          // p: 0,
          // borderBottom: "0px solid",
          borderColor: "divider",
          bgcolor: "#fff",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* <Avatar
            sx={{
              bgcolor: "#fff",
              width: 40,
              height: 40,
            }}
          >
            F
          </Avatar> */}

        <Typography
          variant="h5"
          fontWeight="600"
          textAlign={"center"}
          color={"black"}
        >
          FitBot AI
        </Typography>
      </Box>

      {/* Messages Area */}
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
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  msg.role === "model" ? "flex-start" : "flex-end",
                gap: 1,
                alignItems: "flex-start",
              }}
            >
              {msg.role === "model" && (
                <Avatar
                  sx={{
                    bgcolor: "#1976d2",
                    width: 32,
                    height: 32,
                  }}
                >
                  F
                </Avatar>
              )}
              <Box
                sx={{
                  maxWidth: "70%",
                  p: 2,
                  bgcolor: msg.role === "model" ? "#f5f5f5" : "#659bdf",
                  color: msg.role === "model" ? "text.primary" : "white",
                  borderRadius: 2,
                  "& p": {
                    m: 0,
                  },
                }}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </Box>
              {msg.role === "user" && (
                <Avatar
                  sx={{
                    bgcolor: "#00C853",
                    width: 32,
                    height: 32,
                  }}
                >
                  U
                </Avatar>
              )}
            </Box>
          ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "white",
        }}
      >
        <Stack direction="row" spacing={2}>
          <TextField
            multiline
            maxRows={4}
            placeholder="Type your message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading || !message.trim()}
            sx={{
              minWidth: 100,
              borderRadius: 2,
              height: 56,
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Send"
            )}
          </Button>
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block", textAlign: "center" }}
        >
          Press Enter to send, Shift + Enter for new line
        </Typography>
      </Box>
    </Box>
  );
}
