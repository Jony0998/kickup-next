import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Grid,
  Alert,
  CircularProgress,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  LinearProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useAuth } from "@/contexts/AuthContext";
import { getMatchDetails, Match } from "@/lib/matchApi";
import { createPayment, processPayment, PaymentType, PaymentMethod } from "@/lib/paymentApi";
import ProtectedRoute from "@/components/ProtectedRoute";

function PaymentContent() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [payment, setPayment] = useState<{
    status: string;
    couponCode?: string;
    discount?: number;
    finalAmount?: number;
    paymentMethod?: string;
    id?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(false);

  useEffect(() => {
    if (id && typeof id === "string") {
      loadData();
    }
  }, [id, isAuthenticated]);

  const loadData = async () => {
    if (!id || typeof id !== "string") return;

    try {
      setLoading(true);
      setError("");
      const [matchData] = await Promise.all([
        getMatchDetails(id),
      ]);
      setMatch(matchData);
      // Payment info derived from match data
      setPayment({
        status: 'pending',
        finalAmount: matchData.matchFee || 0,
      });
    } catch (err: any) {
      console.error("Error loading payment data:", err);
      setError(err?.message || "Failed to load payment information");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    // Mock coupon validation
    const validCoupons: Record<string, number> = {
      WELCOME10: 10,
      SAVE5000: 5000,
      DISCOUNT20: 20,
      "PLAB-PRO": 100, // Free
    };

    const discount = validCoupons[couponCode.toUpperCase()];
    if (discount) {
      setAppliedCoupon(true);
      if (payment && match) {
        const discountAmount = typeof discount === "number" && discount < 100
          ? ((match.matchFee || 0) * discount) / 100
          : discount;
        setPayment({
          ...payment,
          couponCode: couponCode.toUpperCase(),
          discount: discountAmount,
          finalAmount: Math.max(0, (match.matchFee || 0) - discountAmount),
        });
        setError("");
      }
    } else {
      setError("Invalid coupon code");
    }
  };

  const handlePayment = async () => {
    if (!payment || !match || !id) return;

    try {
      setProcessing(true);
      setError("");

      // 1. Create Payment Intent on Backend
      let method = PaymentMethod.CARD;
      if (paymentMethod === "bank") method = PaymentMethod.BANK_TRANSFER;
      else if (paymentMethod === "wallet") method = PaymentMethod.NAVER_PAY; // Default wallet

      const newPayment = await createPayment({
        paymentType: PaymentType.MATCH_FEE,
        amount: payment.finalAmount || 0,
        currency: "UZS", // Defaulting to UZS as per previous context? Or KRW for Plab? Using UZS for now locally.
        paymentMethod: method,
        relatedMatchId: id as string,
        description: `Payment for match: ${match.matchTitle}`,
        paymentGateway: "TEST_GATEWAY"
      });

      // 2. Simulate external processing (or real integration call)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 3. Process/Confirm Payment on Backend
      const processedPayment = await processPayment(newPayment.id);

      if (processedPayment.paymentStatus === 'COMPLETED') {
        setPayment({
          ...payment,
          status: "completed",
          paymentMethod,
          id: processedPayment.id,
        });

        // Redirect to success page or match details
        setTimeout(() => {
          router.push(`/match/${id}?payment=success`);
        }, 1500);
      } else {
        throw new Error("Payment failed or pending.");
      }

    } catch (err: any) {
      console.error("Error processing payment:", err);
      setError(err?.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !match) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!match || !payment) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Payment information not found</Alert>
      </Container>
    );
  }

  const finalAmount = payment.finalAmount !== undefined ? payment.finalAmount : (match.matchFee || 0);

  return (
    <>
      <Head>
        <title>Payment - KickUp</title>
        <meta name="description" content="Complete your payment for the match" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="md">
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ mb: 3, textTransform: "none" }}
          >
            Back
          </Button>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Left Column - Payment Form */}
            <Grid item xs={12} md={7}>
              <Card sx={{ mb: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    Payment Method
                  </Typography>

                  <FormControl component="fieldset" sx={{ width: "100%", mb: 3 }}>
                    <RadioGroup
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <Card
                        sx={{
                          mb: 2,
                          border: paymentMethod === "card" ? 2 : 1,
                          borderColor: paymentMethod === "card" ? "primary.main" : "divider",
                          cursor: "pointer",
                          "&:hover": {
                            borderColor: "primary.main",
                          },
                        }}
                        onClick={() => setPaymentMethod("card")}
                      >
                        <CardContent>
                          <FormControlLabel
                            value="card"
                            control={<Radio />}
                            label={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CreditCardIcon />
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  Credit/Debit Card
                                </Typography>
                              </Box>
                            }
                            sx={{ m: 0, width: "100%" }}
                          />
                        </CardContent>
                      </Card>

                      <Card
                        sx={{
                          mb: 2,
                          border: paymentMethod === "bank" ? 2 : 1,
                          borderColor: paymentMethod === "bank" ? "primary.main" : "divider",
                          cursor: "pointer",
                          "&:hover": {
                            borderColor: "primary.main",
                          },
                        }}
                        onClick={() => setPaymentMethod("bank")}
                      >
                        <CardContent>
                          <FormControlLabel
                            value="bank"
                            control={<Radio />}
                            label={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <AccountBalanceIcon />
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  Bank Transfer
                                </Typography>
                              </Box>
                            }
                            sx={{ m: 0, width: "100%" }}
                          />
                        </CardContent>
                      </Card>

                      <Card
                        sx={{
                          border: paymentMethod === "wallet" ? 2 : 1,
                          borderColor: paymentMethod === "wallet" ? "primary.main" : "divider",
                          cursor: "pointer",
                          "&:hover": {
                            borderColor: "primary.main",
                          },
                        }}
                        onClick={() => setPaymentMethod("wallet")}
                      >
                        <CardContent>
                          <FormControlLabel
                            value="wallet"
                            control={<Radio />}
                            label={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <AccountBalanceWalletIcon />
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  Digital Wallet (Kakao/Naver)
                                </Typography>
                              </Box>
                            }
                            sx={{ m: 0, width: "100%" }}
                          />
                        </CardContent>
                      </Card>
                    </RadioGroup>
                  </FormControl>

                  {paymentMethod === "card" && (
                    <Box sx={{ mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        placeholder="1234 5678 9012 3456"
                        sx={{ mb: 2 }}
                      />
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Expiry Date"
                            placeholder="MM/YY"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="CVV"
                            placeholder="123"
                          />
                        </Grid>
                      </Grid>
                      <TextField
                        fullWidth
                        label="Cardholder Name"
                        placeholder="John Doe"
                        sx={{ mt: 2 }}
                      />
                    </Box>
                  )}

                  {paymentMethod === "bank" && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                      Bank transfer details will be sent to your email after confirmation.
                    </Alert>
                  )}

                  {paymentMethod === "wallet" && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                      You will be redirected to your digital wallet provider.
                    </Alert>
                  )}

                  {/* Coupon Code */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Coupon Code
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        fullWidth
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={appliedCoupon}
                        InputProps={{
                          startAdornment: <LocalOfferIcon sx={{ mr: 1, color: "text.secondary" }} />,
                        }}
                      />
                      {!appliedCoupon && (
                        <Button
                          variant="outlined"
                          onClick={handleApplyCoupon}
                          sx={{ textTransform: "none" }}
                        >
                          Apply
                        </Button>
                      )}
                      {appliedCoupon && (
                        <Button
                          variant="outlined"
                          color="success"
                          onClick={() => {
                            setAppliedCoupon(false);
                            setCouponCode("");
                            if (payment) {
                              setPayment({
                                ...payment,
                                couponCode: undefined,
                                discount: undefined,
                                finalAmount: match.matchFee || 0,
                              });
                            }
                          }}
                          sx={{ textTransform: "none" }}
                        >
                          Remove
                        </Button>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Order Summary */}
            <Grid item xs={12} md={5}>
              <Card sx={{ position: "sticky", top: 20, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Order Summary
                  </Typography>

                  {/* Match Info */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Match
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {match.matchTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(match.matchDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })} at {match.matchTime}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Price Breakdown */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2">Match Price</Typography>
                      <Typography variant="body2">{(match.matchFee || 0).toLocaleString()} UZS</Typography>
                    </Box>
                    {payment.discount && payment.discount > 0 && (
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" color="success.main">
                          Discount
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          -{(payment.discount).toLocaleString()} UZS
                        </Typography>
                      </Box>
                    )}
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Total
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                        {(finalAmount).toLocaleString()} UZS
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Payment Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handlePayment}
                    disabled={processing || payment.status === "completed"}
                    sx={{
                      py: 1.5,
                      mb: 2,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                      },
                      "&:disabled": {
                        background: "rgba(0, 0, 0, 0.12)",
                      },
                    }}
                  >
                    {processing ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={20} sx={{ color: "white" }} />
                        <span>Processing...</span>
                      </Box>
                    ) : payment.status === "completed" ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircleIcon />
                        <span>Payment Completed</span>
                      </Box>
                    ) : (
                      `Pay ${(finalAmount).toLocaleString()} UZS`
                    )}
                  </Button>

                  {payment.status === "completed" && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      Payment completed successfully! Redirecting...
                    </Alert>
                  )}

                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 2 }}>
                    Your payment is secure and encrypted
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default function PaymentPage() {
  return (
    <ProtectedRoute>
      <PaymentContent />
    </ProtectedRoute>
  );
}
