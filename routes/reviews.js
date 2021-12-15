const express = require('express')
const router = express.Router({ mergeParams: true }) //merges params of the router
const catchAsync = require('../utilites/catchAsync')
const ExpressError = require('../utilites/ExpressError')
const reviews = require('../controllers/reviews')
const { reviewSchema } = require('../schemas')
const { validateReview, isReviewAuthor, isLoggedIn } = require('../middleware')

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router