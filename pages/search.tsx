import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import GroupIcon from "@mui/icons-material/Group";
import StadiumIcon from "@mui/icons-material/Stadium";
import styles from "@/styles/home.module.scss";
import { searchMatches, Match, getFieldData } from "@/lib/matchApi";

interface SearchResult {
  id: string;
  type: "field" | "match";
  title: string;
  subtitle?: string;
  location?: string;
  link: string;
}

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q && typeof q === "string") {
      setSearchQuery(q);
    }
  }, [q]);

  // Real search from backend
  useEffect(() => {
    const doSearch = async () => {
      if (!searchQuery.trim()) {
        setMatches([]);
        return;
      }

      setLoading(true);
      try {
        // searchMatches with city filter (closest matching approach)
        const results = await searchMatches({
          city: searchQuery.trim(),
          limit: 20,
        });
        setMatches(results);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(doSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const searchResults = useMemo(() => {
    const results: SearchResult[] = [];

    // Map matches to results
    matches.forEach((match) => {
      const field = getFieldData(match);

      results.push({
        id: `match-${match._id}`,
        type: "match",
        title: match.matchTitle,
        subtitle: `${match.matchTime} — ${match.matchDate ? new Date(match.matchDate).toLocaleDateString() : 'N/A'}`,
        location: match.location?.city || field?.location?.city,
        link: `/match/${match._id}`,
      });

      // Also add field as result if populated
      if (field) {
        const fieldId = `field-${field._id}`;
        if (!results.find((r) => r.id === fieldId)) {
          results.push({
            id: fieldId,
            type: "field",
            title: field.propertyName,
            subtitle: field.propertyDescription || "Maydon",
            location: field.location?.city,
            link: `/rental?field=${field._id}`,
          });
        }
      }
    });

    return results;
  }, [matches]);

  const filteredResults = useMemo(() => {
    if (activeTab === 0) return searchResults;
    const typeMap = ["all", "field", "match"];
    const selectedType = typeMap[activeTab];
    return searchResults.filter((result) => result.type === selectedType);
  }, [searchResults, activeTab]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    router.replace(
      {
        pathname: "/search",
        query: e.target.value.trim() ? { q: e.target.value.trim() } : {},
      },
      undefined,
      { shallow: true }
    );
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "field":
        return <StadiumIcon />;
      case "match":
        return <SportsSoccerIcon />;
      default:
        return <SearchIcon />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "field":
        return "Maydon";
      case "match":
        return "Match";
      default:
        return "Barchasi";
    }
  };

  const resultCounts = {
    all: searchResults.length,
    field: searchResults.filter((r) => r.type === "field").length,
    match: searchResults.filter((r) => r.type === "match").length,
  };

  return (
    <>
      <Head>
        <title>Qidirish - KickUp</title>
        <meta name="description" content="Maydon, match va jamoalarni qidiring." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box className={styles.homePage}>
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            {/* Search Bar */}
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                placeholder="Shahar, maydon yoki match nomi bilan qidiring"
                variant="outlined"
                size="medium"
                value={searchQuery}
                onChange={handleSearch}
                onKeyPress={handleSearchSubmit}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton onClick={handleSearchClick} edge="start" sx={{ padding: "4px" }}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "1.1rem",
                  },
                }}
              />
            </Box>

            {/* Results Count */}
            {searchQuery.trim() && !loading && (
              <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
                "{searchQuery}" bo'yicha {filteredResults.length} natija topildi
              </Typography>
            )}

            {/* Tabs */}
            {searchQuery.trim() && searchResults.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label={`Barchasi (${resultCounts.all})`} sx={{ textTransform: "none" }} />
                  <Tab label={`Maydonlar (${resultCounts.field})`} sx={{ textTransform: "none" }} />
                  <Tab label={`Match'lar (${resultCounts.match})`} sx={{ textTransform: "none" }} />
                </Tabs>
              </Box>
            )}

            {/* Search Results */}
            {!searchQuery.trim() ? (
              <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                <SearchIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Qidirishni boshlang
                </Typography>
                <Typography variant="body2">
                  Maydon yoki match'larni qidiring
                </Typography>
              </Box>
            ) : loading ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : filteredResults.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                <SearchIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Natija topilmadi
                </Typography>
                <Typography variant="body2">
                  Try different keywords
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {filteredResults.map((result, index) => (
                  <React.Fragment key={result.id}>
                    <Card
                      component={Link}
                      href={result.link}
                      sx={{
                        textDecoration: "none",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 3,
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                          <Box sx={{ color: "primary.main", display: "flex", alignItems: "center", mt: 0.5 }}>
                            {getTypeIcon(result.type)}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                              <Typography variant="h6" component="div">
                                {result.title}
                              </Typography>
                              <Chip
                                label={getTypeLabel(result.type)}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                            {result.subtitle && (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {result.subtitle}
                              </Typography>
                            )}
                            {result.location && (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
                                <LocationOnIcon sx={{ fontSize: 16 }} />
                                <Typography variant="body2">{result.location}</Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                    {index < filteredResults.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}
