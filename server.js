const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const authRoute = require("./Routes/authRoute");
const userRoute = require("./Routes/userRoute");
const doctorRoute = require("./Routes/doctorRoute");
const patientRoute = require("./Routes/patientRoute");
const appointmentRoute = require("./Routes/appointmentRoute");
const VisitReportRoute = require("./Routes/visitReportRoute");
const LapReportRoute = require("./Routes/lapReportRoute");
const roomRoute = require("./Routes/roomRoute");
const invoiceRoute = require("./Routes/invoiceRoute");
const notificationsRoute = require("./Routes/notifications Route");


const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// require("./cron/DailyPatiantReport"); // ← ده اسم الملف اللي فيه الكرون


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
app.use('/invoice' , invoiceRoute);
app.use('/notifications' , notificationsRoute);

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
