import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "@/lib/apolloClient";
import Layout from "@/components/Layout";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { ErrorNotificationProvider } from "@/contexts/ErrorNotificationContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

function AppContent({ Component, pageProps }: AppProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  // Pages that don't need Layout
  const noLayoutPages = ['/login', '/register'];
  const shouldShowLayout = !noLayoutPages.includes(router.pathname);

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
          primary: {
            main: "#00E377", // Plab Green
            contrastText: "#191F28",
          },
          secondary: {
            main: isDark ? "#E5E7EB" : "#333D4B",
            contrastText: isDark ? "#111827" : "#ffffff",
          },
          background: {
            default: isDark ? "#111827" : "#F2F4F6",
            paper: isDark ? "#1F2937" : "#FFFFFF",
          },
          text: {
            primary: isDark ? "#FFFFFF" : "#191F28",
            secondary: isDark ? "#9CA3AF" : "#8B95A1",
          },
          divider: isDark ? "rgba(255, 255, 255, 0.12)" : "#E5E8EB",
        },
        typography: {
          fontFamily: inter.style.fontFamily,
          h1: { fontWeight: 800 },
          h2: { fontWeight: 700 },
          h3: { fontWeight: 700 },
          h4: { fontWeight: 700 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
          button: { textTransform: 'none', fontWeight: 600 },
          allVariants: {
            color: isDark ? "#FFFFFF" : "#191F28",
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '12px',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              },
              containedPrimary: {
                color: '#191F28',
                '&:hover': {
                  backgroundColor: '#00C466',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                border: 'none',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: 'none',
                borderBottom: '1px solid #E5E8EB',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [isDark]
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ErrorNotificationProvider>
        <ErrorBoundary>
          <main className={inter.className}>
            {shouldShowLayout ? (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            ) : (
              <Component {...pageProps} />
            )}
          </main>
        </ErrorBoundary>
      </ErrorNotificationProvider>
    </MuiThemeProvider>
  );
}


export default function App(props: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <AuthProvider>
          <SearchProvider>
            <AppContent {...props} />
          </SearchProvider>
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
