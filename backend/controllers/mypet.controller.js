import mypet from "../models/mypet.js";
import jwt from "jsonwebtoken";
import Crtpto from "crypto-js";
const myPetController = {
  createpet: async (req, res) => {
    const userid = req.params.id;
    const Mypet = req.body;
    try {
      const newMypet = new mypet({
        petname: Mypet.petname,
        userid: userid,
        password: Crtpto.AES.encrypt(
          Mypet.password,
          process.env.SECRET_KEY
        ).toString(),
        Bread: Mypet.bread,
        category: Mypet.category,
        Gender: Mypet.Gender,
        quality: Mypet.quality,
      });
      await newMypet.save();
      res.status(201).json({ message: "Success" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  loginuser: async (req, res) => {
    try {
      const myPet = await mypet.findOne({ petname: req.body.petname });
      if (!myPet) {
        return res
          .status(401)
          .json({ message: "Wrong credentials provided a valid petname" });
      }
      const decryptedpassword = Crtpto.AES.decrypt(
        myPet.password,
        process.env.SECRET_KEY
      );
      console.log(myPet._id);
      const decryptedpass = decryptedpassword.toString(Crtpto.enc.Utf8);
      if (decryptedpass !== req.body.password) {
        return res.status(401).json("wrong password provided");
      }
      const userToken = jwt.sign(
        {
          petname: myPet.petname,
          userid: myPet.userid,
          Bread: myPet.bread,
          category: myPet.category,
        },
        process.env.SECRET_KEY_jWT,
        { expiresIn: "3d" }
      );

      const { password, __v, createdAt, ...mypetData } = myPet._doc;
      res.status(200).json({ ...mypetData, token: userToken,});
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

export default myPetController;