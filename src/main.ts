import {appStart } from "./app"

const app = appStart()
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`app listening on port: ${port}`)
})