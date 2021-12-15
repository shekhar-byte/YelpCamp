const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const mongoose = require('mongoose')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]
const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 500; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 2000) + 10
        const camp = new Campground({
            author: '619f9ee11ed0f263037a0b61',
            location: `${cities[random1000].city},${cities[random1000].state}`
            , title: `${sample(descriptors)} ${sample(places)}`
            , description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim perspiciatis saepe a atque quae. Debitis ducimus architecto aliquam, rerum, corrupti, a quaerat rem animi similique amet consequuntur vero nulla beatae?'
            , price
            , geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            }
            , images: [

                {
                    url: 'https://res.cloudinary.com/djmccyz52/image/upload/v1638608048/YelpCamp/Take_in_the_Scenery_knawxh.jpg',
                    filename: 'YelpCamp/gsbaevtofwnsyrjvxtnu'
                },
                {
                    url: 'https://res.cloudinary.com/djmccyz52/image/upload/v1638608249/YelpCamp/lakeside-hotel_r8hhcl.jpg',
                    filename: 'YelpCamp/epxd8vushghetq54jgrg',

                },
                {
                    url: 'https://res.cloudinary.com/djmccyz52/image/upload/v1638608250/YelpCamp/ama-dablam2-most-beautiful-mountains-in-the-world_ggs8x6.jpg',
                    filename: 'YelpCamp/owozmtcehorcejd5qwnq',

                }

            ]

        })
        await camp.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})