import { GetUserType, collection, collection2, collection3, collectionAuthType, collectionBlogsType, collectionPostsType } from './db';
import { ObjectId } from 'mongodb';
import { blogsRoutes } from './routes/blogs';


export const socialRepositoryForAuth = { 
    async createAuth(loginOrEmail: string, password: string): Promise<GetUserType | undefined> {
        if (!loginOrEmail.trim() || !password.trim()) {
            return undefined;
        }
        const user = await collection3.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });

        if (!user || user.password !== password) {
            return undefined;
        }

        const { _id, password: userPassword, ...rest } = user;
        return rest;
    }
};