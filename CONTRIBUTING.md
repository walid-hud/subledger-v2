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

### Example: Adding a new route (comprehensive)

Use complete snippets with explicit imports and file locations.

1. Add a schema in `schemas/index.js`:

```javascript
import z from "zod";

const BillingCycleSchema = z.enum(["monthly", "yearly"]);

export const PostSubscriptionsSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1),
      price: z.number().min(0),
      billing_cycle: BillingCycleSchema,
    })
    .strict(),
});
```

2. Add route wiring in `routes/subscription.route.js`:

```javascript
import { Router } from "express";
import { authenticate, authorize, requireToken } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { PostSubscriptionsSchema } from "../schemas/index.js";
import subscriptionController from "../controllers/subscription.controller.js";

const router = Router();

router.use(requireToken, authenticate, authorize(["user"]));

router.post(
  "/",
  validate(PostSubscriptionsSchema),
  subscriptionController.createSubscription,
);

export default router;
```

3. Implement controller in `controllers/subscription.controller.js`:

```javascript
import { catchAsync } from "../middleware/global.js";
import { createUserSubscription } from "../services/subscription.service.js";
import { sendResponse } from "../utils/response.js";

export const createSubscription = catchAsync(async (req, res) => {
  const userId = String(req.user.id);
  const created = await createUserSubscription(userId, req.body);
  return sendResponse(res, 201, created, "Subscription created");
});

export default {
  createSubscription,
};
```

4. Keep DB logic in service (`services/subscription.service.js`):

```javascript
import Subscription from "../models/Subscription.model.js";
import User from "../models/User.model.js";
import { NotFoundError } from "../utils/errors.js";

export const createUserSubscription = async (userId, payload) => {
  const user = await User.findById(userId, "_id");
  if (!user) {
    throw new NotFoundError("User not found");
  }

  return await Subscription.create({
    ...payload,
    user: user._id,
  });
};
```

5. Mount the router in `index.js`:

```javascript
import subscriptionRoutes from "./routes/subscription.route.js";

server.use("/subscriptions", subscriptionRoutes);
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

