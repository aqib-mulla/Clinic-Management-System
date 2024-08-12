import Prescription from "./prescriptionModel.js";
import PatientReg from "../models/PatientReg.js";
import HTMLToPDF from './htmlPf.js';
import Bill from "../models/Bill.js";
import fs from 'fs';

// export const savePresription = async (req, res) => {

//     try {
//         const { patientId, content } = req.body;

//         // Save the prescription to the database
//         const newPrescription = new Prescription({
//           patientId,
//           content,
//         });

//         const savedPrescription = await newPrescription.save();

//         res.json(savedPrescription);
//       } catch (error) {
//         console.error('Error saving prescription:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
// };

export const savePrescription = async (req, res) => {
    try {
        const { patientId, content } = req.body;

        // Check if there is an existing prescription for the patient
        const existingPrescription = await Prescription.findOne({ patientId });

        if (existingPrescription) {
            // Update the existing prescription
            existingPrescription.content = content;
            const updatedPrescription = await existingPrescription.save();
            res.json(updatedPrescription);
        } else {
            // Save a new prescription to the database
            const newPrescription = new Prescription({
                patientId,
                content,
            });

            const savedPrescription = await newPrescription.save();
            res.json(savedPrescription);
        }
    } catch (error) {
        console.error('Error saving/updating prescription:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getPrescription = async (req, res) => {

    try {
        const patientId = req.params.patientId;

        // Fetch prescriptions based on the patient ID
        const prescriptions = await Prescription.find({ patientId });

        res.json(prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// export const printPrescription = async (req, res) => {
//     try {
//         const { patientId } = req.params;

//         // Fetch the prescription content based on patientId from the database
//         const prescription = await Prescription.findOne({ patientId });
//         const prescriptionContent = prescription.content;

//         // Launch a headless browser
//         const browser = await puppeteer.launch({
//             executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/Chrome.exe',
//         });

//         const page = await browser.newPage();

//         // Set the content of the page to the prescription
//         await page.setContent(`<html><body>${prescriptionContent}</body></html>`);

//         // Generate PDF
//         const pdfBuffer = await page.pdf({ format: 'A4' });

//         // Close the browser
//         await browser.close();

//         // Serve the PDF as a response
//         res.contentType('application/pdf');
//         res.send(pdfBuffer);
//     } catch (error) {
//         console.error('Error generating prescription PDF:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };



// export const printPrescription = async (req, res) => {
//     try {
//         const { patientId } = req.params;

//         // Fetch the prescription content based on patientId from the database
//         const prescription = await Prescription.findOne({ patientId });
//         const prescriptionContent = prescription.content;

//         // Fetch clinic details (replace this with your actual logic to get clinic details)
//         const clinicDetails = {
//             logo: 'path/to/clinic-logo.png',
//             name: 'MH CLINIC',
//             address: ' 46/4, Hosur Rd, Kudlu Gate, Krishna Reddy Industrial Area, H.S, R Extension, Bengaluru, Karnataka 560068',
//         };

//         // Fetch patient details from PatientReg model
//         const patientDetails = await PatientReg.findOne({ _id: patientId })
//         .populate('doctorName', 'drName')
//         .exec();

//         // console.log(patientDetails);

//         // Launch a headless browser
//         const browser = await puppeteer.launch({
//             executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/Chrome.exe',
//         });

//         const page = await browser.newPage();

//         // Set the content of the page with clinic, patient, and prescription details
//         await page.setContent(`
//             <html>
//                 <head>
//                 <style>
//                 /* Add any styling needed for your prescription here */
//                 table {
//                     width: 100%;
//                 }
//                 .clinic-details img {
//                     width: 100px;
//                 }
//             </style>
//                 </head>
//                 <body>
//                 <table>
//                 <tr>
//                     <td class="clinic-details" >
//                         <img src="${clinicDetails.logo}" alt="Clinic Logo">
//                     </td>
//                     <td class="clinic-details">
//                         <h2>${clinicDetails.name}</h2>
//                     </td>
//                     <td class="clinic-details">
//                         <p>${clinicDetails.address}</p>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td  style="width: 50%; text-align: left;">
//                     Patient Name: ${patientDetails.pSalutation} ${patientDetails.pName}<br>
//                     Sex / Age:  ${patientDetails.pGender} / ${patientDetails.pAge}<br>
//                     Referred By:  ${patientDetails.doctorName.drName}</p>
//                     </td>
//                     <td class="clinic-details">

//                     </td>
//                 </tr>
//                 </table>
//                     <div class="prescription-details">${prescriptionContent}</div>
//                 </body>
//             </html>`);

//         // Generate PDF
//         const pdfBuffer = await page.pdf({ format: 'A4' });

//         // Close the browser
//         await browser.close();

//         // Serve the PDF as a response
//         res.contentType('application/pdf');
//         res.send(pdfBuffer);
//     } catch (error) {
//         console.error('Error generating prescription PDF:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

export const printPrescription = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Fetch the prescription content based on patientId from the database
        const prescription = await Prescription.findOne({ patientId });
        const prescriptionContent = prescription.content;

        // Fetch patient details from PatientReg model
        const patientDetails = await PatientReg.findOne({ _id: patientId })
            .populate('doctorName', 'drName')
            .exec();

        // Fetch bill details based on patientId
        const bill = await Bill.findOne({refId: patientId });
        const billId = bill ? bill.billId : ""; 

        // Format the bill date
        const formattedBillDate = new Date(patientDetails.createdAt).toLocaleDateString();

        // Define the HTML content with formatted bill date and horizontal line
        const htmlContent = `
         <div style="text-align: center;">
            <span style="font-weight: bold; font-size: 30px;">Care Conquer</span> <br> <br>
            <span>46/4, Hosur Rd, Kudlu Gate, Krishna Reddy Industrial Area, H.S</span><br>
            <span>, R Extension, Bengaluru, Karnataka 560068</span><br>
            <span>Email: careconqueronline@gmail.com</span><br>
            <span>PH: 8574968523 </span>
            <h5 style="text-align:center">PRESCRIPTION</h5>
            <hr style="border-top: 1px solid #000; margin: 0;">
        </div>
            <html>
                <head>
                    <style>
                        table {
                            width: 100%;
                        }
                    </style>
                </head>
                <body>
                    <table>
                        <tr>
                            <td style="width: 80%; text-align: left;">
                                Patient Name: <strong>${patientDetails.pSalutation} ${patientDetails.pName}</strong><br>
                                  <div style="margin-bottom: 8px;"></div>
                                Sex / Age:<strong> ${patientDetails.pGender} / ${patientDetails.pAge}</strong><br>
                                  <div style="margin-bottom: 8px;"></div>
                                Referred By:<strong> ${patientDetails.doctorName.drName}</strong>
                            </td>
                            <td style="width: 50%; text-align: left;">
                                Patient ID: <strong> ${patientDetails.pId} </strong><br>
                            <div style="margin-bottom: 8px;"></div>
                                Bill ID: <strong>${billId}</strong><br>
                                 <div style="margin-bottom: 8px;"></div>
                                Date:<strong> ${formattedBillDate}</strong>
                            </td>
                        </tr>
                    </table>
                    <hr style="border-top: 1px solid #000; margin: 0;">
                    <div class="prescription-details">${prescriptionContent}</div>
                </body>
            </html>`;

        // Instantiate WHHTMLToPDF and generate the PDF
        const pdfGenerator = new HTMLToPDF();
        const pdfBuffer = await pdfGenerator.generatePDF(htmlContent);

        // Serve the PDF as a response
        res.contentType('application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating prescription PDF:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

