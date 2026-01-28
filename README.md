# SR Pharmagical Exporter Website

A modern, responsive React website for SR Pharmagical Exporter - showcasing pharmaceutical products and services.

## Features

- ✨ Modern, pharmaceutical-themed design
- 📱 Fully responsive across all devices
- 🎨 Beautiful animations and transitions
- 🚀 Fast and optimized
- 🎯 SEO-friendly
- 💊 Product showcase with cards
- 📧 Contact form
- 🎞️ Hero image slider

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **CSS3** with custom design system
- **Modern ES6+** JavaScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd Pharma
```

2. Install dependencies
```bash
npm install
```

3. Run development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and your site will be deployed!

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel will auto-detect Vite and configure everything
6. Click "Deploy"

Your site will be live at `https://your-project.vercel.app`

## Project Structure

```
Pharma/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Navbar.css
│   │   ├── ImageSlider.tsx
│   │   ├── ImageSlider.css
│   │   ├── ProductCard.tsx
│   │   ├── ProductCard.css
│   │   ├── Footer.tsx
│   │   └── Footer.css
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Customization

### Colors

Edit the CSS variables in `src/index.css`:
```css
:root {
  --primary: #0066cc;
  --secondary: #00a86b;
  /* ... more variables */
}
```

### Content

- **Products**: Edit the `products` array in `src/App.tsx`
- **Slider**: Edit the `slides` array in `src/components/ImageSlider.tsx`
- **Contact Info**: Update in `src/components/Footer.tsx` and contact section in `src/App.tsx`

## License

© 2024 SR Pharmagical Exporter. All Rights Reserved.
