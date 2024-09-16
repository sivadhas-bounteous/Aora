import "react-native-url-polyfill/auto";
import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.bounteous.aora",
  projectId: "66e68cb10036ae205caa",
  databaseId: "66e68dbe0002352f0b7c",
  userCollectionId: "66e68ddb002df2428103",
  videoCollectionId: "66e68df6002bab33e035",
  storageId: "66e68ff70012fe9fd339",
};

const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const userAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!userAccount) throw Error();
    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: userAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export async function signIn(email: string, password: string): Promise<void> {
  try {
    const session = await account.createEmailPasswordSession(email, password);
  } catch (error: unknown) {
    console.log(error);

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};


// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

// Create Video Post
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId
    );

    // console.log(posts.documents);
    return posts.documents;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

// Get video posts created by user
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
    
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}