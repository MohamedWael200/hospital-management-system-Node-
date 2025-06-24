const cron = require("node-cron");
const VisitReport = require("../models/VisitReport");
const Patient = require("../models/Patient");
const User = require("../models/User");
const sendEmail = require("../utils/SendEmail");

cron.schedule("* * * * *", async () => {
    // الساعة 10:00 مساءً كل يوم
    console.log("⏰ Running daily visit report sender at", new Date());

    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));   // 00:00:00
    const end = new Date(today.setHours(23, 59, 59, 999)); // 23:59:59

    try {
        const reports = await VisitReport.find({
            createdAt: { $gte: start, $lte: end }
        }).populate("patientId");

        if (!reports.length) return console.log("❗No reports created today");

        for (const report of reports) {
            const patient = await Patient.findById(report.patientId).populate("userId");

            if (patient?.userId?.email) {
                const email = patient.userId.email;
                const name = patient.userId.name;
                const pdfLink = `http://localhost:3000/${report.pdfReportPath.replace(/\\/g, "/")}`;

                const html = `
<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
  <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
    <div style="background-color: #0077b6; padding: 20px; text-align: center; color: white;">
      <h2>Visit Report Summary</h2>
    </div>

    <div style="padding: 20px;">
      <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>
      <p style="font-size: 15px; color: #333;">We hope you're doing well.</p>
      <p style="font-size: 15px;">Your medical visit report for today has been generated and is now available.</p>

      <div style="margin: 20px 0; text-align: center;">
        <a href="${pdfLink}" target="_blank" style="background-color: #0077b6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">Download Report (PDF)</a>
      </div>

      <p style="font-size: 14px; color: #555;">If you have any questions or need further assistance, feel free to contact our team.</p>

      <div style="margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 10px;">
        <p>Thank you for trusting our hospital. We wish you a speedy recovery.</p>
        <p>— Hospital Management System (Mohamed Wael Mohamed)</p>
      </div>
    </div>
  </div>
</div>
`;


                await sendEmail(email, "📄 Your Medical Visit Report", "", html);
                console.log(`📬 Sent to ${name}`);
            }
        }
    } catch (error) {
        console.error("❌ Cron Job Error:", error.message);
    }
});
