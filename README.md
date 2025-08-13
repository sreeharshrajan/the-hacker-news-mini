# 📰 The Hacker News Mini
A modern, lightning-fast Hacker News client built with Next.js 15, TypeScript, and Shadcn UI. Experience Hacker News like never before with infinite scrolling, intelligent caching, nested comment threads, and a beautiful responsive interface that works seamlessly across all devices.

## ✨ Why Hacker News Mini?

HN Mini reimagines the Hacker News experience with modern web technologies, delivering blazing-fast performance and an intuitive interface that makes browsing tech news a joy.

## 🎯 Core Features

- ⚡ **Instant Loading** – Sub-second story loading with intelligent prefetching
- 📱 **Mobile-First Design** – Pixel-perfect responsive experience on any device
- 🔄 **Infinite Scroll** – Seamless story discovery without pagination breaks
- 💬 **Smart Comment Threading** – Collapsible, nested discussions with visual hierarchy
- ⭐ **Story Bookmarking** – Save and organize your favorite stories locally
- 🌗 **Adaptive Theming** – Beautiful dark/light modes with system preference detection
- 🔍 **Advanced Filtering** – Sort by top, new, ask, show, jobs with real-time updates
- 🚀 **Offline Ready** – Continue reading cached stories without internet
- 📊 **Reading Progress** – Track your position in long comment threads
- 🔗 **Share Integration** – Quick sharing to social platforms

## 🎨 User Experience Highlights

- **Clean Typography** – Optimized for long-form reading with perfect contrast ratios
- **Smooth Animations** – Subtle transitions that enhance rather than distract
- **Keyboard Navigation** – Full accessibility support with intuitive shortcuts
- **Loading States** – Elegant skeletons and progressive loading indicators
- **Error Recovery** – Graceful error handling with retry mechanisms

## 🏗️ Technical Excellence

### Performance Optimizations

- Server-side rendering with Next.js 15 App Router
- Automatic code splitting and lazy loading
- Image optimization with Next.js Image component
- Service worker for offline functionality
- Bundle analysis and tree-shaking

### Developer Experience

- 100% TypeScript coverage with strict mode
- Comprehensive ESLint and Prettier configuration
- Automated testing with Jest and React Testing Library
- Husky pre-commit hooks for code quality
- GitHub Actions CI/CD pipeline

## 🛠️ Technology Stack

| Layer            | Technology                | Purpose                                               |
|------------------|--------------------------|-------------------------------------------------------|
| Frontend         | Next.js 15 + React 18    | Server-side rendering, routing, and React features     |
| Styling          | Tailwind CSS + Shadcn/UI | Utility-first CSS with accessible components           |
| State Management | TanStack Query + Zustand | Server state caching and client state management       |
| Type Safety      | TypeScript 5.0+          | End-to-end type safety and developer experience        |
| Icons            | Lucide React             | Consistent, lightweight SVG icon library               |
| Animations       | Framer Motion            | Smooth, performant animations and transitions          |
| Data Source      | Hacker News Firebase API | Real-time official HN data                            |
| Deployment       | Vercel                   | Edge functions and global CDN                         |

## 📁 Project Structure

```bash
the-hacker-news-mini/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (routes)/
│   │   │   ├── story/[id]/     # Dynamic story pages
│   │   │   ├── user/[id]/      # User profile pages
│   │   │   └── favorites/      # Bookmarked stories
│   │   ├── api/                # API routes
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── components/             # Reusable components
│   │   ├── ui/                 # Shadcn UI primitives
│   │   ├── layout/             # Layout components
│   │   ├── story/              # Story-related components
│   │   └── common/             # Shared components
│   ├── hooks/                  # Custom React hooks
│   │   ├── useStories.ts       # Story fetching logic
│   │   ├── useFavorites.ts     # Local storage management
│   │   └── useInfiniteScroll.ts # Pagination logic
│   ├── lib/                    # Utilities and configurations
│   │   ├── api/                # API client and types
│   │   ├── utils.ts            # Helper functions
│   │   ├── constants.ts        # App constants
│   │   └── validations.ts      # Zod schemas
│   ├── stores/                 # Zustand stores
│   └── types/                  # TypeScript definitions
├── public/                     # Static assets
├── tests/                      # Test suite
└── docs/                       # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/sreeharshrajans/the-hacker-news-mini.git
cd the-hacker-news-mini

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Create production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm test         # Run test suite
pnpm type-check   # TypeScript compilation check
```

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
npx vercel

# Or connect your GitHub repository to Vercel dashboard
```

### Docker

```bash
# Build Docker image
docker build -t the-hacker-news-mini .

# Run container
docker run -p 3000:3000 the-hacker-news-mini
```

### Static Export

```bash
# Generate static files
pnpm build
pnpm export
```

## 🎯 Roadmap

- **PWA Support** – Offline functionality and app-like experience
- **Real-time Updates** – WebSocket integration for live story updates
- **Advanced Search** – Full-text search across stories and comments
- **User Authentication** – HN account integration for voting and posting
- **Analytics Dashboard** – Reading habits and engagement metrics
- **Custom Themes** – User-defined color schemes and layouts
- **Comment Sentiment Analysis** – AI-powered discussion insights
- **Story Recommendations** – Personalized content based on reading history

## 🤝 Contributing

We welcome contributions! Please see our Contributing Guide for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Sreeharsh Rajan

## ⭐ Show Your Support

If you find the-hacker-news-mini useful, please consider giving it a star ⭐ on GitHub. It helps others discover the project and motivates continued development!

<div align="center">
    <sub>Built with ❤️ by <a href="https://sreeharsh.dev">Sreeharsh Rajan</a></sub>
</div>