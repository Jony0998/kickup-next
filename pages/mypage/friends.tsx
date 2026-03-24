import Head from "next/head";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useAuth } from "@/contexts/AuthContext";
import { getFriends, addFriend, removeFriend, Friend } from "@/lib/socialApi";



export default function Friends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      setLoading(true);
      const data = await getFriends();
      setFriends(data);
    } catch (error) {
      console.error("Error loading friends:", error);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (userId: string) => {
    try {
      const result = await addFriend(userId);
      if (result.success) {
        await loadFriends();
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleRemoveFriend = async (userId: string) => {
    try {
      const result = await removeFriend(userId);
      if (result.success) {
        await loadFriends();
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };


  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Friends - KickUp</title>
        <meta name="description" content="View your friends" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Button
              component={Link}
              href="/mypage"
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 2, textTransform: "none" }}
            >
              Back to My Page
            </Button>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Friends
              </Typography>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Add Friend
              </Button>
            </Box>
          </Box>

          <Card sx={{ mb: 3, boxShadow: 2 }}>
            <CardContent sx={{ py: 2 }}>
              <TextField
                fullWidth
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </CardContent>
          </Card>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : filteredFriends.length === 0 ? (
            <Card>
              <CardContent>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No friends found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery ? "No friends match your search." : "You don't have any friends yet."}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {filteredFriends.map((friend) => (
                <Grid item xs={12} sm={6} md={4} key={friend.id}>
                  <Card
                    sx={{
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: "primary.main",
                            fontSize: "1.5rem",
                            fontWeight: 700,
                          }}
                        >
                          {friend.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {friend.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Level: {friend.level}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mt: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: friend.status === "online" ? "success.main" : "grey.400",
                              }}
                            />
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              {friend.status}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}

