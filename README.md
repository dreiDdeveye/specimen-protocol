# SPECIMEN PROTOCOL

A living digital organism that evolves in real-time based on memecoin market cap. Features anonymous observer chat, pixel-art visuals, and comprehensive admin controls.

## Features

- **Living Specimen**: Pixel-art organism that evolves through 5 stages based on market cap
- **Real-time Evolution**: Global state synchronized across all observers via Supabase Realtime
- **Anonymous Chat**: Terminal-style chat with anti-spam protection
- **Admin Panel**: Complete control over specimen, chat, and system regulation
- **Pixel Art UI**: Retro terminal/game HUD aesthetic

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom pixel-art theme
- **Database**: Supabase (PostgreSQL + Realtime)
- **Authentication**: Browser fingerprint-based anonymous identity

## Quick Start with Supabase

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned

### 2. Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `scripts/supabase-migration.sql`
3. Paste and run the SQL

### 3. Get Your API Keys

1. Go to **Settings > API**
2. Copy:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon` public key
   - `service_role` secret key

### 4. Configure Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=your-secure-admin-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Install and Run

```bash
npm install
npm run dev
```

Visit:
- Main site: http://localhost:3000
- Admin panel: http://localhost:3000/admin

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main specimen view
│   ├── admin/
│   │   └── page.tsx          # Admin panel
│   └── api/
│       ├── observers/        # Observer registration
│       ├── chat/             # Chat messages
│       ├── specimen/         # Specimen state
│       └── admin/            # Admin actions
├── components/
│   ├── SpecimenRenderer.tsx  # Pixel art specimen display
│   ├── EvolutionHUD.tsx      # Status display
│   ├── ChatConsole.tsx       # Chat interface
│   └── UsernameModal.tsx     # Observer registration
├── db/
│   ├── client.ts             # Supabase client
│   ├── observers.ts          # Observer queries
│   ├── chat.ts               # Chat queries
│   ├── specimen.ts           # Specimen queries
│   └── regulation.ts         # Regulation settings
├── lib/
│   ├── supabase.ts           # Supabase configuration
│   └── utils.ts              # Utility functions
├── services/
│   ├── chatService.ts        # Chat logic
│   ├── specimenService.ts    # Evolution logic
│   └── regulationService.ts  # Admin actions
├── icons/
│   └── index.tsx             # Pixel SVG icons
├── styles/
│   └── globals.css           # Global styles
└── types/
    └── index.ts              # TypeScript types
```

## Evolution Stages

| Stage | Name | Market Cap Required |
|-------|------|---------------------|
| 1 | EMBRYO | $0 |
| 2 | LARVA | $10,000 |
| 3 | PUPA | $100,000 |
| 4 | JUVENILE | $500,000 |
| 5 | MATURE | $1,000,000 |

Stages can be customized via the admin panel.

## Admin Panel Features

### Specimen Control
- Update market cap manually
- Force evolution to specific stage
- Reset specimen to initial state
- View all evolution stages

### Chat Regulation
- Enable/disable chat globally
- Adjust message cooldown (0-300 seconds)
- Adjust max message length (1-1000 characters)
- Mute users (temporary or permanent)
- Shadow mute users (they don't know they're muted)
- Clear all messages
- View all observers

### System Governance
- Enable/disable evolution
- Pause/unpause evolution
- Broadcast system messages
- View system event log

## Supabase Realtime (Optional Enhancement)

The migration already enables Realtime on key tables. To use it in your frontend:

```typescript
import { createSupabaseBrowser } from '@/lib/supabase';

// Subscribe to chat messages
const supabase = createSupabaseBrowser();

supabase
  .channel('chat')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'chat_messages',
  }, (payload) => {
    console.log('New message:', payload.new);
  })
  .subscribe();
```

## Security Notes

- Observer identity tied to browser fingerprint
- Username immutable once set
- Server-side validation for all inputs
- Rate limiting on chat messages
- Admin panel protected by password
- Service role key used only server-side
- Row Level Security (RLS) enabled on all tables

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Works with any platform supporting Next.js:
- Railway
- Render
- Netlify
- Self-hosted

## License

MIT
