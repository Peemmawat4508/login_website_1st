import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const portfolioSchema = new mongoose.Schema({
  fullName: String,
  title: String,
  bio: String,
  skills: [String],
  education: [{
    school: String,
    degree: String,
    year: String
  }],
  experience: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    link: String
  }],
  contact: {
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String
  }
});

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  portfolio: mongoose.Schema.Types.ObjectId;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  portfolio: portfolioSchema
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User; 