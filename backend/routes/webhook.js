const router = require("express").Router();
const bodyParser = require("body-parser");
const crypto = require("crypto");
const Payment = require("../models/Payment");

router.post(
  "/razorpay",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(req.rawBody);
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("Request is legit");
      const event = JSON.parse(req.rawBody);

      try {
        if (event.event === "payment.captured") {
          const paymentDetails = event.payload.payment.entity;

          await Payment.findOneAndUpdate(
            { paymentId: paymentDetails.id },
            { status: "success" },
            { new: true }
          );

          console.log("Payment success");
        } else if (event.event === "payment.failed") {
          const paymentDetails = event.payload.payment.entity;
          await Payment.findOneAndUpdate(
            { paymentId: paymentDetails.id },
            { status: "failed" },
            { new: true }
          );
        }

        res.json({ status: "ok" });
      } catch (error) {
        console.error("Error handling webhook event:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    } else {
      res.status(400).json({ message: "Invalid signature" });
    }
  }
);

module.exports = router;