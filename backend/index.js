require("dotenv").config();
const PORT = 8000;
const express = require("express");
const socketIO = require("socket.io");
const axios = require('axios');

const app = express();
app.use(express.json());

const server = app.listen(PORT, ()=>{
    console.log(`Listening at port ${PORT}`);
})

const socketHandler = socketIO(server);

// socketHandler.on("connection", (socket) => {
//     socket.on("connection_error", () => {
//         console.log("Connection error!")
//     })
//     socket.on("disconnect", ()=>{
//         console.log("Client disconnected!");
//     })
    
//     setInterval(()=>{
//         socketHandler.emit('crypto', "Hello Cryptos Client!")
//     },1000); 
// })

const getPrices = () => {
    axios.get(process.env.LIST_URL, {
        headers:{
            "x-messari-api-key" : process.env.API_KEY,
        }
    })
    .then((response) => {
        const priceList = response.data.data.map((item)=>{
            return {
                id:item.id,
                name:item.symbol,
                price:item.metrics.market_data.price_usd
            };
        });
        socketHandler.emit("crypto", priceList);
    }).catch(err => {
        console.log(err);
        socketHandler.emit("crypto",{
            error:true,
            message:"Error Fetching Prices Data From API"
        })
    })
};

setInterval(() => {
    getPrices();
}, 10000)

app.get('/cryptos/profile/', (req,res) => {
    res.json({error:true, message: "Missing Crypto Id in the API URL"});
})

app.get('/cryptos/profile/:id', (req,res) => {
    const cryptoId = req.params.id;
    
    axios.get(`${process.env.BASE_URL_V2}/${cryptoId}/profile`, {
        headers:{
            "x-messari-api-key" : process.env.API_KEY,
        }
    }).then((responseData) => {
        res.json(responseData.data.data);
    }).catch((err) => {
        res.json({
                error:true,
                message:"Error Fetching Prices Data From API",
                errorDetails: err
        })
    })

})

app.get('/cryptos/market-data/', (req,res) => {
    res.json({error:true, message: "Missing Crypto Id in the API URL"});
})

app.get('/cryptos/market-data/:id', (req,res) => {
    const cryptoId = req.params.id;
    axios.get(`${process.env.BASE_URL_V1}/${cryptoId}/metrics/market-data`, {
        headers:{
            "x-messari-api-key" : process.env.API_KEY,
        }
    }).then((responseData) => {
        res.json(responseData.data.data);
    }).catch((err) => {
        res.json({
                error:true,
                message:"Error Fetching Prices Data From API",
                errorDetails: err
        })
    })

})