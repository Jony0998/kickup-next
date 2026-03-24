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
  Chip,
  Button,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useAuth } from "@/contexts/AuthContext";
import { graphqlRequest } from "@/lib/graphqlClient";

interface Coupon {
  id: string;
  title: string;
  discount: number;
  discountType: "percentage" | "fixed";
  expiryDate: string;
  status: "available" | "used" | "expired";
  description: string;
}

export default function Coupons() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadCoupons();
  }, [tabValue]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const hasGraphql = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;
      if (hasGraphql) {
        try {
          type CouponsQuery = {
            myCoupons: Array<{
              _id: string;
              title: string;
              discount: number;
              discountType: string;
              expiryDate: string;
              status: string;
              description: string;
            }>;
          };
          const data = await graphqlRequest<CouponsQuery>(
            `
              query MyCoupons {
                myCoupons {
                  _id
                  title
                  discount
                  discountType
                  expiryDate
                  status
                  description
                }
              }
            `,
            { auth: true }
          );
          setCoupons(
            data.myCoupons.map((c) => ({
              id: c._id,
              title: c.title,
              discount: c.discount,
              discountType: c.discountType as Coupon["discountType"],
              expiryDate: c.expiryDate,
              status: c.status as Coupon["status"],
              description: c.description,
            }))
          );
        } catch (error) {
          console.error("Failed to load coupons:", error);
          setCoupons([]);
        }
      } else {
        setCoupons([]);
      }
    } catch (error) {
      console.error("Error loading coupons:", error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    if (tabValue === 0) return coupon.status === "available";
    if (tabValue === 1) return coupon.status === "used";
    if (tabValue === 2) return coupon.status === "expired";
    return true;
  });

  return (
    <>
      <Head>
        <title>Coupons - KickUp</title>
        <meta name="description" content="View your coupons" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4, pb: 12 }}>
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <Button
              component={Link}
              href="/mypage"
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 2, textTransform: "none" }}
            >
              Back to My Page
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
              Coupons
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Use coupons when booking matches or recharging
            </Typography>
          </Box>

          <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 3 }}>
            <Tabs
              value={tabValue}
              onChange={(e, v) => setTabValue(v)}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                },
              }}
            >
              <Tab label="Available" />
              <Tab label="Used" />
              <Tab label="Expired" />
            </Tabs>
          </Card>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : filteredCoupons.length === 0 ? (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <LocalOfferIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No coupons yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You’ll see coupons here when you get them from events or promotions.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {filteredCoupons.map((coupon) => (
                <Grid item xs={12} sm={6} md={4} key={coupon.id}>
                  <Card
                    sx={{
                      height: "100%",
                      border:
                        coupon.status === "available"
                          ? "2px solid"
                          : "1px solid",
                      borderColor:
                        coupon.status === "available"
                          ? "primary.main"
                          : "divider",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                      background:
                        coupon.status === "available"
                          ? "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)"
                          : "transparent",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            bgcolor: "primary.light",
                            color: "primary.main",
                          }}
                        >
                          <LocalOfferIcon />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {coupon.title}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          background:
                            coupon.status === "available"
                              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                              : "none",
                          WebkitBackgroundClip: coupon.status === "available" ? "text" : "none",
                          WebkitTextFillColor: coupon.status === "available" ? "transparent" : "inherit",
                        }}
                      >
                        {coupon.discountType === "percentage"
                          ? `${coupon.discount}%`
                          : `₩${coupon.discount.toLocaleString()}`}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                        {coupon.description}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Expires: {coupon.expiryDate}
                      </Typography>
                      <Chip
                        label={coupon.status}
                        size="small"
                        sx={{ mt: 1, fontWeight: 600 }}
                        color={
                          coupon.status === "available"
                            ? "success"
                            : coupon.status === "used"
                              ? "default"
                              : "error"
                        }
                      />
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

