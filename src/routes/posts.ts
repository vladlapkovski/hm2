import express, {Request, Response, Router} from "express"
<<<<<<< HEAD
import { CreateCommentsRepository, socialRepository, updateIDPost } from "../social-repository-posts";
import { collection, collectionPostsType, collection1, CreateComments, collection3 } from "../db";
=======
import { CreateCommentForPost, socialRepository, updateIDPost } from "../social-repository-posts";
import { collection, collectionPostsType, collection1, CreateCommentsType, GetPostComment, collection2 } from "../db";
>>>>>>> a4ac42c455f65d4e514ba2a30da6ab6ae2afbdad
import { Collection, ObjectId } from 'mongodb';
import { jwtService } from "../aplication/jwt-service";
import { log } from "console";



export const postsRouter = Router()

const auth = "admin:qwerty";
const encodedAuth = Buffer.from(auth).toString("base64");


postsRouter.get('/', async (req: Request, res: Response) => {
  const searchNameTerm = req.query.searchNameTerm as string || null; // поисковый термин для имени блога
  const sortBy = req.query.sortBy as string || 'createdAt'; // поле для сортировки
  const sortDirection = req.query.sortDirection as string || 'desc'; // направление сортировки
  const pageNumber = parseInt(req.query.pageNumber as string) || 1; // номер страницы (по умолчанию 1)
  const pageSize = parseInt(req.query.pageSize as string) || 10; // количество элементов на странице (по умолчанию 10)
  const startIndex = (pageNumber - 1) * pageSize; // индекс начального элемента
  const endIndex = pageNumber * pageSize; // индекс конечного элемента
  const posts = await socialRepository.getPosts();

  let filteredPosts = posts;
  if (searchNameTerm) {
    filteredPosts = posts.filter(post => post.title.toLowerCase().includes(searchNameTerm.toLowerCase()));
  }

  filteredPosts.sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  const paginatedBlogs = filteredPosts.slice(startIndex, endIndex); // получаем только нужные элементы для текущей страницы

  return res.status(200).json({
    pagesCount: Math.ceil(filteredPosts.length / pageSize), // общее количество страниц
    page: pageNumber, // текущая страница
    pageSize: pageSize, // размер страницы
    totalCount: filteredPosts.length, // общее количество элементов после фильтрации
    items: paginatedBlogs // массив блогов для текущей страницы
  });
});

postsRouter.get('/:id', async (req: Request, res: Response) => {

  const id = new ObjectId(req.params.id);

  const post = await collection1.findOne({ $or: [{ _id: id }, { id }] }); 

  if (post) {
    const { _id, ...rest } = post;
  } else {
    res.sendStatus(404);
  }
});

postsRouter.delete('/:postId', async (req: Request, res: Response) => {

  const postId = new ObjectId(req.params.postId);

  const postIndex = await collection1.findOne({ _id: postId })

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }

  if (postIndex) {
    await collection1.deleteOne({ _id: postId });
    return res.status(204).send();
  } else {
    return res.status(404).send()
  }

});


postsRouter.post('/', async (req: Request, res: Response) => {
  
  const { title, shortDescription, content, blogId, blogName, createdAt } = req.body as collectionPostsType;
 
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }

    // Проверяем, что все обязательные поля заполнены
  const errorsMessages = [];
  const noUseErrors = [];

  let blog;
    try {
      blog = await collection.findOne({ _id: new ObjectId(blogId) });
    } catch (error) {
      noUseErrors.push({
        message: 'Invalid blogId',
        field: 'blogId'
      });
    }

    if (typeof blog !== "object" || !blog) {
      errorsMessages.push({
        message: 'Invalid blogId',
        field: 'blogId'
      });
    }


  
  
  if (!title || title?.trim()?.length == 0 || title?.length > 30) {
    errorsMessages.push({
      message: 'Invalid title',
      field: 'title'
    });
  }
  if (!shortDescription || shortDescription?.length > 100) {
    errorsMessages.push({
      message: 'Invalid shortDescription',
      field: 'shortDescription'
    });
  }
  if (!content || content?.trim()?.length == 0 || content?.length > 1000) {
    errorsMessages.push({
      message: 'Invalid content',
      field: 'content'
    });
  }
   
  if (errorsMessages.length > 0) {
    return res.status(400).json({
      errorsMessages
    });
  } 

  

  // Создаем новый пост
  const newPost = await socialRepository.createPost(title, shortDescription, content, blogId, blogName, createdAt);

  // Возвращаем созданный пост с кодом 201
  return res.status(201).json(newPost);

});


