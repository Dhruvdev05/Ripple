import { StreamChat} from 'stream-chat';
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
    console.error("Stream API key and secret must be set in environment variables");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async(userData) => {
    try {
       await streamClient.upsertUser(userData);
;
         return userData;

    } catch (error) {
        console.error("Error upserting Stream user:", error);
    }
}

export const genrateStreamToken = (userId) => {
   try {
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
    
   } catch (error) {
    console.error("Error generating Stream token:", error); 
   } 
}