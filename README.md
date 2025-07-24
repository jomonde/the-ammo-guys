# The Ammo Guys - Smart Ammo Stockpiling Platform

A revolutionary platform that helps responsible gun owners build and manage their ammunition reserves through automated stockpiling. Built by veterans, for the shooting community.

## Core Features

- **Smart Stockpile Management**: Build your ammo reserves automatically with our intelligent accumulation system
- **Budget Allocation**: Distribute your monthly ammo budget across different calibers and accessories
- **Flexible Shipping**: Choose between automatic shipments, manual triggers, or hybrid models
- **Veteran-Owned**: Built with integrity and commitment to the 2A community
- **Real-time Inventory Tracking**: Always know what's in your virtual stockpile

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API + TanStack Query
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Real-time Updates**: Supabase Realtime
- **Payments**: Stripe integration for subscriptions
- **Hosting**: Vercel (Edge Functions + Serverless)

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/the-ammo-guys.git
   cd the-ammo-guys
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Components

- **Dashboard**: Real-time view of your stockpile status and ammo budget
- **Allocation Manager**: Configure how your monthly budget is distributed
- **Shipment Console**: View and manage your ammo shipments
- **Stockpile Analytics**: Track your ammo accumulation over time
- **Subscription Portal**: Manage your membership and payment details

## Database Schema (Core Entities)

- **users**: Authentication and profile data
- **subscriptions**: Membership and payment details
- **stockpile_allocations**: Budget distribution across calibers
- **virtual_stockpile**: Track accumulated ammo quantities
- **shipping_history**: Complete shipment records
- **products**: Ammo SKUs and specifications
- **shipment_triggers**: User-defined shipment conditions

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/the-ammo-guys.git
   cd the-ammo-guys
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   # Update the values in .env.local
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Required environment variables (see `.env.example` for full list):
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with ❤️ by [Your Name]
- Special thanks to all veterans and active service members
