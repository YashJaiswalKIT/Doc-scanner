const conf={
    appwriteUrl:String(process.env.REACT_APP_APPWRITE_URL),
    appwriteProjectId:String(process.env.REACT_APP_APPWRITE_PROJECT_ID),
    appwriteDatabaseId:String(process.env.REACT_APP_APPWRITE_DATABASE_ID),
    appwriteCollectionId:String(process.env.REACT_APP_APPWRITE_COLLECTION_ID),
    appwriteBucketId:String(process.env.REACT_APP_APPWRITE_BUCKET_ID),
    accessRequestCollectionId: String(process.env.REACT_APP_ACCESS_REQUEST_COLLECTION_ID),
    documentsCollectionId: "documents",
}

export default conf