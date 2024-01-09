const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("/Users/shaikumarfarooq/DELTA/PROJECTS/models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(mongo_url);
}
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "65405dc166ddc4954427f8f9" }));
  await listing.insertMany(initdata.data);
  console.log("Data initialized");
};

initDB();
