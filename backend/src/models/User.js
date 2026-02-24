import mongoose from "mongoose";
import bycrypt from "bcryptjs";



const userSchema = new mongoose.Schema({
fullName: {
    type: String,
    required: true,
},
email: {
    type: String,
    required: true,
    unique: true,
},
password: {
    type: String,
    required: true, 
    minlength: 6,
},
bio: {
    type: String,
    default: "",
},
profilePic: {
    type: String,
    default: "",
},
nativeLanguage: {
    type: String,
    default: "",
},  
learningLanguage: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
     friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
}, { timestamps: true })

userSchema.pre('save', async function (next) {
if(!this.isModified('password')) return next();

try {
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
    next();
} catch (error) {
    next(error);
}
})

userSchema.methods.matchpassword = async function (enteredPassword) {
    const isPasswordCorrect = await bycrypt.compare(enteredPassword, this.password);
    return isPasswordCorrect; 
}

const User = mongoose.model("User", userSchema);



export default User;