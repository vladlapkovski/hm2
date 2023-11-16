import { collection, collection2, collectionAuthType, collectionBlogsType, collectionPostsType } from './db';
import { ObjectId } from 'mongodb';
import { blogsRoutes } from './routes/blogs';


// export const socialRepositoryForAuth = { 
//     async createAuth(loginOrEmail: string, password: string): Promise<collectionAuthType | undefined> {
//       if (!loginOrEmail.trim() || !password.trim()) {
//         return undefined;
//       }
//       const result = await collection2.insertOne({
//         id: objectId,
//         name,
//         description,
//         websiteUrl,
//         createdAt: createdAt1,
//         isMembership: false,
//         _id: objectId
//       });
//       return {
//         id: result.insertedId,
//         name,
//         description,
//         websiteUrl,
//         createdAt: createdAt1,
//         isMembership: false
//       };
//     }
//   };