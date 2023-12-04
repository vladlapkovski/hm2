import express, {Request, Response} from "express"
import { blogsRoutes } from "./routes/blogs";
import { postsRouter } from "./routes/posts";
import { dataRouter } from "./routes/clear_all_data";
import { postsForBlogsRoutes } from "./routes/postsForBlogs";
import { authRoutes } from "./routes/auth";
import { usersRoutes } from "./routes/users";

export const appStart = ()=> {
const app = express();

const parserMiddleware = express.json()

app.use(parserMiddleware)
app.use("/hometask_06/api/blogs", blogsRoutes)
app.use("/hometask_06/api", postsForBlogsRoutes)
app.use("/hometask_06/api/posts", postsRouter)
app.use("/hometask_06/api/testing/all-data", dataRouter)
app.use("/hometask_06/api/auth", authRoutes)
app.use("/hometask_06/api/users", usersRoutes)
return app;
}