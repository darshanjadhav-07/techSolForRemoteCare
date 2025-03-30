import React, { useState } from 'react';
import './App.css';

function Pay() {
    const [cart, setCart] = useState([]);
    const [amount, setAmount] = useState(0);
    const currency = "INR";

    const medicines = [
        { id: 1, name: 'Paracetamol', price: 50 },
        { id: 2, name: 'Ibuprofen', price: 80 },
        { id: 3, name: 'Cough Syrup', price: 120 },
    ];

    const addToCart = (medicine) => {
        const existingItem = cart.find(item => item.id === medicine.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...medicine, quantity: 1 }]);
        }
        setAmount(prevAmount => prevAmount + medicine.price);
    };

    const removeFromCart = (medicine) => {
        const existingItem = cart.find(item => item.id === medicine.id);
        if (existingItem.quantity > 1) {
            setCart(cart.map(item =>
                item.id === medicine.id ? { ...item, quantity: item.quantity - 1 } : item
            ));
        } else {
            setCart(cart.filter(item => item.id !== medicine.id));
        }
        setAmount(prevAmount => prevAmount - medicine.price);
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/orders', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                amount,
                currency,
                receipt: "receipt_" + Date.now()
            })
        });

        const order = await response.json();
        console.log(order.id);

        const options = {
            "key": "rzp_test_4QosC4KA1OgYAj",
            amount: (amount*100),
            currency,
            "name": "Darshan Jadhav",
            "description": "Medicine Purchase",
            "order_id": order.id,
            "handler": function (response) {
                console.log(response);
                alert("Thank for purchasing");
            },
            "prefill": {
                "name": "Darshan Jadhav",
                "email": "darshanjadav65@example.com",
                "contact": "7795057952"
            },
            "theme": {
                "color": "#f05454"
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            alert('Payment Failed: ' + response.error.description);
        });
        rzp1.open();
    };

    return (
        <>
        <h1>ADVANCED SMART HEALTH SUPPLIES VENDING SYSTEMS</h1>
        <div style={styles.container}>
        {/* <a href="http://192.168.224.155/Servo1ON">click</a> */}
            {/* Medicine List */}
            <div style={styles.medicineList}>
                <h2 style={styles.heading}>Available Medicines</h2>
                {medicines.map(medicine => (
                    <div key={medicine.id} style={styles.medicineItem}>
                        <span>{medicine.name} - ₹{medicine.price}</span>
                        <button onClick={() => addToCart(medicine)} style={styles.addButton}>
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            {/* Cart */}
            <div style={styles.cart}>
                <h2 style={styles.heading}>Your Cart</h2>
                {cart.length > 0 ? (
                    <>
                        {cart.map(item => (
                            <div key={item.id} style={styles.cartItem}>
                                <span>{item.name} (x{item.quantity})</span>
                                <span>₹{item.price * item.quantity}</span>
                                <button onClick={() => removeFromCart(item)} style={styles.removeButton}>
                                    Remove
                                </button>
                            </div>
                        ))}
                        <h3 style={styles.total}>Total: ₹{amount}</h3>
                        <button onClick={handlePayment} style={styles.payButton}>
                            PAY ₹{amount}
                        </button>
                    </>
                ) : (
                    <p style={styles.emptyCart}>Your cart is empty</p>
                )}
            </div>
        </div>
        </>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
        backgroundColor: '#121212',
        color: '#fff',
        height: '100vh',
    },
    medicineList: {
        flex: 1,
        padding: '20px',
        backgroundColor: '#1e1e1e',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        marginRight: '10px',
    },
    heading: {
        color: '#f05454',
        marginBottom: '20px',
    },
    medicineItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        borderBottom: '1px solid #333',
        paddingBottom: '10px',
    },
    addButton: {
        backgroundColor: '#4caf50',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        padding: '5px 10px',
        cursor: 'pointer',
    },
    cart: {
        flex: 1,
        padding: '20px',
        backgroundColor: '#1e1e1e',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    cartItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        borderBottom: '1px solid #333',
        paddingBottom: '10px',
    },
    removeButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        padding: '5px 10px',
        cursor: 'pointer',
    },
    payButton: {
        backgroundColor: '#f05454',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        padding: '10px 20px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    emptyCart: {
        color: '#aaa',
    },
    total: {
        marginTop: '20px',
        fontSize: '1.2rem',
        color: '#fff',
    },
};

export default Pay;
