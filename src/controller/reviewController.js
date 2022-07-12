const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const validator = require("../validator/validator");
const moment = require("moment");

//--------------------------------post Api(create review)-------------------------------------------------------//

const addReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!validator.isObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Enter a correct book ObjectId", })
        }
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) return res.status(404).send({ status: false, message: "This Book does not exist. Please enter correct Book ObjectId", })

        let review = req.body
        if(validator.isBodyExist(review)){
            return req.status(400).send({status:false,message:"Please give some data to create a review"})
        }
        review.bookId = bookId

        //validation for reviewedBy
        if(review.reviewedBy){
            if(typeof(review.reviewedBy)!="string"){
                return res.status(400).send({ status: false, message: "reviewedBy must be string." })

            }
            if (review.reviewedBy.trim() == " ") {
                return res.status(400).send({ status: false, message: "reviewedBy can't be empty." })
            }
        }
        

        //validation for reviewedAt
        review.reviewedAt = moment().toISOString();
  
        //validation for rating
        if (!Object.keys(review).includes("rating")) {
            return res.status(400).send({ status: false, message: "rating is missing." })
        }
        if (typeof (review.rating) != "number") {
            return res.status(400).send({ status: false, message: "rating should be a number." })
        }
        if (review.rating < 1 || review.rating > 5) {
            return res.status(400).send({ status: false, message: "rating should be between 1 to 5" })

        }
        let createdReview = await reviewModel.create(review)

        bookUpdate = await bookModel.findOneAndUpdate({ _id: bookId }, { reviews: book.reviews+1 }, { new: true })
        res.status(201).send({ status: true, message: "Success", data: createdReview })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

//--------------------------------------------put api (update review)----------------------------------------------

let updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!validator.isObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Enter a correct book ObjectId", })
        }
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: "This Book does not exist. Please enter correct Book ObjectId", })
        }

        let reviewId = req.params.reviewId

        if (!validator.isObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "Enter a correct review ObjectId", })
        }
        let review = await reviewModel.findOne({ _id: reviewId, bookId: book._id, isDeleted: false })
        if (!review) return res.status(404).send({ status: false, message: "This review does not exist. Please enter correct review ObjectId", })

        let upreview = req.body

        if(upreview == undefined||Object.keys(upreview).length===0){
            return res.status(400).send({ status: false, message: "Please give some data to update" })
        }
        if (upreview.review =="") {
            return res.status(400).send({ status: false, message: "review input can't be empty." })
        }
        if(upreview.review){
            if (typeof (upreview.review) != "string") {
                return res.status(400).send({ status: false, message: "review should be string." })
            }
            if (upreview.review.trim().length == 0) {
                return res.status(400).send({ status: false, message: "review input can't be empty." })
            }
        }
        if (upreview.rating) {
            if (typeof (upreview.rating) != "number") {
                return res.status(400).send({ status: false, message: "rating should be a number." })
            }
            if (upreview.rating < 1 || upreview.rating > 5) {
                return res.status(400).send({ status: false, message: "rating should be between 1 to 5" })
            }
        }
        if (upreview.reviewedBy) {
            if (typeof (upreview.reviewedBy) != "string") {
                return res.status(400).send({ status: false, message: "reviewedBy should be string." })
            }
            if (upreview.reviewedBy.trim() == "") {
                return res.status(400).send({ status: false, message: "reviewedBy name input can't be empty." })
            }
            if (validator.containNumbers(upreview.reviewedBy)) {
                return res.status(400).send({ status: false, message: "reviewedBy name can't contain numbers." })

            }
        }

        let reviews = await reviewModel.findOneAndUpdate({ _id: reviewId }, upreview, { new: true })
        let bookWithReviews = {
            _id: book._id,
            title: book.title,
            excerpt: book.excerpt,
            userId: book.userId,
            category: book.category,
            subcategory: book.subcategory,
            isDeleted: book.isDeleted,
            reviews: book.reviews,
            releasedAt: book.releasedAt,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt,
            reviewsData: reviews

        }
        res.status(200).send({ status: true, message: "success", data: bookWithReviews })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })

    }

}

//-----------------------------------------delete api(delete review)------------------------------------------------

let deleteReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!validator.isObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Enter a correct book ObjectId", })
        }
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) return res.status(404).send({ status: false, message: "This Book does not exist. Please enter correct Book ObjectId", })

        let reviewId = req.params.reviewId

        if (!validator.isObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "Enter a correct review ObjectId", })
        }
        let review = await reviewModel.findOne({ _id: reviewId, bookId: book._id, isDeleted: false })
        if (!review) return res.status(404).send({ status: false, message: "This review does not exist. Please enter correct review ObjectId", })

        if (review.isDeleted === true) {
            return res.status(404).send({ status: false, message: "This review does not exist.", })
        }

        let deletedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true }, { new: true })
        await bookModel.findOneAndUpdate({ _id: bookId }, { reviews: book.reviews-1 })

        res.status(200).send({ status: true, message: "deleted", data: deletedReview })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}

module.exports.addReview = addReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview
