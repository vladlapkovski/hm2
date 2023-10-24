import { collection, collectionBlogsType } from './db'
import { ObjectId } from 'mongodb';

export const socialRepository = {
    async getBlogs(): Promise<collectionBlogsType[]> {
        return collection.find({}).toArray()
    },
    async createBlog(name: string, description: string, websiteUrl: string, createdAt: string, isMembership: boolean): Promise<collectionBlogsType | undefined> {
        if (!name.trim() || !description.trim() || !websiteUrl.trim()) {
            return undefined;
          }
        const result = await collection.insertOne({
            name, 
            description, 
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        })
        return {
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: isMembership
        }
    }
}

export const getIDBlog = {
    async getBlog(): Promise<collectionBlogsType[]> {
      return collection.find({}).toArray();
    }
}


export const deleteIDBlog = {
    async deleteBlog(): Promise<void | collectionBlogsType[]> {
      return collection.find({}).toArray();
    }
}


export const updateIDBlog = {
    async updateBlog(id: ObjectId, name: string, description: string, websiteUrl: string) {
        if (typeof name !== 'string' || !name.trim() || typeof description !== 'string' || !description.trim() || typeof websiteUrl !== 'string' || !websiteUrl.trim()) {
            return undefined;
          }
        const updateDocument = {
            $set: {
              name: name,
              description: description,
              websiteUrl: websiteUrl
            }
          };
      const result = await collection.findOneAndUpdate({ _id: id }, updateDocument);
      if (result) {
        const updatedBlog = result as collectionBlogsType;
        return {
          name: updatedBlog.name,
          description: updatedBlog.description,
          websiteUrl: updatedBlog.websiteUrl
        };
      } else {
        return undefined;
      }
    }
  };
  


