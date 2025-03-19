import express from "express";
import cartController from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/addtocart/:id", cartController.addToCart);
router.get("/:id", cartController.fetchUserCart);
router.delete("/:id", cartController.removeProductFromCart);
router.delete("/clearcart/:id", cartController.clearUserCart);
router.get("/count/:id", cartController.getCartCount);
router.post("/decrement/:id", cartController.decrementProductQty);

export default router;
