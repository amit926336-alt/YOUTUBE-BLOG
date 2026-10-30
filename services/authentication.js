const JWT=require("jsonwebtoken")
const screat="@dgjk%"
function createTokenForUser(User){
    const payload={
        _id:User._id,
        fullName:User.fullName,
        email:User.email,
        ProfileImageUrl:User.ProfileImageUrl,
        role:User.role
    }
    const token=JWT.sign(payload,screat);
    return token;
}
function validateToken(token){
    const payload=JWT.verify(token,screat);
    return payload;
}

module.exports={
    createTokenForUser,
    validateToken
}