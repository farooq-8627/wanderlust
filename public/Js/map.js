mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
	container: "map", // container ID
	style: "mapbox://styles/mapbox/streets-v12",
	center: listing.geometry.coordinates, // starting position [lng, lat]
	zoom: 11, // starting zoom
});

const marker1 = new mapboxgl.Marker({ color: "red" })
	.setLngLat(listing.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 })
			.setHTML(
				`<h6>${listing.title}</h6><p>Exact location will be provided after booking</p>`
			)
			.setMaxWidth("300px")
	)
	.addTo(map);
