import { catchAsync } from "../middleware/global.js";
import { createUser, getUser } from "../services/user.service.js";
import { AppError, UnauthorizedError } from "../utils/errors.js";
import { sendResponse } from "../utils/response.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateToken } from "../services/jwt.service.js";

const login = catchAsync(async (req, res) => {
  const { password, email } = req.body;
  const user = await getUser({ email }, { __v: 0, subscriptions: 0 });
  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) {
    throw new UnauthorizedError("Invalid credentials password");
  }
  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });
  return sendResponse(res, 200, {
    user: { ...user.toObject(), password_hash: undefined },
    token,
  });
});

const signup = catchAsync(async (req, res) => {
  const { username, email, password, role } = req.body;
  const password_hash = await hashPassword(password);
  const user = await createUser({ username, email, password_hash, role });
  if (!user) {
    throw new AppError(400, "INTERNAL_ERROR", "Failed to create user");
  }
  return sendResponse(res, 201, {
    user: { ...user.toObject(), password_hash: undefined },
  });
});

export default { login, signup };
