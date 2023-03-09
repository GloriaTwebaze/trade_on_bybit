import 'dotenv/config'

export const Configs = {
    API_KEY: process.env.API_KEY||"",
    SECRET_API: process.env.API_SECRET||"",
    MAIN_URL: process.env.MAIN_URL||"",
    BOT_TOKEN: process.env.BOT_TOKEN||"",
    AUTHORISED_USERS: [ 1864820807],
    MESSAGE_INTERVAL: 10,
    TEST_NET: true,
}

export const swapConfigs ={
    PRIVATE_KEY: process.env.PRIVATE_KEY || "",
    SWAP_URL: process.env.SWAP_URL || ""
}