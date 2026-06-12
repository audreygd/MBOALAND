import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Divider,
  Badge,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const conversations = [
  {
    id: 1,
    name: "Martin Kamga",
    lastMessage: "Bonjour, le terrain est-il toujours disponible ?",
    unread: 2,
  },
  {
    id: 2,
    name: "Alice Nguimatsia",
    lastMessage: "Merci pour les informations.",
    unread: 0,
  },
  {
    id: 3,
    name: "Bernard Tchamda",
    lastMessage: "Je souhaiterais visiter le terrain.",
    unread: 1,
  },
];

const messages = [
  {
    id: 1,
    sender: "other",
    text: "Bonjour, le terrain est-il toujours disponible ?",
    time: "09:15",
  },
  {
    id: 2,
    sender: "me",
    text: "Bonjour. Oui, il est toujours disponible.",
    time: "09:18",
  },
  {
    id: 3,
    sender: "other",
    text: "Parfait. Puis-je organiser une visite ?",
    time: "09:20",
  },
];

export default function MessagingPage() {
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0],
  );

  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        sx={{
          fontSize: 30,
          fontWeight: 700,
          mb: 0.5,
        }}
      >
        Messagerie
      </Typography>

      <Typography
        sx={{
          color: "text.secondary",
          mb: 3,
        }}
      >
        Discutez avec les acheteurs intéressés par vos terrains.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          overflow: "hidden",
          height: "75vh",
          display: "flex",
        }}
      >
        {/* Liste des conversations */}
        <Box
          sx={{
            width: 400,
            borderRight: "1px solid",
            borderColor: "divider",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 18,
                mb: 2,
              }}
            >
              Conversations
            </Typography>

            <TextField
              fullWidth
              size="small"
              placeholder="Rechercher une conversation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          </Box>

          {filteredConversations.map((conversation) => (
            <Box
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              sx={{
                p: 2,
                cursor: "pointer",
                borderBottom: "1px solid",
                borderColor: "divider",
                backgroundColor:
                  selectedConversation.id === conversation.id
                    ? "rgba(22,163,74,0.05)"
                    : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(22,163,74,0.03)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar>{conversation.name[0]}</Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {conversation.name}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "text.secondary",
                    }}
                  >
                    {conversation.lastMessage}
                  </Typography>
                </Box>

                {conversation.unread > 0 && (
                  <Badge color="success" badgeContent={conversation.unread} />
                )}
              </Box>
            </Box>
          ))}

          {filteredConversations.length === 0 && (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: 14,
                }}
              >
                Aucune conversation trouvée
              </Typography>
            </Box>
          )}
        </Box>

        {/* Zone de discussion */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar>{selectedConversation.name[0]}</Avatar>

            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                {selectedConversation.name}
              </Typography>
            </Box>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              p: 4,
              overflowY: "auto",
              bgcolor: "#fafafa",
            }}
          >
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "me" ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    maxWidth: "70%",
                    p: 2,
                    borderRadius: 1,
                    backgroundColor:
                      msg.sender === "me" ? "#15803d" : "#ffffff",
                    color: msg.sender === "me" ? "#ffffff" : "#111827",
                    border:
                      msg.sender === "other" ? "1px solid #e5e7eb" : "none",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                    }}
                  >
                    {msg.text}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 11,
                      mt: 0.5,
                      opacity: 0.8,
                    }}
                  >
                    {msg.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Divider />

          {/* Saisie message */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              placeholder="Écrire un message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Button
              variant="contained"
              sx={{
                bgcolor: "#15803d",
                px: 4,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#166534",
                },
              }}
            >
              Envoyer
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
