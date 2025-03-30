const express = require("express");
const crypto = require("crypto");                 
const Razorpay = require("razorpay");
const { json } = require("stream/consumers");
const cors = require("cors");
require("dotenv").config();
const nodemailer = require("nodemailer");
const PORT = process.env.PORT;


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

app.post('/orders', async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.API_KEY,
            key_secret: process.env.API_SEC
        });

        console.log(process.env.API_KEY);

        const options = req.body;
        const orders = await razorpay.orders.create(options);

        if (!orders) {
            return res.status(500).send("Error creating order");
        }

         let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "darshanjadhav725@gmail.com",
          pass: "pham jnmy hxle hehe"
        }
      });


      let mailOptions = {
        from: 'Advanced Smart Health Supplies Vending Systems',
        to: "darshanjadav65@gmail.com",
        subject: 'Thank You for Your Purchase!',
        html: `
            <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #f4f7fc; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #3a79d0; font-size: 28px; text-align: center;">Thank You for Your Purchase!</h2>
                    <p style="font-size: 16px; color: #555; text-align: center;">Hi <strong></strong>,</p>
                    <p style="font-size: 16px; color: #555; text-align: center;">We are excited to inform you that your medicine order has been successfully processed.</p>
                    
                    <p style="font-size: 16px; color: #555; margin-top: 20px;">You can view your order status or contact us for support through your dashboard:</p>
                    <a href="https://yourwebsite.com/dashboard" 
                       style="display: inline-block; padding: 12px 24px; background-color: #3a79d0; color: white; font-size: 16px; text-decoration: none; text-align: center; border-radius: 5px; margin: 10px 0;">
                        Go to Dashboard
                    </a>
    
                    <p style="font-size: 16px; color: #555;">If you have any questions, feel free to <a href="mailto:support@yourwebsite.com" style="color: #3a79d0;">contact us</a>.</p>
    
                    <p style="font-size: 16px; color: #555; text-align: center; margin-top: 30px;">Thank you for choosing <strong>Advanced Smart Health Supplies Vending Systems</strong> for your health needs. We wish you a speedy recovery!</p>
    
                    <footer style="font-size: 14px; color: #aaa; text-align: center; margin-top: 30px;">
                        <p>This email was sent from <a href="https://yourwebsite.com" style="color: #3a79d0;">Advanced Smart Health Supplies Vending Systems</a>.</p>
                    </footer>
                </div>
            </div>
        `
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Email sending error: ", error);
            return res.status(500).json({ success: false, message: error.message });
        }
        console.log("Email sent: ", info);
        res.status(200).json({
            success: true,
            message: "Email sent successfully",
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id
        });
    });

        res.status(200).send(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});
// app.post("/orders/validate", (req, res) => {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//         return res.status(400).json({ msg: "Missing required fields" });
//     }

//     const sha = crypto.createHmac("", process.env.API_SEC);
//     sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
//     const digest = sha.digest("hex");

//     if (digest !== razorpay_signature) {
//         return res.status(500).json({ msg: "Transaction is invalid" });
//     }

   
    
//       });




app.listen(PORT,()=>{
    console.log(`serving on port ${PORT}`);
})
