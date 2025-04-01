import mongoose, { mongo } from "mongoose";


const userschema = mongoose.Schema(
    {
        email :{
            type :String,
            require : true,
            unique : true,
        },
        fullname :{
            type : String ,
            require : true,
        },
        password:{
            type :String,
            require : true,
            minlength : 6,
        },
        address: {
            name: String,
            phone: String,
            HouseNo: String,
            Area: String,
            Landmark: String,
            Pincode: String,
            Towncity: String,
            State: String,
          },
        profilepic:{
            type:String,
            default:"https://unsplash.com/photos/guy-fawkes-mask-VS2C5_GI_MM",
        },
        userType: {
            type: String,
            default: "Client",
            enum: ["Admin", "Vendor", "Driver", "Client"],
          },
          phone: {
            type: String,
            unique: true,
          },
    },
    {timestamps:true}
);

const User = mongoose.model("User", userschema);

// even if we give User it create a model as  users

export default User;