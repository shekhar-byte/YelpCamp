mapboxgl.accessToken = mapToken
let camp = JSON.parse(campground)

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: camp.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
})
map.addControl(new mapboxgl.NavigationControl());
new mapboxgl.Marker({ color: '#e71d36' })
    .setLngLat(camp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25, maxWidth: '400px' })
            .setHTML(
                `<h4>${camp.title}</h4> <p>${camp.location}</p>`
            )
    )
    .addTo(map)
