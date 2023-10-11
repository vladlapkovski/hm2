import {appStart } from "./app"
import dotenv from 'dotenv'

dotenv.config()

// const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
const app = appStart()
const port = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'

app.listen(port, () => {
    console.log(process.env.MONGO_URL)
})