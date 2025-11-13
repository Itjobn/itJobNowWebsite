import localFont from "next/font/local";

// Switzer font family
export const switzer = localFont({
    src: [
        {
            path: "../fonts/Switzer-Regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../fonts/Switzer-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "../fonts/Switzer-SemiBold.woff2",
            weight: "600",
            style: "normal",
        },
        {
            path: "../fonts/Switzer-Bold.woff2",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-switzer",
    display: "swap", // Improves loading performance
});

// If you have italic variants, add them like this:
// {
//   path: "../fonts/Switzer-RegularItalic.woff2",
//   weight: "400",
//   style: "italic",
// },

