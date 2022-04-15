
const verifyUser = (username, userRoomList) => {
    
    for (let i = 0; i < userRoomList.length; i++) {
        console.log(userRoomList[i].username);
        if (userRoomList[i].username == username){
            return false;
        } 
    } 
    return true;
};

const verifyRoom = (userroom, userRoomList) => {

    for (let i = 0; i < userRoomList.length; i++) {
        if (userRoomList[i].userroom == userroom){
            //console.log('uesrroom');
            return false;
        }
    }

    return true
}

module.exports = {verifyUser, verifyRoom};