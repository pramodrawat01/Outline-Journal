import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 24,
      match: [
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers, and underscores",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false, // never return password by default
    },
    agreedToTerms: {
      type: Boolean,
      required: true,
      validate: {
        validator: (v) => v === true,
        message: "You must agree to the Terms of Service and Privacy Policy",
      },
    },
    profession: { type: String, trim: true, maxlength: 80 },
    bio: { type: String, trim: true, maxlength: 280 },
    avatarUrl: { type: String, default: '' },
    interests: { type: [String], default: [] },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    preferences: {
      defaultEntryVisibility: { type: String, enum: ['public', 'private'], default: 'private' },
      weeklyGoal: { type: Number, min: 1, max: 7, default: 3 },
    },
    onboardingCompleted: { type: Boolean, default: false },
    onboardingStep: { type: Number, default: 1 },
    
    currentlyReading: { type: String, trim: true, maxlength: 80, default: '' },
    sideProject: { type: String, trim: true, maxlength: 80, default: '' },
    exploring: { type: String, trim: true, maxlength: 120, default: '' },
  },
  { timestamps: true }
);

// Hash the password before saving, only if it changed
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to check a plaintext password against the hash
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;