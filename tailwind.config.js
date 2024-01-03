/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: "media",
    theme: {
        fontFamily: {
            sans: ['Manrope', 'Helvetica', 'sans-serif'],
            serif: ['serif'],
        },
        extend: {
            colors: {
                'default': 'rgba(0, 0, 0, 0.95)',
                'lite': 'rgba(255, 255, 255, 0.85)',
                'primary': '#4a8cd3',
                'coral': '#fed3d3',
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
