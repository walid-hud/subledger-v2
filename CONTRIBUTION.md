# Contribution Guide


## Tech stack

- Runtime: Node.js (ES modules)
- Framework: Express 5
- Database: MongoDB + Mongoose
- Validation: Zod
- Auth: JWT + role-based middleware

## Project layout

```
config/         # environment loading and DB connection
controllers/    # request handlers
middleware/     # auth, validation, global error handling
models/         # Mongoose models
routes/         # route definitions
schemas/        # Zod schemas for request/token validation
services/       # business logic and DB operations
utils/          # response helpers, custom errors, password helpers
scripts/        # utility scripts (example: clear DB)
index.js        # server entrypoint
```


## Local development

1. Clone the repository:

```bash
git clone https://github.com/walid-hud/subledger-v2.git
cd subledger-v2
```

2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
cp .env.example .env
```

If you are on Windows PowerShell and `cp` is not available:

```powershell
Copy-Item .env.example .env
```

4. Fill `.env` values (see required variables below).

5. Start the server.
```bash
npm run dev
```

6. Verify server health:

```bash
curl http://localhost:3000/health
```

## Environment variables

Validated in `config/env.js`:

- `PORT` (default: `3000`)
- `MONGODB_URI` (required)
- `MONGODB_DB_NAME` (default: `subledger_v1`)
- `JWT_SECRET_KEY` (required, min length 32)
- `JWT_EXPIRES_IN` (default: `1h`)

## Current routes 

Mounted in `index.js`:

- `POST /auth/signup`
- `POST /auth/login`
- `GET /health`

## Coding conventions

### Request flow

Follow this pattern for new endpoints:

1. Add/extend a Zod schema in `schemas/index.js`.
2. Add route in the corresponding `routes/*.js` file using `validate(schema)` when needed.
3. Implement controller in `controllers/*.js` and wrap with `catchAsync`.
4. Place DB/business logic in `services/*.js`.
5. Return responses through `sendResponse`.

### Error handling

- Throw custom errors from `utils/errors.js` (`NotFoundError`, `UnauthorizedError`, `ValidationError`, etc.).
- Let `globalErrorHandler` in `middleware/global.js` format the response.
- Do not send ad-hoc error JSON in controllers.

### Authentication and authorization

- Use `requireToken` to extract Bearer token.
- Use `authenticate` to verify JWT and validate payload with `JwtUserSchema`.
- Use `authorize(["role"])` for role checks.

### Validation

- All request body/params/query validation should happen in `middleware/validate.js` with Zod schemas.
- Prefer strict object schemas (`.strict()`) to prevent unknown payload fields.

### example: Adding a new route
1. Define a Zod schema in `schemas/index.js`:

```javascript
    createTransactionSchema: z.object({
      subscriptionId: z.string().length(24),
      amount: z.number().positive(),
      name: z.string().max(255),
      billingCycle: z.enum(["monthly", "yearly"]),
    }),
```
2. Add route in `routes/transactions.js`:

```javascript
    router.post(
      "/",
      validate(createTransactionSchema),
      requireToken,
        authenticate,
        authorize(["user"]),
        catchAsync(transactionsController.createTransaction)
    );
```

3. Implement controller in `controllers/transactions.js`:

```javascript
    async function createTransaction(req, res) {
      const { subscriptionId, amount, name } = req.body;
      const userId = req.user.id;

      const transaction = await transactionsService.createTransaction({
        userId,
        subscriptionId,
        amount,
        name,
      });

      sendResponse(res, 201, true, transaction, null, "Transaction created");
    }
```





## Git workflow

1. Create a branch:

```bash
git checkout -b feature/short-description
```

2. Commit focused changes:

```bash
git add .
git commit -m "feat: add ..."
```

3. Push branch:

```bash
git push origin feature/short-description
```

4. Open a pull request to `main`.

## Pull request checklist

- Feature works locally with real request flow.
- New/updated routes are mounted in `index.js`.
- Input is validated with Zod schemas.
- Errors use the shared error classes.
- Response format uses `sendResponse`.
- No secrets committed.
- OpenAPI spec (`openapi.json`) updated if API contracts changed.

