import { genrateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        const token = genrateStreamToken(req.user.id)
        res.status(200).json({ token });
    } catch (error) {
        console.log("Error in getStreamToken controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
} 