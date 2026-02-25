/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                polymarket: {
                    bg: '#0F1216', // Dark background
                    card: '#161920', // Card background
                    border: '#2A2E35', // Border color
                    green: '#10B981', // Success green
                    blue: '#3B82F6', // AI blue
                    text: '#F8FAFC', // Main text
                    textMuted: '#94A3B8' // Muted text
                }
            }
        },
    },
    plugins: [],
}
