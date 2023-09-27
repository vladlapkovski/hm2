import express, {Request, Response} from "express"
import { blogsRoutes } from "./routes/blogs";
import { postsRouter } from "./routes/posts";
import { dataRouter } from "./routes/clear_all_data";

export const appStart = ()=> {
const app = express();

const parserMiddleware = express.json()

app.use(parserMiddleware)
app.use("/ht_02/api/blogs", blogsRoutes)
app.use("/ht_02/api/posts", postsRouter)
app.use("/ht_02/api/testing/all-data", dataRouter)
return app;
}