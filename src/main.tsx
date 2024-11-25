import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import { Layout } from "@/routes/layout.tsx";
import { Home } from "@/routes/home.tsx";
import { ChatApp } from "./routes/chat-app";
import { RootBoundary } from "@/routes/root-error.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <RootBoundary />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/chat",
                element: <ChatApp />,
            },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
