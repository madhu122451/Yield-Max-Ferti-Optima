const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/shopDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.log("❌ Error connecting to MongoDB:", err));

// Order Schema
const orderSchema = new mongoose.Schema({
    items: [
        {
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    totalAmount: Number, // Store total price
    date: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

// API to place an order
app.post("/api/order", async (req, res) => {
    try {
        const { items, totalAmount } = req.body;

        // Check if cart is empty
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty. Cannot place order." });
        }

        // Save order to MongoDB
        const order = new Order({ items, totalAmount });
        await order.save();

        res.status(200).json({ message: "✅ Order placed successfully!", order });
    } catch (error) {
        res.status(500).json({ message: "❌ Error placing order", error });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
