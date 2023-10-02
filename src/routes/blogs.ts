import express, {Request, Response, Router} from "express"
export const blogsRoutes = Router({})

const auth = "admin:qwerty";
const encodedAuth = Buffer.from(auth).toString("base64");

interface Blog {

  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  
}


export const blogs: Blog[] = [];

blogsRoutes.delete("/:blogId", (req: Request, res: Response) => {

  const blogId = req.params.blogId;
  
  const index = blogs.findIndex(blog => blog.id === blogId);
  
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }

  if (index !== -1) {
    blogs.splice(index, 1);
    return res.status(204).send();
  } else {
    return res.status(404).send()
  }

});
  
  
  
blogsRoutes.post('/', (req: Request, res: Response) => {
    
  const { name, description, websiteUrl } = req.body as Blog;

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }

  const errorsMessages = [];

  // Проверяем, что все обязательные поля заполнены
  if (!name || name?.trim()?.length == 0 || name?.length > 15) {
    errorsMessages.push({
      message: 'Invalid name', 
      field: "name"
    });
  }

  if (!description || description?.length > 500) {
    errorsMessages.push({
      message: 'Invalid description', 
      field: "description"
    });
  }

  const websiteUrlRegex = new RegExp('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$');

  if (!websiteUrl || websiteUrl?.length > 100 || !websiteUrlRegex.test(websiteUrl)) {
    errorsMessages.push({
      message: 'Invalid websiteUrl', 
      field: "websiteUrl"
    });
  }


  // if (name?.trim()?.length == 0) {
  //   errorsMessages.push({
  //     message: 'Invalid name', 
  //     field: "name"
  //   });
  // }

  // Проверяем, что поля соответствуют критериям
  // if (name?.length > 15) {
  //   errorsMessages.push({
  //     message: 'Name is too long', 
  //     field: "name"
  //   });
  // }
   
  // if (websiteUrl?.length > 100) {
  //   errorsMessages.push({
  //     message: 'websiteUrl is too long', 
  //     field: "websiteUrl"
  //   });
  // }

  // if (description?.length > 500) {
  //   errorsMessages.push({
  //     message: 'Description is too long', 
  //     field: "description"
  //   });
  // }

  // const websiteUrlRegex = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
  // const websiteUrlRegex = new RegExp('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$');

  // if (!websiteUrlRegex.test(websiteUrl)) {
  //   errorsMessages.push({
  //     message: 'Invalid website URL', 
  //     field: "websiteUrl"
  //   });
  // }

  if (errorsMessages.length > 0) {
    return res.status(400).json({
      errorsMessages
    });
  }

  // Создаем новый блог
  const newBlog: Blog = { id: String(blogs.length + 1), name, description, websiteUrl };

  blogs.push(newBlog); // добавляем новый блог в массив

  // Возвращаем созданный блог с кодом 201
  return res.status(201).send(newBlog);

});
  
  
  
blogsRoutes.get('/', (req: Request, res: Response) => {

  res.status(200).send(blogs); // возвращаем массив всех блогов

});
  
  
blogsRoutes.get('/:id', (req: Request, res: Response) => {

  const id = req.params.id;

  const blog = blogs.find((blog) => blog.id === id);

  if (blog) {
    res.status(200).send(blog); 
  } else {
    res.sendStatus(404);
  }

});
  
  
  
blogsRoutes.put('/:id', (req: Request, res: Response) => {

  const id = req.params.id;

  const { name, description, websiteUrl } = req.body;

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }
  
  const errorsMessages = [];

  if (!websiteUrl || websiteUrl.length > 100) {
    errorsMessages.push({
      message: 'Invalid website URL', 
      field: "websiteUrl"
    });
  }

  // Проверяем корректность ссылки на сайт
  const websiteUrlRegex = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

  if (!websiteUrlRegex.test(websiteUrl)) {
    errorsMessages.push({
      message: 'Invalid website URL', 
      field: "websiteUrl"
    });
  }
  
  if (!name || name.length > 15) {
    errorsMessages.push({
      message: 'Invalid name', 
      field: "name"
    });
  }

  if (!description || description.length > 500) {
    errorsMessages.push({
      message: 'Invalid description', 
      field: "description"
    });
  }

  if (errorsMessages.length > 0) {
    return res.status(400).json({
      errorsMessages
    });
  }

  // Обновляем блог по его id
  const updatedBlog = blogs.find(blog => blog.id === id);

  if (!updatedBlog) {
    return res.status(404).send();
  } else {
    updatedBlog.name = name;
    updatedBlog.description = description;
    updatedBlog.websiteUrl = websiteUrl;

    return res.send(updatedBlog);
  }

});
    