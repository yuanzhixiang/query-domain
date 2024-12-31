# Sitemap Monitor

A Next.js application designed to monitor website sitemaps for new content, specifically focusing on tracking and analyzing new game releases.

## Project Structure

```
sitemap-monitor/
├── app/                      # Next.js app directory
│   ├── actions/             # Server actions
│   │   └── sites/          # Site-related actions
│   ├── fonts/              # Web fonts
│   ├── sites/              # Site-related pages
│   │   ├── (overview)/    # Site list page
│   │   └── [siteId]/      # Site detail page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── sites/            # Site-related components
│   └── ui/               # shadcn/ui components
├── docs/                  # Documentation
│   └── sql/             # Database schemas and queries
├── hooks/                # Custom React hooks
│   ├── use-mobile.tsx   # Mobile detection hook
│   └── use-toast.ts     # Toast notification hook
├── lib/                  # Shared utilities
│   ├── utils/           # Utility functions
│   └── validations/     # Validation schemas
├── prisma/               # Database schema and migrations
│   ├── migrations/      # Database migrations
│   └── schema.prisma    # Prisma schema
└── public/              # Static assets
```

## Tech Stack

- **Framework**: Next.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (all components pre-installed in `components/ui`)
- **Form Management**: React Hook Form
- **Validation**: Zod

## Environment Setup

The application supports different environments through environment-specific configuration files:

- `.env.development` - Development environment settings
- `.env.production` - Production environment settings
- `.env.example` - Example configuration template

Key configuration categories:

1. Database

   - Connection URL with environment-specific schemas
   - Credentials and connection parameters

2. Application

   - Base URL for the application
   - Environment-specific features

3. Monitoring

   - Check intervals
   - Concurrent request limits
   - Rate limiting settings

4. Environment Specific
   - Debug mode
   - Logging level
   - Caching settings

To set up the environment:

1. Copy `.env.example` to create your environment file:

   ```bash
   cp .env.example .env.development   # For development
   cp .env.example .env.production    # For production
   ```

2. Update the configuration values in your environment file

3. Set the `NODE_ENV` environment variable:

   ```bash
   # For development
   export NODE_ENV=development

   # For production
   export NODE_ENV=production
   ```

## Database Design

### Table Design Rules

Each database table must follow these structural rules:

1. Base Fields (in order)

   - `id`: Primary key, auto-incrementing integer
   - `createdAt`: Creation timestamp
   - `updatedAt`: Last update timestamp
   - `deletedAt`: Soft deletion timestamp (nullable)

2. These base fields must be the first four fields in every table
3. All timestamps must use the PostgreSQL `TIMESTAMP` type
4. All tables must support soft deletion through the `deletedAt` field

The application uses a hybrid storage approach combining structured and unstructured data storage. See the complete database schema in [docs/sql/schema.sql](docs/sql/schema.sql)

### Database Migrations

The project uses different migration strategies for development and production environments:

#### Development Environment

Development migrations are designed for rapid iteration and testing:

```bash
# Create a new migration after schema changes
pnpm db:dev:migrate

# Reset the database (⚠️ This will delete all data)
pnpm db:dev:reset
```

#### Production Environment

Production migrations are managed carefully to preserve data:

```bash
# Check migration status
pnpm db:prod:status

# Deploy pending migrations
pnpm db:prod:deploy
```

⚠️ **Important Notes:**

1. Never run development migrations in production
2. Always backup production data before migrations
3. Test migrations in development first
4. Review migration files for data safety

## Error Code Design

The application uses a standardized error code system:

### Success Code (0)

- `0`: Operation successful

### General Errors (1000-1999)

- `1000`: Unknown error - Unexpected system errors
- `1001`: Validation error - Input data validation failed

### Site Related Errors (2000-2999)

- `2000`: Site not found - Requested site does not exist
- `2001`: Duplicate domain - A site with the same domain already exists
- `2002`: Invalid domain - The provided domain name is invalid

### Error Response Format

All API responses follow this format:

```typescript
interface ActionResponse<T = undefined> {
  code: number; // Error code
  data?: T; // Optional response data
}
```

Example success response:

```json
{
  "code": 0,
  "data": {
    "id": 123
  }
}
```

Example error response:

```json
{
  "code": 2001,
  "data": undefined
}
```

## Development Guidelines

1. All code and documentation must be written in English
2. Always use pnpm for package management
3. Error Code Usage:
   - Always use `ErrorCodes` enum values from `@/lib/error-codes`
   - Never use numeric constants for error codes
   - If a new error code is needed, add it to the `ErrorCodes` enum and `ErrorMessages` mapping
   - Error codes are categorized by feature area:
     - 0: Success
     - 1000-1999: General errors
     - 2000-2999: Site related errors
4. UI Component Usage:
   - All shadcn/ui components are pre-installed in `@/components/ui`
   - Custom hooks are located in `@/hooks` directory
   - Always use shadcn/ui components whenever possible
   - Only use third-party components when shadcn/ui doesn't provide the required functionality
   - Keep UI consistent by using the same design system throughout the application
   - Follow shadcn/ui's best practices and patterns
   - Reference: [shadcn/ui documentation](https://ui.shadcn.com/docs)

## Git Workflow

### Branch Naming Convention

Development branches follow this pattern:

```
develop/<create_date>/<description>
```

Example:

```
develop/20241119/add-search-feature
```

Where:

- `<create_date>`: Date in YYYYMMDD format when the branch was created
- `<description>`: Brief description of the feature or change, using kebab-case

### Branch Strategy

1. Main Branch

   - `main`: Production-ready code
   - Protected branch, requires pull request and review
   - Only accepts squash and merge from development branches

2. Development Branches
   - Created from `main`
   - Used for feature development, bug fixes, or improvements
   - Merged back to `main` using squash and merge
   - Deleted after successful merge

### Merge Rules

1. Commit Message Format

   ```
   <type>: <description>
   ```

   Where `type` is one of:

   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, missing semi colons, etc)
   - `refactor`: Code refactoring
   - `test`: Adding tests
   - `chore`: Maintenance tasks

2. Merge Process

   - Development branches must be up-to-date with `main` before merging
   - All merges to `main` must use squash and merge
   - The squash commit message should follow the commit message format
   - After successful merge, delete the development branch

3. Code Review Requirements
   - All changes must be reviewed before merging
   - Changes must pass all automated tests
   - Code style and documentation requirements must be met
   - Reviewers should focus on:
     - Code correctness
     - Performance implications
     - Security considerations
     - Documentation completeness
     - Test coverage
