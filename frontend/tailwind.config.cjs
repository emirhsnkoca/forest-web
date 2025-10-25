/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Forest Green Theme
        primary: {
          light: '#6B9F3D',
          DEFAULT: '#4A7C25',
          dark: '#2D5016',
          darker: '#1A3009',
        },
        // Earth Brown Theme
        secondary: {
          light: '#A67C52',
          DEFAULT: '#7D5A3F',
          dark: '#5C4033',
          darker: '#3D2A22',
        },
        // Sky Blue Accent
        accent: {
          light: '#3BA0C1',
          DEFAULT: '#2A7F99',
          dark: '#1E5F74',
          darker: '#123F4D',
        },
        // Background variations
        forest: {
          bg: '#F5F9F0',
          earth: '#E8DDD0',
        },
      },
      backgroundImage: {
        'gradient-forest': 'linear-gradient(to bottom, #4A7C25, #2D5016)',
        'gradient-earth-sky': 'linear-gradient(to top, #5C4033 0%, #7D5A3F 30%, #4A7C25 70%, #2A7F99 100%)',
        'gradient-earth-green': 'linear-gradient(to top, #5C4033 0%, #7D5A3F 40%, #6B9F3D 100%)',
        'pixel-green': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234A7C25' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};



