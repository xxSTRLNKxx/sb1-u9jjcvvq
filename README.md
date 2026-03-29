<div align="center">

<br />

```
  ___       _   _               _
 / _ \     | | | |             (_)
/ /_\ \  __| |_| |__   ___ _ __ _  __ _
|  _  | / _` | __| '_ \ / _ | '__| |/ _` |
| | | || (_| | |_| | | |  __| |  | | (_| |
\_| |_/ \__,_|\__|_| |_|\___|_|  |_|\__,_|
```

**The unified IT operations platform.**

Every role in your IT department — one system, one source of truth.

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](./LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-blueviolet?style=flat-square)]()
[![Built with React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Powered by Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)

<br />

</div>

---

## What is Aetheria?

Aetheria is an open-source IT operations platform built for every corner of your IT department. Not just network engineers. Not just sysadmins. Everyone.

The platform is built around **Aethers** — focused modules, each designed for a specific role or function, all sharing the same underlying data. A cable your network engineer maps in the Network Aether is the same asset your manager sees in the Asset Aether. One system. No silos. No spreadsheets.

> *"The connective layer for your entire IT department."*

<br />

## Aethers

| Aether | Who it's for | Status |
|---|---|---|
| **Infrastructure Aether** | Sysadmins, DC managers | 🚧 In development |
| **Network Aether** | Network engineers | 🚧 In development |
| **Asset Aether** | IT managers, procurement | 🚧 In development |
| **Vendor Aether** | Procurement, management | 📋 Planned |
| **Virtual Aether** | Virtualisation engineers | 📋 Planned |
| **Circuits Aether** | Network, WAN engineers | 📋 Planned |
| **Tenancy Aether** | MSPs, multi-org teams | 📋 Planned |
| **Operations Aether** | On-call, incident management | 📋 Planned |
| **Insight Aether** | Management, reporting | 📋 Planned |

<br />

## Features

**Core platform**
- [x] Authentication — sign in, sign up, sign out
- [x] Role-based access control (`admin`, `manager`, `user`)
- [x] Live dashboard with cross-Aether stats
- [x] User management *(admin only)*
- [x] Full activity audit log *(admin only)*
- [x] Profile management
- [x] Collapsible sidebar with full Aether navigation

**Coming soon**
- [ ] Asset Aether — lifecycle tracking, procurement, hardware inventory
- [ ] Infrastructure Aether — racks, sites, devices, DCIM
- [ ] Network Aether — visual designer, IPAM, cable management
- [ ] Docker image — self-hosted in one command

<br />

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project *(free tier works)*

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/aetheria.git
cd aetheria

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# → Add your Supabase URL and anon key

# Start the dev server
npm run dev
```

App runs at `http://localhost:5173`

### Production build

```bash
npm run build
npm run preview
```

<br />

## Configuration

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Your Supabase URL and anon key are in your Supabase project under **Settings → API**.

<br />

## Roles & Permissions

| Role | Capabilities |
|---|---|
| `admin` | Full platform access — user management, audit log, all Aethers |
| `manager` | Standard access across all available Aethers |
| `user` | Standard access across all available Aethers |

The first account must be promoted to `admin` directly in the Supabase dashboard via the `profiles` table.

<br />

## Project Structure

```
aetheria/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   └── Sidebar.tsx          # Collapsible sidebar, Aether navigation
│   │   └── UI/
│   │       ├── PageHeader.tsx        # Page header — title, icon, count, actions
│   │       └── StatusBadge.tsx       # Coloured status pills
│   ├── contexts/
│   │   └── AuthContext.tsx           # Auth state — signIn, signUp, signOut, profile
│   ├── hooks/
│   │   └── useCrud.ts                # Generic CRUD hook over the API layer
│   ├── lib/
│   │   ├── api.ts                    # Typed Supabase query helpers
│   │   └── supabase.ts               # Supabase client
│   ├── pages/
│   │   ├── AuthPage.tsx              # Sign in / sign up
│   │   ├── Dashboard.tsx             # Overview, stats, quick actions
│   │   ├── ProfilePage.tsx           # Account settings
│   │   ├── AssetsPage.tsx            # Asset Aether (in development)
│   │   ├── LocationsPage.tsx         # Locations (in development)
│   │   ├── InfrastructurePage.tsx    # Infrastructure Aether (in development)
│   │   ├── DesignerPage.tsx          # Network Aether designer (in development)
│   │   └── admin/
│   │       ├── UsersPage.tsx         # User management
│   │       └── ActivityLogPage.tsx   # Audit log
│   └── App.tsx                       # Root — layout, routing, auth gate
├── index.html
├── package.json
└── vite.config.ts
```

<br />

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS + scoped CSS-in-JS |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Typography | JetBrains Mono + Inter |

<br />

## Deployment

### Vercel *(recommended for cloud)*

1. Push to GitHub
2. Import repo into [Vercel](https://vercel.com)
3. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
4. Deploy — every push to `main` auto-deploys

### Self-hosted *(Docker — coming soon)*

```bash
# Coming soon — one command self-hosted install
docker compose up -d
```

A `docker-compose.yml` with a fully self-contained Aetheria instance is on the roadmap for teams who need on-premises deployment.

<br />

## Troubleshooting

**`Cannot GET /`**
Running the static preview without a dev server. Run `npm run dev`, or rebuild with `npm run build` then `npm run preview`.

**Blank screen after login**
Check your `.env` credentials and confirm the `profiles` table exists in Supabase with the schema: `id`, `email`, `full_name`, `role`, `created_at`.

**Supabase RLS errors**
If users can see each other's data, Row Level Security policies aren't set up. Lock down your tables in the Supabase dashboard before putting real data in.

<br />

## Contributing

Aetheria is in early development. Contributions, issues, and feature requests are welcome.

1. Fork the repo
2. Create a feature branch — `git checkout -b feature/your-aether`
3. Commit your changes
4. Open a pull request

<br />

## License

MIT — see [LICENSE](./LICENSE) for details.

---

<div align="center">

Built with purpose. Designed for every IT team.

**[aetheria.io](https://aetheria.io)** · [Report an issue](https://github.com/your-org/aetheria/issues) · [Request a feature](https://github.com/your-org/aetheria/issues/new)

</div>