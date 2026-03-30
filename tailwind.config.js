module.exports = {
  // Define the paths where Tailwind should look for class names
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx}', // Include all Astro files and others (like HTML, JS)
  ],
  
  // Customizing Tailwind’s default theme (optional)
  theme: {
    extend: {
      colors: {
        // Add custom colors
        primary: '#3490dc',
        secondary: '#ffed4a',
        primaryBackground: '#F1F1F1',
        darckBackground: '#2A2A2A',
        cardBackground: '#272729'
      },
      fontFamily: {
        // Add custom fonts
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  
  // Optional: add plugins to extend Tailwind functionality
  plugins: [
    // Example plugin for forms, for instance
    require('@tailwindcss/forms'),
  ],
  
}
