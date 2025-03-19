// ALL ROUTES ARE WORKING
import Cart from "../models/cart.model.js";

const addToCart = async (req, res) => {
  const { id: userId } = req.params;
  const { ProductId, totalprice, quantity } = req.body;
  try {
    let existingProduct = await Cart.findOne({ userId, ProductId });
    let count = await Cart.countDocuments({ userId });

    if (existingProduct) {
      existingProduct.totalprice += totalprice;
      existingProduct.quantity += 1;
      await existingProduct.save();
    } else {
      const newCart = new Cart({ userId, ProductId, totalprice, quantity });
      await newCart.save();
      count = await Cart.countDocuments({ userId });
    }
    
    res.status(200).json({ message: "Success", count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeProductFromCart = async (req, res) => {
  const { id: itemId } = req.params;
  const { userid: userId } = req.body;
  try {
    const cart = await Cart.findByIdAndDelete(itemId);
    if (!cart) return res.status(404).json("Cart not found");
    
    const count = await Cart.countDocuments({ userId });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchUserCart = async (req, res) => {
  const { id: userId } = req.params;
  try {
    const userCart = await Cart.find({ userId }).populate({
      path: "ProductId",
      select: "name price quantity imageurl",
    });
    res.status(200).json(userCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const clearUserCart = async (req, res) => {
  const { id: userId } = req.params;
  try {
    await Cart.deleteMany({ userId });
    const count = await Cart.countDocuments({ userId });
    
    res.status(200).json({ count, message: "Success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCartCount = async (req, res) => {
  const { id: userId } = req.params;
  try {
    const count = await Cart.countDocuments({ userId });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const decrementProductQty = async (req, res) => {
  const { id: userId } = req.params;
  const { Productid, totalprice } = req.body;
  try {
    let existingProduct = await Cart.findOne({ userId, ProductId: Productid });
    if (!existingProduct) return res.status(404).json({ message: "Product not found in cart" });

    if (existingProduct.quantity > 1) {
      existingProduct.quantity -= 1;
      existingProduct.totalprice -= totalprice;
      await existingProduct.save();
    } else {
      await Cart.findByIdAndDelete(existingProduct._id);
    }

    const count = await Cart.countDocuments({ userId });
    res.status(200).json({ message: "Success", count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { addToCart, removeProductFromCart, fetchUserCart, clearUserCart, getCartCount, decrementProductQty };
