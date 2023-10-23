import express, {Request, Response, Router} from "express"
import { collection, collection1, collectionPostsType, collectionBlogsType } from '../db'
import { ObjectId } from "mongodb";

export const dataRouter = Router()


dataRouter.delete("/", async (req: Request, res: Response) => {
    await collection.deleteMany({ _id: ObjectId });
    await collection1.deleteMany({ _id: ObjectId });
    return res.status(204).send();
});