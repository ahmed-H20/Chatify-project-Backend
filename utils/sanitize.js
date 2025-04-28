

export const sanitizeUser = (user) =>{
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        profile_picture: user.profile_picture,
        about: user.about,
        status: user.status,
        lastOnline: user.lastOnline
    }
}

export const sanitizeMessage = (message) =>{
    return {
        id: message._id,
        messageType: message.messageType,
        senderId: sanitizeUser(message.senderId),
        receiverId: sanitizeUser(message.receiverId),
        seenBy: message.seenBy? sanitizeUser(message.seenBy) : null,
        userSeen : message.userSeen? sanitizeUser(message.userSeen) : false,
        roomId : message.roomId,
    }
}

export const sanitizeUsersForSidebar = (user) => {
    return {
        id: user._id,
        name: user.name,
        profile_picture: user.profile_picture,
    }
}

export const sanitizeGeroupMessage = (groupMessage)=>{
    return{
        id:groupMessage._id,
        senderId:groupMessage.senderId,
        conversationId:groupMessage.conversationId,
        messageType: groupMessage.messageType,
        userSeen:groupMessage.userSeen? groupMessage.userSeen : false,
   }
}

export const sanitizeConversation = (conversation) => {
    return {
        id: conversation._id,
        participants: conversation.participants.map(sanitizeUser),
        messages: conversation.messages.map(sanitizeMessage),
        isGroup: conversation.isGroup,
        groupTitle: conversation.groupTitle,
        groupPicture: conversation.groupPicture,
    }
}

export const sanitizeCall = (call) => {
    return {
        id: call._id,
        caller: sanitizeUser(call.caller),
        receiver: sanitizeUser(call.receiver),
        callType: call.callType,
        callStatus: call.callStatus,
        callStartTime: call.callStartTime,
        callEndTime: call.callEndTime,
    }
}