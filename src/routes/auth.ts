// import express, {Request, Response, Router} from "express"
// import { getIDBlog, socialRepository } from "../social-repository-blogs";
// import { socialRepositoryForPostsInBlogs } from "../social-repositoryForPostsInBlogs"
// import { collection, collectionAuthType, collectionPostsType } from '../db';
// export const authRoutes = Router({}) 
// import { ObjectId } from 'mongodb';
// import { updateIDBlog } from "../social-repository-blogs"


// authRoutes.post('/', async (req: Request, res: Response) => {
    
//     const { loginOrEmail, email } = req.body as collectionAuthType;
  
//     const errorsMessages = [];
  
//     // Проверяем, что все обязательные поля заполнены
//     if (typeof loginOrEmail !== "string" || !loginOrEmail || loginOrEmail?.trim()?.length == 0 || loginOrEmail?.length > 15) {
//       errorsMessages.push({
//         message: 'Invalid loginOrEmail', 
//         field: "loginOrEmail"
//       });
//     }
  
//     if (typeof email !== "string" || !email || email?.trim()?.length == 0 || email?.length > 500) {
//       errorsMessages.push({
//         message: 'Invalid description', 
//         field: "description"
//       });
//     }
  
//     if (errorsMessages.length > 0) {
//       return res.status(400).json({
//         errorsMessages
//       });
//     }
  
//     // Создаем новый блог
//     const auth = await socialRepository.createBlog();
  
//     // Возвращаем созданный блог с кодом 201
//     return res.status(201).json(newBlog);
  
//   });