import React from "react";
import { createRoot } from "react-dom/client";
import App from "~/components/App/App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import axios, { AxiosError } from "axios";
import { theme } from "~/theme";

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error?.response?.status;
      if (status === 401) {
        alert("401 - You are unauthorised");
        return;
      }
      if (status === 403) {
        alert("403 - Access denied");
        return;
      }
      console.log("Some error occured");
    } else if (error.request) {
      console.log("Some error occured");
    } else {
      console.log("Some error occured");
    }
    return Promise.reject(error);
  }
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: Infinity },
  },
});

// if (import.meta.env.DEV) {
//   const { worker } = await import("./mocks/browser");
//   worker.start({ onUnhandledRequest: "bypass" });
// }

const container = document.getElementById("app");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
