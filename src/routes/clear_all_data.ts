import express, {Request, Response, Router} from "express"
import { posts } from "./posts";
import { blogs } from "./blogs";

export const dataRouter = Router()


dataRouter.delete("/", (req: Request, res: Response) => {
    blogs.length = 0;
    posts.length = 0;
    return res.status(204).send();
});