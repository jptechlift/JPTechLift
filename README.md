# JPTechLift Architecture

This repository contains a sample full‑stack application split into a **Backend** ASP.NET Core API and a **frontend** React SPA.

## Backend

The backend follows a classic MVC pattern:

- `Backend/Controllers` exposes HTTP endpoints.
- `Backend/Services` holds business logic (`BlogService`, `AiBlogService`).
- `Backend/Repositories` encapsulate data access using `ApplicationDbContext`.
- `Backend/Dtos` contains request/response models grouped by feature (e.g. `Auth`, `Blog`).
- `Backend/Helpers` provides small utility classes such as `SlugHelper`.

### Running

```bash
cd Backend
# dotnet run (requires .NET 8 SDK)
```

Before running, copy `appsettings.Development.json.example` to
`appsettings.Development.json` and update the connection string and JWT
secret to match your environment. `.env` files are also loaded at startup
via `DotNetEnv` if you prefer environment variables.


## Frontend

The React app lives under `frontend/src` with the following structure:

- `components/` – reusable UI pieces.
- `pages/` – routeable pages.
- `services/` – API clients and tests under `services/__tests__`.
- `hooks/`, `utils/`, `styles/`, `assets/` – support code and resources.

### Running

```bash
cd frontend
npm install
npm run dev
```

## Testing

Run backend and frontend tests:

```bash
dotnet test       # .NET SDK required
npm test          # runs ESLint and Vitest
```