# TimeVault

Plateforme de capsules temporelles numeriques chiffrees avec planification. Creez des capsules contenant des messages chiffres avec Fernet, definissez une date d'ouverture future, et partagez-les avec d'autres utilisateurs.

## Architecture

```
timevault/
├── backend/          # API FastAPI + Fernet encryption
│   ├── app/
│   │   ├── api/v1/   # Endpoints REST
│   │   ├── core/     # Auth, encryption, dependencies
│   │   ├── models/   # SQLAlchemy models (PostgreSQL)
│   │   ├── schemas/  # Pydantic schemas
│   │   ├── services/ # Business logic
│   │   └── tasks/    # Celery tasks
│   └── tests/        # Tests pytest async
├── packages/
│   ├── types/        # TypeScript shared types
│   ├── api-client/   # Axios client + React Query hooks
│   ├── ui/           # Shared UI components
│   └── utils/        # Shared utilities
├── apps/
│   └── web/          # Frontend React + Vite + Tailwind
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Backend | FastAPI, SQLAlchemy 2.0 (async), PostgreSQL |
| Encryption | Fernet (cryptography) |
| Auth | JWT (python-jose), bcrypt |
| Queue | Celery + Redis |
| Frontend | React 18, Vite, Tailwind CSS |
| API Client | Axios, TanStack React Query v5 |
| Monorepo | Turborepo, pnpm workspaces |

## Demarrage rapide

### Prerequisites

- Docker & Docker Compose
- Node.js >= 18
- pnpm >= 8

### 1. Lancer les services backend

```bash
# Demarrer PostgreSQL, Redis, API, Celery, Adminer
docker compose up -d

# Executer les migrations
docker compose exec api alembic upgrade head
```

### 2. Installer les dependances frontend

```bash
pnpm install
```

### 3. Lancer le frontend

```bash
pnpm dev:web
```

## Ports

| Service | Port | URL |
|---------|------|-----|
| API FastAPI | 48000 | http://localhost:48000 |
| Adminer (DB UI) | 48080 | http://localhost:48080 |
| Frontend Web | 3300 | http://localhost:3300 |
| PostgreSQL | 45432 | localhost:45432 |
| Redis | 46379 | localhost:46379 |

## API Endpoints

Base URL: `http://localhost:48000/api/v1`

### Authentication

| Methode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Creer un compte utilisateur |
| POST | `/auth/login` | Authentification et obtention de tokens |
| GET | `/auth/me` | Profil de l'utilisateur connecte |

### Capsules

| Methode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/capsules/create` | Creer une capsule temporelle chiffree |
| GET | `/capsules/my-capsules` | Lister mes capsules |
| GET | `/capsules/received` | Lister les capsules recues |
| GET | `/capsules/public` | Lister les capsules publiques ouvertes |
| GET | `/capsules/{id}` | Details d'une capsule (sans contenu si verrouillee) |
| POST | `/capsules/{id}/open` | Ouvrir une capsule (dechiffrer le contenu) |

### Chaines de capsules

| Methode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/chains/create` | Creer une chaine de capsules |
| GET | `/chains/my-chains` | Lister mes chaines |
| GET | `/chains/{id}` | Details d'une chaine avec ses capsules |
| GET | `/chains/{id}/progress` | Progression d'une chaine |
| POST | `/chains/{id}/add` | Ajouter une capsule a une chaine |

### Notifications

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/notifications/` | Lister les notifications |
| PUT | `/notifications/{id}/read` | Marquer une notification comme lue |
| GET | `/notifications/upcoming` | Notifications a venir |

### Dashboard

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/dashboard/stats` | Statistiques de l'utilisateur |
| GET | `/dashboard/timeline` | Timeline des evenements |
| GET | `/dashboard/upcoming` | Prochaines capsules a ouvrir |

### Health

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/health` | Verification de l'etat du service |

## Tests

### Backend

```bash
# Depuis le dossier backend/
pip install -r requirements.txt
pytest -v
```

### Documentation API interactive

Swagger UI: http://localhost:48000/docs
ReDoc: http://localhost:48000/redoc

## Variables d'environnement

Creer un fichier `.env` a la racine du projet :

```env
# Application
ENVIRONMENT=development
SECRET_KEY=votre-cle-secrete-ici
ENCRYPTION_KEY=votre-cle-fernet-base64

# Database
DATABASE_URL=postgresql+asyncpg://timevault_user:timevault_pass@db:5432/timevault

# Redis
REDIS_URL=redis://redis:6379/0

# CORS
ALLOWED_ORIGINS=http://localhost:3300,http://localhost:48000
```

## Fonctionnalites

- **Capsules chiffrees** : Le contenu est chiffre avec Fernet avant stockage en base
- **Ouverture planifiee** : Les capsules ne peuvent etre ouvertes qu'apres la date definie
- **Chaines de capsules** : Grouper des capsules en sequences ordonnees
- **Notifications** : Rappels automatiques avant l'ouverture (1 semaine, 1 jour)
- **Partage** : Envoyer des capsules a d'autres utilisateurs par email
- **Categories** : Personnel, Famille, Professionnel, Communaute
- **Dashboard** : Vue d'ensemble avec statistiques, timeline et prochaines ouvertures
