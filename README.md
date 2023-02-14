# Buy and Sell Using Bybit or ByBit

This project demostrates how to buy and sell tokens on both Bybit using ByBit AP and Uniswap V3 SDK



## Warnings

Please be sure to read the following instructions and considerations before running this code on your local workstation, shared systems, or production environments.

## Requirements
- Typescript Installed globally and in ur project
    `npm install -g typescript ` or `yarn add typescript --dev`
- Express installed globally or in ur project
    `$ npm install express --save`
- Bybit testnet API key from `https://testnet.bybit.com/`
- Uniswap V3 form `https://uniswap.org/developers`


## Local development

To run this project in your development machine, follow these steps:


1. Fork this repo and clone your fork:

    `git clone https://github.com/alvienzo720/BuyAndSell_Bybit.git`

2. Install dependencies :

    `cd BUY-SELL`

    `yarn install or npm install`

3. Add your API KEY, API SECRET, URL from Bybit in the .env


4. If everything is alright, you should be able to start the Express development server:

    `yarn start`

5. Open your client like Postman and pass this url  `http://localhost:3000/place-order`.


6. For a Buy Order, make a POST request with the below paramters in the body:
    `{
    "symbol": "BTCUSDT",
    "side": "Buy",
    "qty": 20000,
    "price": 23030,
    "time_in_force": "GoodTillCancel",
    "reduce_only":false,
    "close_on_trigger": false
}
`

7. For a Sell Order make a POST request with the below pramaters in the body: `{
    "symbol": "BTCUSDT",
    "side": "Sell",
    "qty": 20000,
    "price": 23030,
    "time_in_force": "GoodTillCancel",
    "reduce_only":false,
    "close_on_trigger": false
}
`
## All is set and happy Hacking
