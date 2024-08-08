/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                txtPrimary: "#555",
                txtLight: "#999",
                txtDark: "#222",
                bgPrimary: "#f1f1f1",
            },
        },
        screens: {
            xs: "400px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
    },
    plugins: [require("tailwind-scrollbar")],
};
