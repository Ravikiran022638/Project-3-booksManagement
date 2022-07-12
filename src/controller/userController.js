const userModel = require("../models/userModel")
const validator = require("../validator/validator")
const jwt = require("jsonwebtoken");

//-------------------------POST Api(/register)-------------------------------------//------------------------------

let userRegister = async function (req, res) {
    try {

        let userBody = req.body

        //validate for body
        if (validator.isBodyExist(userBody)) {
            return res.status(400).send({ status: false, message: "Body can't be empty." })
        }

        //validation for title
        if (!Object.keys(userBody).includes("title")) {
            return res.status(400).send({ status: false, message: "Title is missing." })
        }

        if (typeof (userBody.title) != "string") {
            return res.status(400).send({ status: false, message: "Title should be in string." })
        }

        if (!userBody.title || userBody.title.trim() == "") {
            return res.status(400).send({ status: false, message: "Title can't be empty." })
        }

        if (["Mr", "Mrs", "Miss"].indexOf(userBody.title) === -1) {
            return res.status(400).send({ status: false, message: "Title should be Mr,Mrs or Miss." })
        }

        //validation for name
        if (!Object.keys(userBody).includes("name")) {
            return res.status(400).send({ status: false, message: "name is missing." })
        }
        if (typeof (userBody.name) != "string") {
            return res.status(400).send({ status: false, message: "Name should be in string." })
        }
        if (userBody.name.trim() == "") {
            return res.status(400).send({ status: false, message: "name can't be empty." })
        }
        if (validator.containNumbers(userBody.name)) {
            return res.status(400).send({ status: false, message: "name can't contain numbers." })
        }

        //validation for phone
        if (!Object.keys(userBody).includes("phone")) {
            return res.status(400).send({ status: false, message: "phone is missing." })
        }
        if (typeof (userBody.phone) != "string") {
            return res.status(400).send({ status: false, message: "phone should be in string." })
        }
        if (userBody.phone.trim() == "") {
            return res.status(400).send({ status: false, message: "phone can't be empty." })
        }
        if (!validator.isValidMobile(userBody.phone)) return res.status(400).send({ status: false, msg: "Pls Enter Valid PAN India Number" })

        let isPhoneExist = await userModel.findOne({ phone: userBody.phone })
        if (isPhoneExist) return res.status(400).send({ status: false, message: "phone number already exists, plaease give another one." })

        //validation for email
        if (!Object.keys(userBody).includes("email")) {
            return res.status(400).send({ status: false, message: "email is missing." })
        }
        if (typeof (userBody.email) != "string") {
            return res.status(400).send({ status: false, message: "email should be in string." })
        }
        if (userBody.email.trim() == "") {
            return res.status(400).send({ status: false, message: "email can't be empty." })
        }
        if (validator.checkEmail(userBody.email)) {
            return res.status(400).send({ status: false, message: "email is invalid" })
        }
        let isEmailExist = await userModel.findOne({ email: userBody.email })
        if (isEmailExist) return res.status(400).send({ status: false, message: "email already exists, Please give another one." })

        //validation for password
        if (!Object.keys(userBody).includes("password")) {
            return res.status(400).send({ status: false, message: "password is missing." })
        }
        if (typeof (userBody.password) != "string") {
            return res.status(400).send({ status: false, message: "password should be in string." })
        }
        if (userBody.password.trim() == "") {
            return res.status(400).send({ status: false, message: "password can't be empty." })
        }
        if (userBody.password.length > 15 || userBody.password.length < 8) {
            return res.status(400).send({ status: false, message: "password lenght should be between 8 and 15" })
        }

        //validation for address
        if (userBody.address) {
            if (typeof (userBody.address) != "object") {
                return res.status(400).send({ status: false, message: "address should be in object." })

            }
            if (userBody.address.street == "") {
                return res.status(400).send({ status: false, message: "street can't be empty." })
            }
            if (userBody.address.street) {
                if (typeof (userBody.address.street) != "string") {
                    return res.status(400).send({ status: false, message: "street should be in string." })
                }
                if (userBody.address.street.trim() == "") {
                    return res.status(400).send({ status: false, message: "street can't be empty." })
                }
            }
            if (userBody.address.city == "") {
                return res.status(400).send({ status: false, message: "city can't be empty." })
            }
            if (userBody.address.city) {
                if (typeof (userBody.address.city) != "string") {
                    return res.status(400).send({ status: false, message: "city should be in string." })
                }
                if (userBody.address.city.trim() == "") {
                    return res.status(400).send({ status: false, message: "city can't be empty." })
                }
            }
            if (userBody.address.pincode == "") {
                return res.status(400).send({ status: false, message: "pincode can't be empty." })
            }
            if (userBody.address.pincode) {
                if (typeof (userBody.address.pincode) != "string") {
                    return res.status(400).send({ status: false, message: "pincode should be in string." })
                }
                if (userBody.address.pincode.trim() == "") {
                    return res.status(400).send({ status: false, message: "pincode can't be empty." })
                }
            }
        }


        //user data creation 
        userData = await userModel.create(userBody)
        res.status(201).send({ status: true, message: "Success", data: userData })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};
//------------------------------------------POST Api (login)------------------------------------//--------------------------

const userLogin = async function (req, res) {
    try {
        let userName = req.body.userName;
        let password = req.body.password;


        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Data is required" })
        }
        if (!userName) {
            return res.status(400).send({ status: false, message: "UserName is required" })
        }
        if (!password) {
            return res.status(400).send({ status: false, message: "Password is required" })
        }
        let user = await userModel.findOne({ email: userName, password: password });
        if (!user) {
            return res.status(401).send({ status: false, message: "INVALID CREDENTIALS" });
        }

        let iat = Math.floor(Date.now() / 1000)
        let exp = iat + (60 * 60)
        let payload = { _id: user._id, iat: iat, exp: exp }                      //Setting the payload
        let token = jwt.sign(payload, "group63");
        res.setHeader("x-api-key", token);

        res.status(201).send({
            status: true,
            message: 'Success',
            data: {
                token: token
            }
        });

    } catch (error) {
        res.status(500).send({ staus: false, msg: error.message })
    }
};

module.exports.userRegister = userRegister
module.exports.userLogin = userLogin 
