# Carl's Portfolio - Modern Full-Stack Developer Showcase

A high-performance, mobile-optimized portfolio website built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Features advanced animations, responsive design, and comprehensive device-tier optimization.

## Features

- **Next.js 14** with App Router and Server Components
- **TypeScript** for type safety and enhanced developer experience
- **Tailwind CSS** with custom variants and responsive utilities
- **Framer Motion** for fluid animations and page transitions
- **Mobile Optimization** with device-tier detection system
  - Minimal animations on mobile (<768px)
  - Balanced performance on tablet (768-1023px)
  - Full animation suite on desktop (≥1024px)
- **Radix UI** accessible component primitives
- **PostgreSQL** with **Prisma ORM** for type-safe database queries
- **Docker** support for containerized deployment
- **CI/CD** with GitHub Actions
- **Sentry** error monitoring and performance tracking
- **Google Analytics** integration
- **ESLint** + **Prettier** + **Husky** for code quality
- **Custom Cursor** with theme-aware styling (desktop only)
- **Dark/Light Mode** with smooth transitions
- **SEO Optimized** with comprehensive metadata

## Project Structure

```
carl-portfolio/
├── app/                       # Next.js app directory
│   ├── layout.tsx            # Root layout with metadata
│   ├── page.tsx              # Home page
│   ├── contact/              # Contact page
│   ├── resume/               # Resume page
│   ├── work/                 # Projects gallery
│   └── actions/              # Server actions
├── components/               # React components
│   ├── ui/                  # Reusable UI components
│   ├── projects/            # Project-specific components
│   ├── AnimatedBackground.tsx
│   ├── CustomCursor.tsx
│   ├── Header.tsx
│   └── ...
├── lib/                     # Utilities and helpers
│   ├── device-detect.ts    # Device detection hooks
│   ├── mobile-animations.ts # Mobile animation configs
│   ├── animations.ts       # Animation presets
│   ├── prisma.ts          # Prisma client
│   └── analytics.tsx      # Analytics setup
├── prisma/                 # Database schema and migrations
│   └── schema.prisma      # Prisma schema
├── config/                 # Configuration files
│   └── site.ts           # Site configuration & SEO
├── data/                  # Static data
│   └── projects.ts       # Project information
├── types/                 # TypeScript type definitions
└── public/                # Static assets
    ├── Logo/             # Site logo
    └── assets/           # Images, icons, etc.
```

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Tailwind Variants** - Component variants
- **Framer Motion** - Animations
- **Radix UI** - Accessible components
- **React Icons** - Icon library

### Backend & Database

- **PostgreSQL** - Database
- **Prisma ORM** - Type-safe database client
- **Next.js API Routes** - Serverless functions

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and enhanced DX
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animations
- **Radix UI** - Accessible component primitives
- **React Icons** - Icon library

### Performance Optimization
- **Device Detection System** - Smart device-tier detection
- **Responsive Animations** - Conditional rendering based on device capabilities
- **Mobile-First Approach** - Optimized for all screen sizes
- **Code Splitting** - Automatic route-based splitting
- **Image Optimization** - Next.js Image component

### Backend & Database
- **PostgreSQL** - Relational database
- **Prisma ORM** - Type-safe database client
- **Next.js API Routes** - Serverless functions

### DevOps & Monitoring
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Sentry** - Error tracking and performance monitoring
- **Google Analytics** - Usage analytics
- **Vercel** - Deployment platform

### Code Quality
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **TypeScript** - Static type checking

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL (or Docker)
- npm, yarn, or pnpm

### Installation

1. Clone the repository
```bash
git clone https://github.com/Dokkai-B/carl-portfolio.git
cd carl-portfolio
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Set up the database
```bash
# Using Docker (recommended)
docker-compose up -d postgres

# Run Prisma migrations
npm run db:push

# (Optional) Seed the database

npm run db:seed
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the portfolio.

## Docker Deployment

### Using Docker Compose (Full Stack)
```bash
# Start all services (frontend + PostgreSQL + Adminer)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Using Docker (Frontend Only)
```bash
# Build the image
docker build -t carl-portfolio .

# Run the container
docker run -p 3000:3000 carl-portfolio
```

## Available Scripts

\`\`\`bash
npm run dev # Start development server
npm run build # Build for production
npm run start # Start production server
npm run lint # Run ESLint
npm run format # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check # Run TypeScript type checking

# Database scripts

npm run db:generate # Generate Prisma client
npm run db:push # Push schema to database
npm run db:migrate # Create migration
npm run db:studio # Open Prisma Studio
npm run db:seed # Seed the database
```

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SITE_URL` - Your site URL

Optional:
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry error tracking
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics ID

See `.env.example` for all available environment variables.

## Database Management

### Prisma Studio
```bash
npm run db:studio
```
Opens Prisma Studio at [http://localhost:5555](http://localhost:5555)

### Adminer (with Docker)
When using `docker-compose`, Adminer is available at [http://localhost:8080](http://localhost:8080)

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The CI/CD pipeline in `.github/workflows/ci-cd.yml` will handle:
- Linting and type checking
- Building the application
- Automatic deployments to Vercel

### Other Platforms
- **Railway**: Connect your repo and add PostgreSQL addon
- **Render**: Use the Docker setup
- **Fly.io**: Use the Dockerfile

## Customization

### Site Configuration
Edit `config/site.ts` to update site metadata, social links, and SEO settings.

### Color Theme
Edit `app/globals.css` to customize the color scheme:
```css
:root {
  --primary: ...;
  --accent: ...;
}
```

### Mobile Optimization
The site uses a device-tier system that automatically optimizes performance:
- **Mobile (<768px)**: Minimal animations, static backgrounds
- **Tablet (768-1023px)**: Balanced performance
- **Desktop (≥1024px)**: Full animation suite

To customize device detection, edit `lib/device-detect.ts`.

## Performance Features

- **Device-Tier Detection**: Automatic optimization based on screen size and device capabilities
- **Conditional Rendering**: Heavy animations only render on capable devices
- **Touch Support**: Dual mouse/touch event handling for hybrid devices
- **Custom Cursor**: Desktop-only custom cursor with theme awareness
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting

## License

MIT License - feel free to use this project for your own portfolio.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

**Carl Patrick Adrian Aguas**
- GitHub: [@Dokkai-B](https://github.com/Dokkai-B)
- LinkedIn: [carl-patrick-adrian-aguas](https://linkedin.com/in/carl-patrick-adrian-aguas-0a5959292)
- Email: xix.carlaguas.xix@gmail.com

Project Link: [https://github.com/Dokkai-B/carl-portfolio](https://github.com/Dokkai-B/carl-portfolio)

---

Built with Next.js, TypeScript, and Tailwind CSS
