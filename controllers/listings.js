const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.indexRoute = async (req, res) => {
	const allListings = await Listing.find({});
	res.render("listings/index.ejs", { allListings });
};

module.exports.renderCreateFile = (req, res) => {
	res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
	let response = await geocodingClient
		.forwardGeocode({
			query: req.body.Listing.location,
			limit: 1,
		})
		.send();

	const url = req.file.path;
	const filename = req.file.filename;

	const newListing = new Listing(req.body.Listing);
	newListing.owner = req.user._id;
	newListing.image = { url, filename };
	newListing.geometry = response.body.features[0].geometry;
	let savedListing = await newListing.save();
	console.log(savedListing);
	req.flash("success", "New Listing Created");
	res.redirect("/listing");
};

module.exports.showListing = async (req, res) => {
	let { id } = req.params;
	const listing = await Listing.findById(id)
		.populate({ path: "reviews", populate: { path: "author" } })
		.populate("owner");
	if (!listing) {
		req.flash("error", "Listing does not exists");
		res.redirect("/listing");
	}
	res.render("listings/show.ejs", { listing });
};

module.exports.editListing = async (req, res) => {
	let { id } = req.params;
	const listing = await Listing.findById(id);
	if (!listing) {
		req.flash("error", "Listing does not exists");
		res.redirect("/listing");
	}
	let originalImageUrl = listing.image.url;
	originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
	res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
	let { id } = req.params;
	let listing = await Listing.findByIdAndUpdate(id, { ...req.body.Listing });

	if (typeof req.file !== "undefined") {
		const url = req.file.path;
		const filename = req.file.filename;
		listing.image = { url, filename };
		await listing.save();
	}

	req.flash("success", "Listing Updated");
	res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async (req, res) => {
	let { id } = req.params;
	await Listing.findByIdAndDelete(id);
	req.flash("success", "Listing Deleted");
	res.redirect(`/listing`);
};
