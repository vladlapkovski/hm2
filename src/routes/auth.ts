import express, {Request, Response, Router} from "express"
import { getIDBlog, socialRepository } from "../social-repository-blogs";
import { socialRepositoryForPostsInBlogs } from "../social-repositoryForPostsInBlogs"
import { collection, collectionAuthType, collectionPostsType } from '../db';
export const authRoutes = Router({}) 
import { ObjectId } from 'mongodb';
import { updateIDBlog } from "../social-repository-blogs"
import { socialRepositoryForAuth } from "../social-repository-auth";


authRoutes.post('/', async (req: Request, res: Response) => {
    const { loginOrEmail, password } = req.body as collectionAuthType;

    const errorsMessages = [];

    // Проверяем, что все обязательные поля заполнены
    if (typeof loginOrEmail !== "string" || !loginOrEmail || loginOrEmail?.trim()?.length == 0) {
        errorsMessages.push({
            message: 'Invalid loginOrEmail', 
            field: "loginOrEmail"
        });
    }

    if (typeof password !== "string" || !password || password?.trim()?.length == 0 || password?.length > 20) {
        errorsMessages.push({
            message: 'Invalid password', 
            field: "password"
        });
    }

    if (errorsMessages.length > 0) {
        return res.status(400).json({
            errorsMessages
        });
    }

    // Проверяем данные в базе данных
    const user = await socialRepositoryForAuth.createAuth(loginOrEmail, password);

    if (!user) {
        return res.status(401).send();
    }

    // Если данные верны, возвращаем статус 204
    return res.status(204).send();
});