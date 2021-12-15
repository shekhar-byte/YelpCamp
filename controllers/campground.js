const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary/index')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapboxToken })

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', { campgrounds })
}

module.exports.renderNewForm = async (req, res) => {
    res.render('campgrounds/new.ejs')
}

module.exports.createCampground = async (req, res, next) => {
    //if (!req.body.campground) throw new ExpressError('****Invalid Data For Campground*******', 400);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCampground = new Campground(req.body.campground)
    newCampground.geometry = geoData.body.features[0].geometry
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newCampground.author = req.user.id
    await newCampground.save()
    req.flash('success', 'successfully made a new campground')
    res.redirect(`/campgrounds/${newCampground.id}`)

}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!campground) {
        req.params('error', 'Campground NOT FOUND')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/show.ejs', { campground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.params('error', 'Campground NOT FOUND')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/edit.ejs', { campground })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs)
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated the campground')
    res.redirect(`/campgrounds/${campground.id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params

    const camp = await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a campground')
    res.redirect('/campgrounds')
}