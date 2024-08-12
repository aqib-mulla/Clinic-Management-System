import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import multer from 'multer';
import  helmet from 'helmet'
import morgan from 'morgan';
import path from "path";
import { fileURLToPath } from 'url';
import register from "./controllers/auth.js"
import tests from "./controllers/tests.js"
import createdoctor from './controllers/createdoctor.js';
import { getdoctor } from './controllers/createdoctor.js';
import { getDoctorById } from './controllers/createdoctor.js';
import { updateDoctor } from './controllers/createdoctor.js';
import { deleteDoctor } from './controllers/createdoctor.js';
import { getpatients } from './controllers/auth.js';
import { createPatient } from './controllers/auth.js';
import { nextpId } from './controllers/auth.js';
import { getPatientById } from './controllers/auth.js';
import { updatePatient } from './controllers/auth.js';
import { deletePatient } from './controllers/auth.js';
import { nextTestid } from './controllers/tests.js';
import { createTest } from './controllers/tests.js';
import groupTest from './controllers/groupTest.js';
import { getTestList } from './controllers/tests.js';
import { updateTest } from './controllers/tests.js';
import { fintTestById } from './controllers/tests.js';
import { getgroupTests } from './controllers/groupTest.js';
import { fintGroupTestById } from './controllers/groupTest.js';
import { updateGroupTestById } from './controllers/groupTest.js';
import { testfindType } from './controllers/tests.js';
import createProfile from './controllers/createProfile.js';
import { getProfiles } from './controllers/createProfile.js';
import { deleteGroup } from './controllers/groupTest.js';
import { deleteProfile } from './controllers/createProfile.js';
import { deleteTest } from './controllers/tests.js';
import { findProfilebyId } from './controllers/createProfile.js';
import { updateProfileTestById } from './controllers/createProfile.js';
import { billDetails, deleteBill } from './controllers/bill.js';
import bill from './controllers/bill.js';
import { collectDueAmount, reports } from './controllers/bill.js';
import testDetails from './controllers/labResultentry.js';
import { saveResult } from './controllers/labResultentry.js';
import { getEnteredResult } from './controllers/labResultentry.js';
import dailyCollectionreport, { downloadDailyCollection, downloadTestList, downloadGroupList, downloadMonthlyCollection, dailyRegistration, downloadDailyRegistration } from './controllers/reports.js';
import { monthlyCollectionreport , testperformance,sendWhatsappPromotion, mostTestConducted,patientPerformance, getMostVisitingPatients} from './controllers/reports.js';
import { monthlydueCollectionreport } from './controllers/reports.js';
import { doctorWiseCollection, downloadDoctorWise, deptWiseCollection, downloadDeptWiseReport } from './controllers/reports.js';
import { updatebillTest } from './controllers/bill.js';
import { labReport, sendEmail, sendCultureEmail, sendWhatsapp, sendCultureWhatsapp, WHlabReport, cultureWHlabReport, cultureNHlabReport } from './controllers/labReport.js';
import { CreateUser } from './controllers/login.js';
import { getUser } from './controllers/login.js';
import { getUsers } from './controllers/login.js';
import { updateUser } from './controllers/login.js';
import { deleteUser } from './controllers/login.js';
import { storeAccess } from './controllers/login.js';
import { getAccess } from './controllers/login.js';
import { Login } from './controllers/login.js';
import { billPrint } from './controllers/bill.js';
import { createBill } from './controllers/auth.js';
import { addFees, getFeesList, feesMaster,getFees, deleteFees, filterFees, updateFees, getDepartments } from './controllers/feesMaster.js';
import { savePrescription, getPrescription, printPrescription } from './controllers/patientPrescription.js';

// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
// Allow requests from the frontend origin (http://localhost:3000)
app.use(cors({ origin: 'http://localhost:3000' }));
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));


//FILE  STORAGE CONFIG
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, "public/assests");
    },
    filename:function(req, file, cb){
        cb(null,file.originalname)
    }
});
const upload = multer({storage});


//Login 
app.post("/auth/createUser", CreateUser);
app.get("/auth/getUser", getUser);
app.get("/auth/getUser/:id", getUsers);
app.put("/auth/updateUser/:id", updateUser);
app.delete("/auth/deleteUser/:id", deleteUser);
app.post("/auth/store-user-access", storeAccess);
app.get("/auth/getAccess/:id", getAccess);
app.post("/auth/login", Login);



// Patients Route
app.post("/auth/create-patient", createPatient);
app.post("/auth/register", register);
app.post("/auth/oldBill", createBill);
app.get("/auth/next-patient-id", nextpId);
app.get("/auth/findPatientByid/:id", getPatientById);
app.put("/auth/update-patient/:id", updatePatient);
app.get("/auth/get-patients", getpatients);
app.delete('/auth/delete-patient/:pId', deletePatient);

