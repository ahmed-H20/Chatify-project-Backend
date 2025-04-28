// utils/generateRoomId.js
export function generateRoomId(user1, user2) {
    return [user1, user2].sort().join('-');
  }
  

// const generateRoomId = ((user1, user2)=> {
//     if (!user1 || !user2) {
//       throw new Error('Both user IDs are required to generate a roomId');
//     }
//     return [user1.toString(), user2.toString()].sort().join('-');
//     });

// export default generateRoomId;