import User from "../models/User.js";
import FriendRequest from "../models/Friends.js";

export async function getRecomendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recomendedUsers = await User.find({
      _id: { 
        $ne: currentUserId,              // not me
        $nin: currentUser.friends        // not already friends
      },
      isOnboarded: true,                 // only onboarded users
    });
    console.log(req.user)

    res.status(200).json(recomendedUsers);

  } catch (error) {
    console.error("Error in getRecomendedUsers controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById( req.user.id).select("friends")
        .populate("friends" , "fullName profilePic nativeLanguage learningLanguage ");
        res.status(200).json(user.friends)
    } catch (error) {
        console.error("Error in getMyFriends controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function sendFriendRequest(req, res) {
    const myId = req.user._id;
    const {id : recipientId} = req.params;
    try {
        if(myId === recipientId) {
          return  res.status(400).json({message: "you cannot send friend request to yourself"})
        }
  const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(400).json({message: "recipientId is required"})
        }

        if (recipient.friends.includes(myId)) {
            return res.status(400).json({message: "you are already friends"})
        }
        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender: myId , recipient:recipientId},
                {sender: recipientId , recipient:myId},
            ],
        })

        if(existingRequest){
            return res.status(400).json({message: "friend request already exists"})
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,

        })

        res.status(201).json(friendRequest)
    } catch (error) {
        console.error("Error in sendFriendRequest controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function acceptFriendRequest (req, res) {
    try {
        const {id : requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId)

        if(!friendRequest){
            return res.status(404).json({message: "friend request not found"})
        }

        if(friendRequest.recipient.toString() !== req.user._id.toString()){
            return res.status(403).json({message: "you are not authorized to accept this friend request"})
        }

        friendRequest.status = "accepted";
        await friendRequest.save();


        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet: {friends: friendRequest.recipient}
        })

        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet: {friends: friendRequest.sender}
        })

 res.status(200).json({message: "friend request accepted"})
    } catch (error) {
        console.error("Error in acceptFriendRequest controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getFriendRequest(req, res){
    try {
        const incomingRequests = await FriendRequest.find({
            recipient: req.user._id,
            status: "pending",
        
        }).populate("sender" , "fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user._id,
            status: "accepted",
 }).populate( "recipient", "fullName profilePic")
          res.status(200).json({
      incomingReqs: incomingRequests,
      acceptedReqs: acceptedReqs,
    });
    } catch (error) {
        console.log("Error in getFriendRequest controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}