//Test Routes
app.get("/auth/tests", tests);
app.get("/auth/getTestList", getTestList);
app.post("/auth/create-test", createTest);
app.get("/auth/next-test-id", nextTestid);
app.get("/auth/findtestByid/:id", fintTestById);
app.put("/auth/update-test/:id", updateTest);
app.get("/auth/testfindType/:id", testfindType);
app.delete('/auth/deleteTest/:id', deleteTest);


//Group Test Routes
app.post("/auth/create-groupTest", groupTest);
app.get("/auth/getGroupTestList", getgroupTests);
app.get("/auth/groupfindByidTest/:id", fintGroupTestById);
app.put("/auth/update-groupTest/:id", updateGroupTestById);
app.delete('/auth/deleteGroup/:id', deleteGroup);

//Get fees
app.get("/auth/getfeesList", getFees);


//Profile Test Routes
app.post("/auth/create-Profile", createProfile);
app.get("/auth/getProfileList", getProfiles);
app.delete('/auth/deleteProfile/:id', deleteProfile);
app.get("/auth/findProfilebyId/:id", findProfilebyId);
app.put("/auth/updateProfileTest/:id", updateProfileTestById);


//Doctor Routes
app.post("/auth/create-doctor", createdoctor);
app.get("/auth/get-doctors", getdoctor);
app.get("/auth/findDoctorByid/:id", getDoctorById);
app.put("/auth/update-doctor/:id", updateDoctor);
app.delete('/auth/delete-doctor/:doctorId', deleteDoctor);

//Bill Routs
app.get("/auth/bills", bill);
app.get("/auth/reports", reports);
app.get("/auth/billDetails/:id", billDetails);
app.put("/auth/updateDueAmount/:id", collectDueAmount);
app.put("/auth/updateTest/:id", updatebillTest);
app.delete('/auth/deleteBill/:id', deleteBill);
app.post("/auth/print-bill/:id", billPrint);


//Lab Result Entry
app.get("/auth/labResultDetails/:id", testDetails);
app.post("/auth/saveResults/:id", saveResult);
app.get("/auth/fetchResult/:id", getEnteredResult);
app.post("/auth/print-pdf/:id", labReport);
app.post("/auth/wh-print-pdf/:id", WHlabReport);
app.post("/auth/wh-culture-pdf/:id", cultureWHlabReport);
app.post("/auth/nh-culture-pdf/:id", cultureNHlabReport);
app.post("/auth/send-whatsapp/:id", sendWhatsapp);
app.post("/auth/send-culture-whatsapp/:id", sendCultureWhatsapp);
app.post("/auth/send-email/:id", sendEmail);
app.post("/auth/send-culture-email/:id", sendCultureEmail);

//Reports
app.get("/auth/dailyCollection/:date", dailyCollectionreport);
app.get("/auth/monthlyCollection/:month", monthlyCollectionreport);
app.get("/auth/monthlydueCollection/:month", monthlydueCollectionreport);
app.get("/auth/dailyRegistration/:date", dailyRegistration);
app.get("/auth/doctorWiseCollection/:doctorId/:date", doctorWiseCollection);
app.get("/auth/deptWiseCollection/:deptName/:date", deptWiseCollection);



//Download Excel Report
app.get("/auth/downloadDailyCollection/:date", downloadDailyCollection);
app.get("/auth/downloadMonthlyCollection/:month", downloadMonthlyCollection);
app.get("/auth/downloadRegistration/:date", downloadDailyRegistration);
app.get("/auth/downloadDoctorWiseCollection/:doctorId/:date", downloadDoctorWise);
app.get("/auth/downloadDeptWiseCollection/:deptName/:date", downloadDeptWiseReport);



//Download Tests
app.get("/auth/export-to-excel", downloadTestList);
app.get("/auth/export-groupTest", downloadGroupList);

//Backup
app.get("/auth/backup", bill);

//FeesMaster Routes
app.post("/auth/addDepartment", feesMaster);
app.get("/auth/getDepartments", getDepartments);
app.post("/auth/saveFees", addFees);
app.get("/auth/feesList", getFeesList);
app.put("/auth/updateFees/:id", updateFees);
app.get("/auth/filterFees/:department", filterFees);
app.delete('/auth/deleteFees/:id', deleteFees);

//Save Prescription
app.post("/auth/save-prescription", savePrescription);
app.get("/auth/get-prescriptions/:patientId", getPrescription);
app.post("/auth/print-prescriptions/:patientId", printPrescription);


app.get("/auth/performance", testperformance);
app.get("/auth/patient-performance", patientPerformance);
app.get("/auth/most-visiting-patients", getMostVisitingPatients);
app.get("/auth/most-conducted-tests", mostTestConducted);
app.post("/auth/send-whatsapp", sendWhatsappPromotion);



// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
useNewUrlParser: true,
useUnifiedTopology: true,
})
.then(()=>{
app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
})
.catch((error)=> console.log(`${error} did not connect`))
