const express = require("express");
const mongodb = require("mongodb");
const validator = require('./libs/validate');
const responseLib = require('./libs/generateResponse');
const app = express();
const bodyParser = require("body-parser");
const mongoClient = mongodb.MongoClient;
const url = process.env.MONGO_URL || "mongodb://localhost:27017";
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get("/all-halls", function (req, res) {
    mongoClient.connect(url, function (err, db) {
        if (err) {
            let apiResponse = responseLib.sendErrorMessage('Something Went Wrong', 'Server Error', 500);
            res.status(500).json(apiResponse);
        }
        // var db = client.db("hallbookings");
        var cursor = db.collection("halls").find().toArray();
        cursor.then(function (data) {
            delete data._id;
            delete amnesties;
            delete pricePerHour;
            let apiResponse = responseLib.sendResponse('Booked Rooms Data', 200, data);
            res.status(200).json(apiResponse);
            client.close();
        });
    });
});

app.get("/all-customers", function (req, res) {
    mongoClient.connect(url, function (err, db) {
        if (err) {
            let apiResponse = responseLib.sendErrorMessage('Something Went Wrong', 'Server Error', 500);
            res.status(500).json(apiResponse);
        }
        // var db = client.db("hallbookings");
        var cursor = db.collection("halls").find({ bookedStatus: true, customerName: { $exists: true } }).toArray();
        cursor.then(function (data) {
            delete data.bookedStatus;
            delete data._id;
            delete amnesties;
            delete pricePerHour;
            let apiResponse = responseLib.sendResponse('Booked Customers Data', 200, data);
            res.status(200).json(apiResponse);
            client.close();
        });
    });
});

app.put("/book-hall/:id", function (req, res) {
    const { customerName, startDate, endDate } = { ...req.body };
    if (validator.checkValueIfEmpty([customerName, startDate, endDate]) && validator.checkAllParams({ ...req.body }) && validator.validateDate({ ...req.body })) {
        mongoClient.connect(url, function (err, db) {

            if (err) {
                let apiResponse = responseLib.sendErrorMessage(err || 'unavailable room', 'Booking Room Unavailable', 500);
                res.status(500).json(apiResponse);
            }
            // var db = client.db("hallbookings");
            let updateData = { ...req.body, startDate: new Date(startDate), endDate: new Date(endDate), bookedStatus: true }
            db.collection("halls").updateOne(
                { _id: mongodb.ObjectID(req.params.id), $or: [{ $or: [{ bookedStatus: false }, { endDate: { $lt: new Date() } }] }, { customerName: { $exists: false } }] },
                { $set: updateData },
                function (err, data) {
                    console.log(data.result.nModified);
                    if (err || data.result.nModified === 0) {
                        client.close();
                        let apiResponse = responseLib.sendErrorMessage(err || 'unavailable room', 'Booking Room Unavailable', 500);
                        res.status(500).json(apiResponse);
                    } else {
                        client.close();
                        let apiResponse = responseLib.sendResponse('Room Booking Successful', 200, data);
                        res.status(200).json(apiResponse);
                    }
                }
            );
        });
    } else {
        let apiResponse = responseLib.sendErrorMessage('params not proper or missing', 'Server Error', 500);
        res.status(500).json(apiResponse);
    }
});


app.post("/create-room", async function (req, res) {
    console.log('creating Room');
    console.log(req.body);
    const { roomName, bookedStatus, date, amnesties, pricePerHour, numberOfSeats } = { ...req.body };
    if (validator.checkValueIfEmpty([roomName, bookedStatus, date, amnesties, pricePerHour, numberOfSeats]) && validator.checkAllParams({ ...req.body }, 'add')) {
        mongoClient.connect(url, async function (err, db) {
            if (err) {
                let apiResponse = responseLib.sendErrorMessage(err, 'Server Error', 500);
                res.status(500).json(apiResponse);
            }
            // var db = client.db("hallbookings");
            let insertData = await db.collection("halls").insertOne({ ...req.body, date: new Date(date) });
            client.close();
            let apiResponse = responseLib.sendResponse('Room Creation Successful', 200, insertData.ops[0]);
            res.status(200).json(apiResponse);
        });
    } else {
        let apiResponse = responseLib.sendErrorMessage('params not proper or missing', 'Server Error', 500);
        res.status(500).json(apiResponse);
    }

});


app.get("/*", function (req, res) {
    let apiResponse = responseLib.sendErrorMessage('route not available in the application, params not proper or missing', 'Server Error', 404);
    res.status(500).json(apiResponse);
})

app.listen(process.env.PORT || 3000)