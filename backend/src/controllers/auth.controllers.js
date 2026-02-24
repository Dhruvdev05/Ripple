import User from "../models/User.js"
import jwt from "jsonwebtoken"
import { upsertStreamUser } from "../lib/stream.js";

export async function signup(req, res) {
 const { fullName, email, password } = req.body;

 try {
    if (!fullName || !email || !password) {
        return res.status(400).json({message: "All fields are required"})
    }
    if (password.length < 6) {
        return res.status(400).json({message: "Password must be at least 6 characters long"})
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne( { email })
    if (existingUser){
        return res.status(400).json({message: "Email already in use"})
    }

    const idx = Math.floor(Math.random() * 100) + 1 ;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

const newUser = await User.create({
    email,
    fullName,
    password,
    profilePic: randomAvatar,     
})

try {
    await upsertStreamUser({
    id: newUser._id.toString(),
    name: newUser.fullName,
    image: newUser.profilePic || "" ,
});
console.log(`stream user created or updated successfully ${newUser.fullName}`);
} catch (error) {
    console.log("Error creating/updating Stream user:", error);
}


const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })

res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // Set secure flag in production
})

res.status(201).json({success: true, user: newUser })

 }catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({message: "All fields are required"})
        }

        const user = await User.findOne({ email });
        if (!user) {
          return  res.status(400).json({message: "Invalid credentials"})
        }

        const isPasswordCorrect = await user.matchpassword(password);
        if (!isPasswordCorrect) {
           return res.status(400).json({message: "Invalid credentials"})
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production", // Set secure flag in production
        })

        res.status(200).json({success: true, user})

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    } 
}
export function logout(req, res) {
   res.clearCookie("jwt")
   res.status(200).json({success: true , message : "logout successful"})
}

export async function onboard(req, res) {
try {
    const userId = req.user._id;

    const {fullName, location , nativeLanguage, learningLanguage , bio} = req.body;
 
    if (!fullName || !location || !nativeLanguage || !learningLanguage || !bio) {
        return res.status(400).json({
            message: "All fields are required",
            missingFields: [
            !fullName && "fullName",
            !location && "location",
            !nativeLanguage && "nativeLanguage",
            !learningLanguage && "learningLanguage",
            !bio && "bio"
        ].filter(Boolean),
        });
    }

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                ...req.body,
                isOnboarded: true,

            },
            {new: true}
        );
        if (!updateUser) return res.status(404).json({message : "user not found"})
   try {
    await upsertStreamUser({
        id: updateUser._id.toString(),
        name: updateUser.fullName,
        image: updateUser.profilePic || "",

    });
    console.log(`stream user updated after onboarding for ${updateUser.fullName}`);

   } catch (streamError) {
    console.log("Error updating stream user during onboarding : " ,streamError.message)
   }

 res.status(200).json({ success: true, user: updateUser });
} catch (error) {
     console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  
}
}
