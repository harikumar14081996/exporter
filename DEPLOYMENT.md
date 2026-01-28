# Deployment Guide - SR Pharmagical Exporter

## 🚀 Quick Deploy to Vercel

### Prerequisites
- [Vercel account](https://vercel.com/signup) (free)
- [GitHub account](https://github.com/signup) (free)
- Git installed on your computer

---

## Option 1: Deploy via Vercel CLI (Fastest)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Navigate to Project
```bash
cd /Users/harikumarpatel/Pharma
```

### Step 3: Deploy
```bash
vercel
```

### Step 4: Follow Prompts
- Login to Vercel (opens browser)
- Confirm project settings
- Wait for deployment

**Done!** Your site will be live at a Vercel URL (e.g., `https://sr-pharmagical-exporter.vercel.app`)

---

## Option 2: Deploy via Vercel Dashboard (Most Common)

### Step 1: Push to GitHub

```bash
# Initialize git repository
cd /Users/harikumarpatel/Pharma
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SR Pharmagical Exporter website"

# Create new repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/sr-pharmagical-exporter.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repo
5. **Project settings** (auto-detected):
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Click **"Deploy"**

### Step 3: Wait for Build

- Vercel will build your project (~1-2 minutes)
- You'll see a preview of your site
- Click the URL to view your live site!

---

## Configure Custom Domain

### Step 1: Add Domain in Vercel

1. Go to your project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Enter `srpharmagicalexporter.com`
4. Click **"Add"**

### Step 2: Update DNS Settings

Vercel will provide DNS records. Add to your domain registrar:

**For Apex Domain (srpharmagicalexporter.com)**:
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW Subdomain**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Wait for Propagation

- DNS changes take 5 minutes to 48 hours
- Vercel automatically provisions SSL certificate
- Your site will be live at `https://srpharmagicalexporter.com`

---

## Environment Setup (if needed later)

If you add environment variables (e.g., for form backend):

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add variables:
   - Production
   - Preview
   - Development
3. Redeploy for changes to take effect

---

## Automatic Deployments

Once connected to GitHub, Vercel automatically:
- ✅ Deploys on every push to `main` branch
- ✅ Creates preview deployments for pull requests
- ✅ Shows deployment status in GitHub

---

## Build Commands Reference

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type check
npm run type-check
```

---

## Troubleshooting

### Build Fails

**Check:**
- All dependencies in `package.json`
- Node version (Vercel uses 18.x)
- Build logs in Vercel dashboard

**Fix:**
```bash
# Clean install locally
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Site Not Loading

**Check:**
- Build successful in Vercel dashboard
- DNS settings if using custom domain
- Browser cache (try incognito mode)

### Styles Missing

**Check:**
- All CSS files imported correctly
- Build output includes CSS files
- No console errors in browser

---

## Performance Optimization

Vercel automatically provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Image optimization
- ✅ Gzip compression
- ✅ Edge caching

**Your site will load in < 1 second worldwide!**

---

## Monitoring & Analytics

### Add Vercel Analytics (Optional)

1. Go to project → **Analytics** tab
2. Click **"Enable Analytics"**
3. Get insights on:
   - Page views
   - Visitor countries
   - Device types
   - Performance metrics

---

## 📋 Deployment Checklist

Before deploying, verify:

- [ ] All content is correct and reviewed
- [ ] Contact information updated (phone, email, address)
- [ ] SEO meta tags present
- [ ] No console errors in browser
- [ ] Tested on mobile devices
- [ ] Forms working (if backend added)
- [ ] Links point to correct destinations
- [ ] Images optimized (if replaced)

---

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)

---

## 🎉 You're Ready to Deploy!

The website is **complete and production-ready**. Choose your deployment method above and you'll be live in minutes!

**Need help?** All code is well-documented and follows best practices.
