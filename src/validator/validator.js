const { default: mongoose } = require("mongoose")

let isBodyExist = function (Body) {
    if (Body === undefined || Object.keys(Body).length === 0) return true
}

// const isPresent = function (value) {
//     if (typeof value === "undefined" || value === null) return false;
//     if (typeof value === "string" && value.trim().length === 0) return false;
//     return true;
// };

let isObjectId = function (data) {
    return mongoose.Types.ObjectId.isValid (data)
}

let containNumbers = function (data) {
    if (/\d/.test(data)) return true
    return false
}

let checkEmail = function (data) {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data)) return true
}

const isValidMobile=(mobile)=>{
    if(/^[0]?[6789]\d{9}$/.test(mobile))
    return true
}



const isValidObjectId = (ObjectId) => {
        return mongoose.Types.ObjectId.isValid(ObjectId);
    };
module.exports.isBodyExist = isBodyExist
module.exports.isObjectId = isObjectId
module.exports.containNumbers = containNumbers
module.exports.checkEmail = checkEmail
// module.exports.isValid =isValid
module.exports.isValidMobile =isValidMobile
module.exports.isValidObjectId =isValidObjectId