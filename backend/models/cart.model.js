
import mongoose from "mongoose"
const Cartschema = new mongoose.Schema({

    userId:{ type:mongoose.Schema.Types.ObjectId, ref:"User"},
    ProductId:{type:mongoose.Schema.Types.ObjectId, ref:"Accessories"},
    addtivies:{type:[]},
    quantity:{type:Number,required:true},
    totalprice:{type:Number,required:true}

}, { timestamps: true });

const Cart = mongoose.model("Cart",Cartschema);
export default Cart

