import JWT from "jsonwebtoken";
import Users from "../models/userModel.js";

export const userAuth = async (req, res, next) => {
  console.log(req.user)
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    next("Authentication== failed");
  }

  const token = authHeader?.split(" ")[1];

  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);

    req.body.user = {
      userId: userToken.userId,
    };

    next();
  } catch (error) {
    console.log(error);
    next("Authentication failed");
  }
};

export const adminAuth = async (req, res, next) => {
  const id = req.body.user.userId;
  let user = await Users.findById(id);
  if (user.accountType !== "admin") {
    return res.status(403).json({ message: "Forbidden. Only admin users are allowed to perform this action." });
  }
  next();
};

export default {userAuth,adminAuth};
