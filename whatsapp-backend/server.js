require('dotenv').config()
const express = require('express')
var cors = require('cors')
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const mongoose = require('mongoose');

const app = express()
app.use(cors())
app.use(express.json())


let client;
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to mongo")

    client = new Client({
        authStrategy: new LocalAuth(),
    });

    client.on('remote_session_saved', () => {
        console.log("remote session saved")
    })

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Client is ready!');
    });

    client.on('disconnected', () => {
        console.log('Client is disconnected!');
    });

    client.on('authenticated', () => {
        console.log('Client is authenticated!');
    });

    client.on('auth_failure', () => {
        console.log('Client is auth_failure!');
    });

    client.on('message', async (message) => {
        const chat = await message.getChat()
        if (!chat.isGroup && message.hasQuotedMsg) {
            const regex = /Payment Id: (\w+)/;
            const qmessage = await message.getQuotedMessage()
            const paymentid = qmessage.body.match(regex)
            if (paymentid) {
                const yesregex = /\byes\b/i;
                const noregex = /\bno\b/i;
                if (yesregex.test(message.body)) {
                    const postData = {
                        paymentid: paymentid[1],
                    };
                    const requestOptions = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(postData),
                    };
                    const yesres = await fetch("http://localhost:5000/api/buyer/confirmpayment", requestOptions);
                    const yesresponse = await yesres.json();
                    console.log(yesresponse)
                    if(yesresponse.success){
                        await client.sendMessage(message.from, "Your Payment was confirmed!!!")
                        return;
                    }
                    else{
                        await client.sendMessage(message.from, yesresponse.message)
                        return;
                    }
                }
                if (noregex.test(message.body)) {
                    const postData = {
                        paymentid: paymentid[1],
                    };
                    const requestOptions = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(postData),
                    };
                    const nores = await fetch("http://localhost:5000/api/buyer/blockpayment", requestOptions);
                    const noresponse = await nores.json();
                    console.log(noresponse)
                    if(noresponse.success){
                        await client.sendMessage(message.from, "Your payment was cancelled!!!")
                        return;
                    }
                    else{
                        await client.sendMessage(message.from, noresponse.message)
                        return;
                    }
                }
            }
        }
        else {
            client.sendMessage(message.from, "Invalid Command!")
            return;
        }
    });

    client.initialize();
});



app.use('/api/sendmessage', async (req, res) => {
    const {payid, amount, seller, reason} = req.body;
    await client.sendMessage("919173409103@c.us", `Payment Id: ${payid}\nDo you want to confirm payment of ₹${amount} to ${seller}\nReason: ${reason}\n*Yes* to confirm, *No* to Reject.`)
    res.json({success: true})
});

app.listen(8001, () => { console.log("Backend Started at port", 8001) })
