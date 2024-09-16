import "react-native-url-polyfill/auto";
import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
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
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
