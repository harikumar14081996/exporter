# Deploying SR Pharmagical Exporter to GitHub

## Quick GitHub Deployment Steps

### Option 1: Using GitHub Web Interface (Recommended)

1. **Create New Repository on GitHub**
   - Go to [github.com/new](https://github.com/new)
   - Repository name: `Pharma`
   - Make it Public
   - **DO NOT** initialize with README (we already have one)
   - Click "Create repository"

2. **Push Your Code**
   ```bash
   cd /Users/harikumarpatel/Pharma
   git remote add origin https://github.com/YOUR_USERNAME/Pharma.git
   git branch -M main
   git push -u origin main
   ```

3. **Done!** Your code is now on GitHub at `https://github.com/YOUR_USERNAME/Pharma`

---

### Option 2: Deploy to Vercel (Free Hosting)

1. **Connect GitHub to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your `Pharma` repository

2. **Configure (Auto-detected)**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Deploy**
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`

4. **Custom Domain (Optional)**
   - In Vercel, go to Settings → Domains
   - Add `srpharmagicalexporter.com`
   - Update DNS records as shown

---

## Local Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Website Features

### Pages Created
✅ **Home** (`/`) - Hero slider, specializations, products, statistics  
✅ **About Us** (`/about`) - Company story, values, why choose us  
✅ **Contact Us** (`/contact`) - Contact form and information  
✅ **Get Quote** (`/get-quote`) - Quote request form  
✅ **Product Details** (`/product/:id`) - Detailed product pages  

### Navigation
- Fully responsive navbar with mobile menu
- React Router for smooth page transitions
- Breadcrumbs on detail pages
- Footer with quick links

### Features
- ⚡ React 18 with TypeScript
- 🎨 Modern surgical instruments theme
- 📱 Fully responsive design
- ✨ Advanced animations (3D transforms, shimmer effects)
- 📊 Animated statistics counters
- 🎯 SEO optimized
- 🔗 Client-side routing with React Router

---

## Troubleshooting

### Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Router Not Working on GitHub Pages
Add `basename` to BrowserRouter:
```typescript
<BrowserRouter basename="/Pharma">
```

### Images Not Loading
- Check image URLs are correct
- External images (Unsplash) require internet connection

---

## Next Steps

1. ✅ Code is committed to git
2. ⏳ Push to GitHub (follow instructions above)
3. ⏳ Deploy to Vercel for live hosting
4. ⏳ Add custom domain (optional)

---

## Support

Need help? Contact:
- Create an issue on GitHub
- Email: info@srpharmagicalexporter.com
