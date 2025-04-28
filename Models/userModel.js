import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
    name : {
        type : String,  
        trim : true,
        required : [true , 'Name is required'],
        maxlength : [50 , 'Name must be less than 50 characters'],
        minlength : [3 , 'Name must be greater than 3 characters']
    },
    phone :{ 
        type : String,
        required : [true , 'Phone Number is required']
       },
    email : {
        type : String,
        required : [true , 'Email Address is required'],
        lowercase : true,
        unique : true,
    },
    password : {
        type : String,
        minlength : [5, ' passwords must be greater than 5'],
        required : [true , 'Password is required']
    },
    profile_picture : {
        type : String,
        default: "https://res.cloudinary.com/dhddxcwcr/image/upload/v1700416252/6558f05c2841e64561ce75d1_Cover.jpg"
    },
    status : {
        type : String,
        enum : ['online', 'offline'],
        default : 'offline'
    },
    about :{
        type : String,
        default : 'Hey friends , I am using chat app',   
    },
    lastOnline : {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiration: Date,
    passwordResetVerified : Boolean,
    isVerified: Boolean,
      verificationCode : String,
      verificationCodeExpiresAt: Date 

 },{ timestamps: true });
     
 userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model('User',userSchema);

export default User;

