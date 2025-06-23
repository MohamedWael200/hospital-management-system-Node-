const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const VisitReport = require("../models/VisitReport");
const sanitize = require("validator").escape;
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor")
const Patient = require("../models/Patient")


const createVisitReport = async (req, res) => {
    try {
        const { appointmentId, diagnosis, notes, doctorId, patientId } = req.body;

        if (!appointmentId || !diagnosis || !notes || !doctorId || !patientId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const doctor = await Doctor.findById(doctorId).populate("userId", "name");
        const doctorName = doctor.userId.name;

        const patient = await Patient.findById(patientId).populate("userId", "name");
        const patientName = patient.userId.name;

        const appointment = await Appointment.findById(appointmentId);

        // إنشاء ملف PDF
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 50, right: 50 },
            info: {
                Title: 'Visit Report',
                Author: 'Clinic Management System',
            }
        });

        const filename = `visit-report-${Date.now()}.pdf`;
        const pdfPath = path.join("uploads/reports", filename);

        // تأكد من وجود المجلد
        fs.mkdirSync(path.dirname(pdfPath), { recursive: true });

        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);

        // إضافة رأس الصفحة
        // doc.image('path/to/your/logo.png', 50, 45, { width: 50 })
        //     .fillColor('#444444')
        //     .fontSize(20)
        //     .text('Medical Visit Report', 110, 57)
        //     .fontSize(10)
        //     .text('123 Medical Street', 200, 65, { align: 'right' })
        //     .text('Cairo, Egypt', 200, 80, { align: 'right' })
        //     .moveDown();

        // رسم خط أفقي
        doc.strokeColor('#aaaaaa')
            .lineWidth(1)
            .moveTo(50, 120)
            .lineTo(550, 120)
            .stroke();

        // معلومات التقرير الأساسية
        doc.fontSize(12)
            .fillColor('#555555')
            .text('Report Details:', 50, 140)
            .moveDown(0.5);

        // جدول المعلومات
        const startY = 170;
        doc.font('Helvetica-Bold').text('Doctor Name:', 50, startY);
        doc.font('Helvetica').text(doctorName, 200, startY);

        doc.font('Helvetica-Bold').text('Patient Name:', 50, startY + 25);
        doc.font('Helvetica').text(patientName, 200, startY + 25);

        doc.font('Helvetica-Bold').text('Appointment Date:', 50, startY + 50);
        doc.font('Helvetica').text(new Date(appointment.date).toLocaleDateString(), 200, startY + 50);

        doc.font('Helvetica-Bold').text('Status:', 50, startY + 75);
        doc.font('Helvetica').text(appointment.status, 200, startY + 75);

        // قسم التشخيص
        doc.moveTo(50, startY + 110)
            .lineTo(550, startY + 110)
            .stroke();

        doc.fontSize(14)
            .fillColor('#333333')
            .text('Diagnosis', 50, startY + 120)
            .moveDown(0.5);

        doc.fontSize(12)
            .fillColor('#000000')
            .text(diagnosis, {
                width: 500,
                align: 'left'
            })
            .moveDown();

        // قسم الملاحظات
        doc.moveTo(50, doc.y + 20)
            .lineTo(550, doc.y + 20)
            .stroke();

        doc.fontSize(14)
            .fillColor('#333333')
            .text('Notes', 50, doc.y + 30)
            .moveDown(0.5);

        doc.fontSize(12)
            .fillColor('#000000')
            .text(notes, {
                width: 500,
                align: 'left'
            });

        // تذييل الصفحة
        const footerY = 750;
        doc.fontSize(10)
            .text(`Report generated on ${new Date().toLocaleDateString()}`, 50, footerY, {
                align: 'left'
            })
            .text('Page 1 of 1', 0, footerY, {
                align: 'right'
            });

        doc.end();

        // انتظر انتهاء الحفظ
        stream.on("finish", async () => {
            const newVisitReport = new VisitReport({
                appointmentId: sanitize(appointmentId),
                diagnosis: sanitize(diagnosis),
                notes: sanitize(notes),
                doctorId: sanitize(doctorId),
                patientId: sanitize(patientId),
                pdfReportPath: pdfPath,
            });

            await newVisitReport.save();

            return res.status(200).json({
                message: "Visit report created successfully",
                data: newVisitReport,
            });
        });
    } catch (error) {
        console.error("Create Visit Report Error:", error);
        res.status(500).json({
            message: "Creating visit report failed",
            error: error.message,
        });
    }
};

const getOneVisitReport = async (req , res) => {
    try {
        const id = req.params.id;
        const report = await VisitReport.findById(id);

        if(!report) {
            res.status(201).json({message : "There is no report for this patient."})
        }

        report.pdfReportPath = `http://localhost:3000/${report.pdfReportPath.replace(/\\/g, '/')}`;

        res.status(200).json({
            message: "report for this patient fetch Scussfully.",
            data: report,
        });

    } catch (error) {
        console.error("Create Visit Report Error:", error);
        res.status(500).json({
            message: "Creating visit report failed",
            error: error.message,
        });
    }
}

module.exports = {
    createVisitReport,
    getOneVisitReport
}