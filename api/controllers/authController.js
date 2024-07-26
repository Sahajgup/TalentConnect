import Users from "../models/userModel.js";
import bcrypt from "bcryptjs";



export const google = async (req, res, next) => {
  try {
    const user = await Users.findOne({ email: req.body.user.email })
    
    if (user) {
      const token = user.createJWT();
      user.password = undefined;    
      const newUser = user;

        res.status(201).json({
          success: true,
          message: "Login successfully",
          newUser,
          token,
        });

    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new Users({ name: req.body.user.displayName.split(" ").join("").toLowerCase()  , email: req.body.user.email, password: hashedPassword, image: req.body.user.photoURL });
      await newUser.save();
      const token = await newUser.createJWT();
      newUser.password = undefined;
      res.status(201).json({
        success: true,
        message: "Login successfully",
        newUser,
        token,
      });

    }
  } catch (error) {
    next(error)
  }
}


export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(name,email,password);


  if (!name) {
    next("name is required");
  }

  if (!email) {
    next("Email is required");
  }
  
  if (!password  ) {
    next("Password is required");
  }

  if (password.length() <= 6) {
    next("Password length must be greater than 6");
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      next("Email Address already exists");
      return;
    }

    const user = await Users.create({
      name,
      email,
      password,
    });

    
    const token = await user.createJWT();

    res.status(201).send({
      success: true,
      message: "Account created successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(404).json({ message: error.message });
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //validation
    if (!email || !password) {
      next("Please Provide AUser Credentials");
      return;
    }

    // find user by email
    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      next("Invalid -email or password");
      return;
    }

    // compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      next("Invalid email or password");
      return;
    }

    user.password = undefined;
    
    const token = user.createJWT();
    res.status(201).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};



export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};