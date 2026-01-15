# Academic A+ Plus - Frontend

A modern Next.js application for AI-powered exam preparation tailored for CSE students in Bangladesh.

## Project Structure

```
frontend/
├── app/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Button.tsx
│   │   │   └── Alert.tsx
│   │   ├── GenerateForm.tsx    # Question generation form
│   │   ├── QuestionCard.tsx    # Individual question display
│   │   ├── ResultsSection.tsx  # Results container
│   │   └── PageHeader.tsx      # Page header
│   ├── lib/                # Utilities and services
│   │   └── api.ts          # API client
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── public/                 # Static assets
└── package.json
```

## Features

- 🎯 Generate exam-style questions by course and chapter
- 📝 Detailed solutions for each question
- ⚠️ Common mistakes to avoid
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔧 TypeScript for type safety
- 📦 Modular component architecture

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running (default: `http://localhost:8000`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your backend URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

### Component Organization

- **UI Components** (`app/components/ui/`): Reusable, generic components
- **Feature Components** (`app/components/`): Feature-specific components
- **Types** (`app/types/`): TypeScript interfaces and types
- **Services** (`app/lib/`): API calls and business logic

### Adding New Features

1. Define types in `app/types/`
2. Create API functions in `app/lib/`
3. Build components in `app/components/`
4. Integrate in pages

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Learn More

To learn more about Next.js:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT

