import Head from "next/head";
import { useState } from "react";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import AdminLayout from "@/components/AdminLayout";
import AdminRoute from "@/components/AdminRoute";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("matches");
  const [dateRange, setDateRange] = useState("month");
  const [format, setFormat] = useState("csv");

  const handleExport = () => {
    // Export logic here
    alert(`Exporting ${reportType} report as ${format.toUpperCase()} for ${dateRange}`);
  };

  return (
    <AdminRoute>
      <AdminLayout>
        <Head>
          <title>Reports - Admin - KickUp</title>
          <meta name="description" content="Generate and export reports" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, letterSpacing: "-0.02em", color: "text.primary" }}>
              Reports & Export
            </Typography>

            <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                  <DescriptionIcon sx={{ fontSize: 32, color: "#00E377" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Generate Report
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      select
                      label="Report Type"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <MenuItem value="matches">Matches</MenuItem>
                      <MenuItem value="users">Users</MenuItem>
                      <MenuItem value="fields">Fields</MenuItem>
                      <MenuItem value="payments">Payments</MenuItem>
                      <MenuItem value="attendance">Attendance</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      select
                      label="Date Range"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                    >
                      <MenuItem value="week">Last Week</MenuItem>
                      <MenuItem value="month">Last Month</MenuItem>
                      <MenuItem value="quarter">Last Quarter</MenuItem>
                      <MenuItem value="year">Last Year</MenuItem>
                      <MenuItem value="all">All Time</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      select
                      label="Export Format"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                    >
                      <MenuItem value="csv">CSV</MenuItem>
                      <MenuItem value="excel">Excel (XLSX)</MenuItem>
                      <MenuItem value="pdf">PDF</MenuItem>
                      <MenuItem value="json">JSON</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleExport}
                    sx={{
                      bgcolor: "#00E377",
                      color: "#191F28",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#00C466" },
                    }}
                  >
                    Export Report
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Alert severity="info" sx={{ mt: 3 }}>
              Reports are generated in real-time and may take a few moments to process.
            </Alert>
          </Container>
        </Box>
      </AdminLayout>
    </AdminRoute>
  );
}

