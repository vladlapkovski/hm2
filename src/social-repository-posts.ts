import { title } from 'process';
import { collection, collection1, collectionPostsType, collectionBlogsType } from './db'
import { Collection, ObjectId } from 'mongodb';


export const socialRepository = {
  async getPosts(): Promise<collectionPostsType[]> {
      return collection1.find({}).toArray()
  },
  async createPost(
    title: string, 
    shortDescription: string, 
    content: string,
    blogId: string,
    blogName: string,
    createdAt:string
    ): Promise<collectionPostsType | undefined> {

      if (!title.trim() || !shortDescription.trim() || !content.trim() || !blogId.trim()) {
        return undefined;
      }
    
      let blog;
      try {
        blog = await collection.findOne({ _id: new ObjectId(blogId) });
      } catch (error) {
        return undefined;
      }
    
      if (typeof blog !== "object" || !blog) {
        return undefined;
      }

    const BLOGNAME = blog.name;

const result = await collection1.insertOne({
  title, 
  shortDescription, 
  content,
  blogId,
  blogName: BLOGNAME,
  createdAt: new Date().toISOString()
});
return {
  title: title, 
  shortDescription: shortDescription,
  content: content,
  blogId: blogId,
  blogName: BLOGNAME,
  createdAt: new Date().toISOString()
}
}
}


export const getIDPost = {
    async getPost(): Promise<collectionPostsType[]> {
      return collection1.find({}).toArray();
    }
}


export const deleteIDPost = {
    async deletePost(): Promise<void | collectionPostsType[]> {
      return collection1.find({}).toArray();
    }
}


export const updateIDPost = {
    async updatePost(id: ObjectId, title: string, shortDescription: string, content: string, blogId: string, blogName: string) {
        if (typeof title !== 'string' || !title.trim() || 
        typeof shortDescription !== 'string' || !shortDescription.trim() || 
        typeof content !== 'string' || !content.trim() ||
        typeof blogId !== 'string' || !blogId.trim() 
        ) {
            return undefined;
          }

      let blog;
      try {
        blog = await collection.findOne({ _id: new ObjectId(blogId) });
      } catch (error) {
        return undefined;
      }
    
      if (typeof blog !== "object" || !blog) {
        return undefined;
      }

    const BLOGNAME = blog.name;
        const updatePostDocument = {
            $set: {
              title: title,
              shortDescription: shortDescription,
              content: content,
              blogId: blogId,
              blogName: BLOGNAME
            }
          };
      const result1 = await collection1.findOneAndUpdate({ _id: id }, updatePostDocument);
      if (result1) {
        const updatedPost = result1 as collectionPostsType;
        return {
          title: updatedPost.title,
          shortDescription: updatedPost.shortDescription,
          content: updatedPost.content,
          blogId: updatedPost.blogId,
          blogName: updatedPost.blogName
        };
      } else {
        return undefined;
      }
    }
  };