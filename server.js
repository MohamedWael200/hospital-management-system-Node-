const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoute = require("./Routes/authRoute");
const userRoute = require("./Routes/userRoute");
const doctorRoute = require("./Routes/doctorRoute");
const patientRoute = require("./Routes/patientRoute");
const appointmentRoute = require("./Routes/appointmentRoute");
const VisitReportRoute = require("./Routes/visitReportRoute");
const LapReportRoute = require("./Routes/lapReportRoute");
const roomRoute = require("./Routes/roomRoute");


const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use('/auth' , authRoute);
app.use('/user' , userRoute);
app.use('/doctor' , doctorRoute);
app.use('/patient' , patientRoute);
app.use('/appointment' , appointmentRoute);
app.use('/VisitReport' , VisitReportRoute);
app.use('/LapReport' , LapReportRoute);
app.use('/room' , roomRoute);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database connected successfully!");
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}/`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });
