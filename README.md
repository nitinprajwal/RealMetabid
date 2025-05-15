# PropertyBid - Real Estate Bidding Platform 🏠

A modern, blockchain-powered real estate bidding platform built with React, Supabase, and MetaMask integration. PropertyBid enables users to list properties for auction and participate in secure bidding using cryptocurrency.

![PropertyBid Platform](https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg)

## Features ✨

- **Secure Authentication** 
  - MetaMask wallet integration
  - Blockchain-based transaction security
  - User profiles with wallet management

- **Property Management**
  - List properties for auction
  - Set bidding parameters (initial bid, increment, end date)
  - Upload multiple property images
  - Add detailed property information
  - Google Maps integration for location
  - YouTube video support for virtual tours

- **Bidding System**
  - Real-time bid tracking
  - Automatic bid validation
  - Minimum bid increment enforcement
  - Countdown timers for auctions
  - Bid history tracking

- **Dashboard Analytics**
  - Interactive charts and visualizations
  - Bid activity tracking
  - Property value analysis
  - Portfolio management
  - Transaction history

- **User Features**
  - Profile management
  - Wallet balance tracking
  - Active bids monitoring
  - Won auctions tracking
  - Property ownership management

## Tech Stack 🛠️

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Chart.js
  - Lucide Icons

- **Backend**
  - Supabase
  - PostgreSQL
  - Row Level Security (RLS)

- **Authentication**
  - MetaMask
  - Web3 Integration
  - Ethereum Network

- **Additional Tools**
  - Vite
  - ESLint
  - PostCSS

## Getting Started 🚀

### Prerequisites

- Node.js (v18 or higher)
- MetaMask browser extension
- Supabase account
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/propertybid.git
   cd propertybid
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

1. Create a new Supabase project
2. Run the migration files located in `supabase/migrations/`
3. Enable Row Level Security (RLS) policies

## Project Structure 📁

```
propertybid/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   ├── contexts/
│   ├── lib/
│   ├── pages/
│   └── styles/
├── supabase/
│   └── migrations/
├── public/
└── ...config files
```

## Development Guidelines 📝

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful component and variable names
- Add JSDoc comments for complex functions

### Commit Messages

Follow the conventional commits specification:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for styling changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance

## Testing 🧪

Run the test suite:
```bash
npm run test
```

## Deployment 🌐

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to your preferred hosting platform:
   - Netlify
   - Vercel
   - AWS
   - GitHub Pages

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## Security 🔒

- All smart contracts are audited
- Implements secure wallet connections
- Uses Row Level Security in Supabase
- Regular security updates
- Protected API endpoints

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 💬

For support, email support@propertybid.com or join our Discord channel.

## Acknowledgments 🙏

- [Supabase](https://supabase.io/)
- [MetaMask](https://metamask.io/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [Framer Motion](https://www.framer.com/motion/)

## Roadmap 🗺️

- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Smart contract integration
- [ ] Property verification system
- [ ] Automated KYC process