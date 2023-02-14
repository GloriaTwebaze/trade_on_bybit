import 'dotenv/config'

export const Configs = {
    API_KEY: process.env.API_KEY||"",
    SECRET_API: process.env.API_SECRET||"",
    MAIN_URL: process.env.MAIN_URL||"",
    BOT_TOKEN: process.env.BOT_TOKEN,
    TEST_NET: true
}

