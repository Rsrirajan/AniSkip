# AnimeSkip

A modern web application for anime fans to skip filler episodes and get correct watch orders for their favorite anime series.

## Features

- **Landing Page**: Modern hero section with search functionality and premium upsell
- **Authentication**: Login and signup pages with Google OAuth support
- **Pricing Plans**: Free and Premium subscription options
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel (planned)
- **Backend**: Supabase (planned)
- **Authentication**: Supabase Auth (planned)
- **Payments**: Stripe (planned)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aniskip-fresh
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx          # Login page with tabbed interface
│   ├── signup/
│   │   └── page.tsx          # Signup page with tabbed interface
│   ├── pricing/
│   │   └── page.tsx          # Pricing plans page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/               # Reusable components (planned)
└── lib/                      # Utility functions (planned)
```

## Pages

### Landing Page (`/`)
- Hero section with search functionality
- Premium upsell section
- Responsive design with modern UI

### Login Page (`/login`)
- Tabbed interface for login/signup
- Email and password authentication
- Google OAuth integration (UI ready)
- Form validation

### Signup Page (`/signup`)
- Account creation form
- Display name and password requirements
- Google OAuth integration (UI ready)

### Pricing Page (`/pricing`)
- Free and Premium plan comparison
- Feature lists with checkmarks
- "Most Popular" badge for Premium plan
- Call-to-action buttons

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Styling

The project uses Tailwind CSS for styling. The design system includes:
- Purple (`violet-500`) as the primary brand color
- Inter font family for typography
- Consistent spacing and border radius
- Responsive breakpoints

## Planned Features

- [ ] Backend API with Supabase
- [ ] User authentication and session management
- [ ] Anime database integration
- [ ] Filler episode detection
- [ ] Watch order generation
- [ ] User favorites and history
- [ ] Stripe payment integration
- [ ] Cross-device sync
- [ ] Personalized recommendations

## Deployment

The application is designed to be deployed on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
