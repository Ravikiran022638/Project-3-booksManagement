const express = require("express")
const router = express.Router()
const book = require("../controller/bookController")
const user = require("../controller/userController")
const review = require("../controller/reviewController")
const MW = require("../Middleware/auth")

//-------------------User Api-----------------------------------------//----------------------------//----------
router.post("/register",user.userRegister)

router.post("/login" ,user.userLogin )

//---------------------------------------------------Books Api----------------------------------------------------------

router.post("/books",MW.authentication , book.createBooks)

router.get("/books",MW.authentication, book.getBook)

router.get("/books/:bookId",MW.authentication, book.getBooksById)

router.put("/books/:bookId",MW.authentication,MW.authorisation,book.updateBook)
       
router.delete("/books/:bookId",MW.authentication,MW.authorisation, book.deleteBook)

//---------------------------------------------------review Api----------------------------------------------------------

router.post("/books/:bookId/review",MW.authentication, review.addReview)

router.put("/books/:bookId/review/:reviewId",MW.authentication, review.updateReview)

router.delete("/books/:bookId/review/:reviewId",MW.authentication, review.deleteReview)       


router.all("/**",function(req,res){
    res.status(404).send({status:false,message:"The api that you have requested is not available"})
})

module.exports = router