postsRouter.put('/:id', async (req: Request, res: Response) => {
  const id = new ObjectId(req.params.id);
  const { title, shortDescription, content, blogId, blogName } = req.body as collectionPostsType;
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }

  const errorsMessages = [];
  const nouseerrors = [];

  let blog;
    try {
      blog = await collection.findOne({ _id: new ObjectId(blogId) });
    } catch (error) {
      nouseerrors.push({
        message: 'Invalid blogId',
        field: 'blogId'
      });
    }

    if (typeof blog !== "object" || !blog) {
      errorsMessages.push({
        message: 'Invalid blogId',
        field: 'blogId'
      });
    }

  if (!title || title?.trim()?.length == 0 || title?.length > 30) {
    errorsMessages.push({
      message: 'Invalid title', 
      field: "title"
    });
  }

  if (!shortDescription || shortDescription?.length > 100) {
    errorsMessages.push({
      message: 'Invalid shortDescription', 
      field: "shortDescription"
    });
  }

  if (!content || content?.trim()?.length == 0 || content?.length > 1000) {
    errorsMessages.push({
      message: 'Invalid content', 
      field: "content"
    });
  }

  if (errorsMessages.length > 0) {
    return res.status(400).json({
      errorsMessages
    });
  }

  const updatedPost = await updateIDPost.updatePost(id, title, shortDescription, content, blogId, blogName);

  if (!updatedPost) {
    return res.status(404).send("Post not found");
  } else {
    return res.status(204).send(updatedPost);
  }
});






<<<<<<< HEAD
postsRouter.post('/id/comments', async (req: Request, res: Response) => {
  const { content } = req.body as CreateComments;

  if (!req.headers.authorization) {
    res.sendStatus(401);
    return;
  }

  const token = req.headers.authorization.split(" ")[1];
  const JWTtoken = await jwtService.getUserIdByToken(token);
  const authUser = await collection3.findOne({ _id: JWTtoken as ObjectId });

  if (!authUser) {
    return res.status(404).json({ message: 'User not found' });
  } 
  
  const { _id, createdAt, password, email, ...rest } = authUser;
  

  // Проверяем, что все обязательные поля заполнены
  const errorsMessages = [];

  if (!content || content?.trim()?.length == 0 || content?.length > 300 || content?.length < 20) {
    errorsMessages.push({
      message: 'Invalid content',
      field: 'title'
=======
postsRouter.post('/:id/comments', async (req: Request, res: Response) => {

  const id = new ObjectId(req.params.id);
  
  const { content,createdAt, commentatorInfo, userId, userLogin } = req.body as GetPostComment;
 
  const authHeader = req.headers.authorization;

  // if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
  //   return res.status(401).send();
  // }

    // Проверяем, что все обязательные поля заполнены
  const errorsMessages = [];
  const noUseErrors = [];

  let post;
    try {
      post = await collection1.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      noUseErrors.push({
        message: 'Invalid postId',
        field: 'postId'
      });
    }

    if (typeof post !== "object" || !post) {
      errorsMessages.push({
        message: 'Invalid postId',
        field: 'postId'
      });
    }


  
  
  if (!content|| content?.trim()?.length == 0 || content?.length > 300 || content?.length < 20) {
    errorsMessages.push({
      message: 'Invalid content',
      field: 'content'
>>>>>>> a4ac42c455f65d4e514ba2a30da6ab6ae2afbdad
    });
  }

  if (errorsMessages.length > 0) {
    return res.status(400).json({
      errorsMessages
    });
  }
<<<<<<< HEAD

  // Создаем новый пост
  const newComment = await CreateCommentsRepository.CreateComment(content, rest);

  // Возвращаем созданный пост с кодом 201
  return res.status(201).json(newComment);
});
=======
  
  // Создаем новый пост
  const newComment = await CreateCommentForPost.createComment(content, {
    userId:"", 
    userlogin:"312"
  }, createdAt);

  // Возвращаем созданный пост с кодом 201
  return res.status(201).json(newComment);

});  
>>>>>>> a4ac42c455f65d4e514ba2a30da6ab6ae2afbdad
