# 🚀 Carl's Portfolio - Modern Full-Stack PortfolioThis is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).



A modern, fully-featured portfolio website built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**.## Getting Started



## ✨ FeaturesFirst, run the development server:



- ⚡ **Next.js 14** with App Router```bash

- 🔷 **TypeScript** for type safetynpm run dev

- 🎨 **Tailwind CSS** + **Tailwind Variants** for styling# or

- 🎭 **Framer Motion 11** for animationsyarn dev

- 🧩 **Radix UI** components# or

- 🗄️ **PostgreSQL** with **Prisma ORM**pnpm dev

- 🐳 **Docker** support# or

- 🔄 **CI/CD** with GitHub Actionsbun dev

- 📊 **Sentry** error monitoring```

- 📈 **Google Analytics** integration

- ✅ **ESLint** + **Prettier** + **Husky** for code qualityOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- 🔒 **Type-safe** database queries

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## 📁 Project Structure

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

```

carl-portfolio/## Learn More

├── app/                    # Next.js app directory

│   ├── layout.tsx         # Root layout with metadataTo learn more about Next.js, take a look at the following resources:

│   ├── page.tsx           # Home page

│   ├── contact/           # Contact page- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

│   ├── resume/            # Resume page- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

│   ├── services/          # Services page

│   └── work/              # Work/Projects pageYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

├── components/            # React components

│   ├── ui/               # Reusable UI components## Deploy on Vercel

│   └── ...               # Feature components

├── lib/                  # Utilities and helpersThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

│   ├── prisma.ts        # Prisma client

│   ├── utils.ts         # Utility functionsCheck out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

│   └── analytics.tsx    # Analytics setup
├── prisma/              # Database schema and migrations
│   └── schema.prisma    # Prisma schema
├── config/              # Configuration files
│   └── site.ts         # Site configuration
├── types/              # TypeScript type definitions
└── public/             # Static assets
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

### DevOps & Monitoring
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Sentry** - Error tracking
- **Google Analytics** - Usage analytics

### Code Quality
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit checks
- **TypeScript** - Type checking

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- PostgreSQL (or use Docker)
- npm or yarn

### Installation

1. **Clone the repository**

\`\`\`bash
git clone https://github.com/Dokkai-B/carl-portfolio.git
cd carl-portfolio
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**

\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` with your configuration:

\`\`\`env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Add your keys for EmailJS, Sentry, Analytics, etc.
\`\`\`

4. **Set up the database**

\`\`\`bash
# Using Docker (recommended)
docker-compose up -d postgres

# Or using local PostgreSQL
# Make sure PostgreSQL is running and DATABASE_URL is correct

# Run Prisma migrations
npm run db:push

# (Optional) Seed the database
npm run db:seed
\`\`\`

5. **Run the development server**

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

## 🐳 Docker Deployment

### Using Docker Compose (Full Stack)

\`\`\`bash
# Start all services (frontend + PostgreSQL + Adminer)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

### Using Docker (Frontend Only)

\`\`\`bash
# Build the image
docker build -t carl-portfolio .

# Run the container
docker run -p 3000:3000 carl-portfolio
\`\`\`

## 📝 Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript type checking

# Database scripts
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed the database
\`\`\`

## 🔐 Environment Variables

See \`.env.example\` for all available environment variables.

Required:
- \`DATABASE_URL\` - PostgreSQL connection string
- \`NEXT_PUBLIC_SITE_URL\` - Your site URL

Optional:
- \`NEXT_PUBLIC_SENTRY_DSN\` - Sentry error tracking
- \`NEXT_PUBLIC_GA_MEASUREMENT_ID\` - Google Analytics ID
- \`NEXT_PUBLIC_EMAILJS_*\` - EmailJS configuration

## 📊 Database Management

### Prisma Studio

\`\`\`bash
npm run db:studio
\`\`\`

Opens Prisma Studio at [http://localhost:5555](http://localhost:5555)

### Adminer (with Docker)

When using \`docker-compose\`, Adminer is available at [http://localhost:8080](http://localhost:8080)

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The CI/CD pipeline in \`.github/workflows/ci-cd.yml\` will handle:
- Linting and type checking
- Building the application
- Automatic deployments to Vercel

### Other Platforms

- **Railway**: Connect your repo and add PostgreSQL addon
- **Render**: Use the Docker setup
- **Fly.io**: Use the Dockerfile

## 🎨 Customization

### Site Configuration

Edit \`config/site.ts\` to update site metadata, social links, and SEO settings.

### Color Theme

Edit \`app/globals.css\` to customize the color scheme:

\`\`\`css
:root {
  --primary: ...;
  --accent: ...;
}
\`\`\`

### Components

All UI components use Tailwind Variants for easy customization:

\`\`\`tsx
import { tv } from "tailwind-variants";

const button = tv({
  base: "...",
  variants: {
    variant: {
      default: "...",
      custom: "...", // Add your variant
    },
  },
});
\`\`\`

## 📄 License

MIT License - feel free to use this project for your own portfolio!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

Carl Patrick Adrian Aguas

Project Link: [https://github.com/Dokkai-B/carl-portfolio](https://github.com/Dokkai-B/carl-portfolio)

---

Made with ❤️ by Carl
