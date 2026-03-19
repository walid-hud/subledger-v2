import mongoose from "mongoose";
import User from "../models/User.model.js";
import { ConflictError, NotFoundError } from "../utils/errors.js";

export const createUser = async (userData) => {
  const userExists = await User.findOne({ email: userData.email });
  if (userExists) {
    throw new ConflictError("A user with this email already exists");
  }
  const user = await User.create(userData);
  return await user.save();
};

export const getUser = async (query, project) => {
  const filter = query.id ? { _id: query.id } : { email: query.email };
  const user = await User.findOne(filter, project || undefined);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};



