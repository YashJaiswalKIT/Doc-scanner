import conf from '../conf/config';
import { Client, ID, Databases, Storage } from 'appwrite';
import {  Permission, Role } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }
  async uploadFile(file,userId) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file,
        [
      Permission.read(Role.any()),
      Permission.write(Role.user(userId)) 
    ]
      );
    } catch (error) {
      console.error('uploadFile error:', error);
      throw error;
    }
  }

  
  getFileView(fileId) {
    if (!fileId) return '';
    return this.bucket.getFileView(conf.appwriteBucketId, fileId);
  }

  
  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error('deleteFile error:', error);
      return false;
    }
  }

  
  async addDocument({ userId, fileId, email,phone,filename, otpCode = '', accessLog = [] ,accessRequest=''}) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        {
          userId,
          fileId,
          filename,
          email,
          phone,
          otpCode,
          accessLog,
          accessRequest,
        }
      );
    } catch (error) {
      console.error('addDocument error:', error);
      throw error;
    }
  }

async getDocument(docId) {
  try {
    return await this.databases.getDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      docId
    );
  } catch (error) {
    throw error;
  }
}

async updateAccessLog(docId, accessLog) {
  try {
    return await this.databases.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      docId,
      { accessLog }
    );
  } catch (error) {
    throw error;
  }
}


  // ✅ Delete a document
  async deleteDocument(documentId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        documentId
      );
      return true;
    } catch (error) {
      console.error('deleteDocument error:', error);
      return false;
    }
  }
}

const service = new Service();
export default service;
