/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        fontFamily: {
            sans: ['"Plus Jakarta Sans"', "sans-serif"],
        },
        extend: {
            keyframes: {
                flash: {
                    "0%, 50%, 100%": {
                        opacity: "1",
                    },
                    "25%, 75%": {
                        opacity: "0",
                    },
                },
            },
            animation: {
                flash: "flash 3s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
