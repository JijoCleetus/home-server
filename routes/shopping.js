const express = require("express");
const shoppingRouter = express.Router();
const db = require("../db/shopping");
const encrypto = require("../middlewares/crypto");
const imageUploader = require("../middlewares/imageUploader");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/tokenVerify").verifyToken;
const dateTimer = require("../middlewares/datetimer");

// Get all
shoppingRouter.get("/", verifyToken, (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        let results = await db.getAllShopping();
        res.send({
          success: true,
          shopping: results,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

shoppingRouter.post("/", verifyToken, (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        let results = await db.addShopping(req.body);
        res.send({
          success: true,
          shopping: results,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

shoppingRouter.delete("/:itemId", verifyToken, (req, res, next) => {
  const itemId = req.params.itemId;
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        let shopingList = await db.getShoppingListById(itemId);
        if (shopingList?.length > 0) {
          res.send({
            success: false,
            message: `Shopping list exists for the selected shopping. Do you still want to delete?`,
            status: 201,
          });
          return;
        }
        let results = await db.removeItemFromShopping(itemId);
        res.send({
          success: true,
          message: `Successfully deleted item`,
          status: results,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

shoppingRouter.delete("/force/:itemId", verifyToken, (req, res, next) => {
  const itemId = req.params.itemId;
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        let shopingList = await db.clearShoppingList(itemId);
        let results = await db.removeItemFromShopping(itemId);
        res.send({
          success: true,
          message: `Successfully deleted item`,
          status: results,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

shoppingRouter.post("/list", verifyToken, (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        let results = await db.addItemToShoppingList(req.body);
        res.send({
          success: true,
          applications: results,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

//Get application of specific applicationId
shoppingRouter.get("/list/:shoppingId", verifyToken, (req, res, next) => {
  const shoppingId = req.params.shoppingId;
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        let results;
        results = await db.getShoppingListById(shoppingId);
        if (results.length > 0) {
          res.send({
            success: true,
            isExists: true,
            list: results,
          });
        } else {
          res.send({
            success: true,
            isExists: false,
            remarks: "Application not found.",
          });
        }
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

shoppingRouter.put("/list/:shoppingId", verifyToken, (req, res, next) => {
  let reqData = {};
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        reqData = req.body;

        let results = await db.updateListStatus(reqData);
        // console.log(results);
        res.send({
          success: true,
          message: `Successfully updated your form`,
          status: results,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

shoppingRouter.delete("/list/:itemId", verifyToken, (req, res, next) => {
  const itemId = req.params.itemId;
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        let results = await db.removeItemFromShoppingList(itemId);
        res.send({
          success: true,
          message: `Successfully deleted item`,
          status: results,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

shoppingRouter.get("/vendors", verifyToken, (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        let results = await db.getAllVendors();
        res.send({
          success: true,
          vendors: results,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

// Get district level applications filtered by Taluk

// Bulk update special form
shoppingRouter.post("/bulkupdate", verifyToken, (req, res, next) => {
  const applicationIds = req.body.applicationIds;
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        let today = dateTimer.getDate();
        let results = await db.bulkUpdateForm(applicationIds, today);
        res.send({
          success: true,
          message: `Selected records have been approved`,
          applications: results,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

//get applications for a particular agent -- district admin view
shoppingRouter.post("/specialapplications", verifyToken, (req, res, next) => {
  const username = req.body.username;
  const submittedDate = req.body.date;
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    const districtName = authData.user.district_name;
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        let results = await db.getSpecialForms(username, submittedDate);
        if (results.length > 0) {
          res.send({
            success: true,
            applications: results,
          });
        } else {
          res.send({
            success: true,
            applications: [],
          });
        }
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

//Get application of specific adhaar
shoppingRouter.get("/applications/:adhaarNumber", async (req, res, next) => {
  const adhaarNumber = req.params.adhaarNumber;

  try {
    let results;
    // Need to remove after dicussion with Jeelani
    if (adhaarNumber === "search") {
      const adhaarNumber = req.query.adhaarNumber;
      const dob = req.query.dob;
      results = await db.search(adhaarNumber, dob);
    } else {
      results = await db.searchAdhaar(adhaarNumber);
    }
    ///////////

    // results = await db.searchAdhaar(adhaarNumber);
    if (results.length > 0) {
      res.send({
        success: true,
        isExists: true,
        status: results[0].status,
        // remarks: (results[0].remarks == "" && results[0].status == "submitted") ? `Your application is submitted` : ``,
        remarks:
          results[0].remarks == ""
            ? `Your application is ${results[0].status}`
            : ``,
        message:
          results[0].status == "submitted"
            ? `Your application is submitted`
            : ``,
        application: results[0].status == "resubmitted" ? results : [],
      });
    } else {
      res.send({
        success: true,
        isExists: false,
        remarks: "Application not found, please submit a new one.",
      });
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

//Search
shoppingRouter.get("/applications/search", async (req, res, next) => {
  const adhaarNumber = req.query.adhaarNumber;
  const dob = req.query.dob;
  console.log(req.query);
  try {
    let results = await db.search(adhaarNumber, dob);
    if (results.length > 0) {
      res.send({
        success: true,
        isExists: true,
        status: results[0].status,
        remarks: results[0].remarks,
        application: results[0].status == "resubmitted" ? results[0] : [],
      });
    } else {
      res.send({
        success: true,
        isExists: false,
        remarks: "Application not found, please submit a new one",
      });
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

//Submit application
shoppingRouter.post("/applications", async (req, res, next) => {
  // const aa = JSON.stringify(encrypto.encrypt("some ecrlk djsdlgjdjgsd sdgsdljgsdlg"));
  // console.log(aa);
  // console.log(encrypto.decrypt(JSON.parse(aa)));
  let imgAadhar,
    imgBankPassbook,
    imgWelfareFront,
    imgWelfareBack,
    oneCertificate;
  let reqData = req.body;

  try {
    // let application = await db.search(req.body.adhaarNumber, req.body.dob);
    let application = await db.searchAdhaar(req.body.adhaarNumber);
    if (application.length > 0) {
      res.send({
        success: false,
        message: "Application with same Aadhar number already exists",
      });
    } else {
      imgAadhar = await imageUploader.uploadImage(
        req.body.imgAadhar,
        "adhaar",
        req.body.adhaarNumber
      );
      imgBankPassbook = await imageUploader.uploadImage(
        req.body.imgBankPassbook,
        "bpass",
        req.body.adhaarNumber
      );
      imgWelfareFront = await imageUploader.uploadImage(
        req.body.imgWelfareFront,
        "wfarefront",
        req.body.adhaarNumber
      );
      imgWelfareBack = await imageUploader.uploadImage(
        req.body.imgWelfareBack,
        "wfareback",
        req.body.adhaarNumber
      );

      if (req.body.oneCertificateRequired === "yes") {
        oneCertificate = await imageUploader.uploadImage(
          req.body.oneCertificate,
          "onecert",
          req.body.adhaarNumber
        );
      }

      reqData.imgAadhar = process.env.S3_BASEURL + imgAadhar;
      reqData.imgBankPassbook = process.env.S3_BASEURL + imgBankPassbook;
      reqData.imgWelfareFront = process.env.S3_BASEURL + imgWelfareFront;
      reqData.imgWelfareBack = process.env.S3_BASEURL + imgWelfareBack;
      reqData.oneCertificate =
        req.body.oneCertificateRequired === "yes"
          ? process.env.S3_BASEURL + oneCertificate
          : "";
      // reqData.oneCertificate = '';
      reqData.submittedDate = dateTimer.getDate();
      reqData.rejectedDate = dateTimer.getDate();
      reqData.approvedDate = dateTimer.getDate();
      reqData.status = "submitted";
      reqData.remarks =
        "Your application already submitted and it will process soon";
      reqData.extraColmn = "";

      let results = await db.addApplication(reqData);
      let id = results.insertId;
      res.send({
        success: true,
        message: `Successfully submitted your form. Your reference number is ${id}`,
        status: results,
      });
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// inserting special forms by district agents
shoppingRouter.post("/specialform", verifyToken, (req, res, next) => {
  let reqData = {};
  // console.log(req.body);
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    const districtName = authData.user.district_name;
    const username = authData.user.username;
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        let application = await db.searchAdhaar(req.body.adhaarNumber);
        let processedApplications = await db.searchProcessedAdhar(
          req.body.adhaarNumber
        );
        if (application.length > 0) {
          res.send({
            success: false,
            message: "Application with same Aadhar number already submitted.",
          });
        } else if (processedApplications.length > 0) {
          res.send({
            success: false,
            message:
              "Application with same Aadhar number already approved and processed by bank.",
          });
        } else {
          reqData.registrationNo = req.body.registrationNo || "";
          reqData.name = req.body.name || "";
          reqData.address = req.body.address || "";
          reqData.dob = req.body.dob || "";
          reqData.age = req.body.age || "";
          reqData.mobile = req.body.mobile || "";
          reqData.adhaarNumber = req.body.adhaarNumber || "";
          reqData.district = districtName;
          reqData.taluk = "";
          reqData.village = "";
          reqData.membershipPaidFrom = "";
          reqData.membershipPaidTo = "";
          reqData.bankAccNumber = req.body.bankAccNumber || "";
          reqData.IFSCcode = req.body.IFSCcode || "";
          reqData.nameInBank = req.body.nameInBank || "";
          reqData.bankName = req.body.bankName || "";
          reqData.isAnySocialSecPension = "no";
          reqData.isMemberofOtherWFS = "no";
          reqData.submittedBy = "self";
          reqData.volunteerNumber = "";
          reqData.oneCertificateRequired = "";
          reqData.imgAadhar = "";
          reqData.imgBankPassbook = "";
          reqData.imgWelfareFront = "";
          reqData.imgWelfareBack = "";
          reqData.oneCertificate = "";
          reqData.submittedDate = dateTimer.getDate();
          reqData.rejectedDate = dateTimer.getDate();
          reqData.approvedDate = dateTimer.getDate();
          reqData.status = "submitted";
          reqData.remarks = "Applications submitted manually";
          reqData.extraColmn = username;
          // console.log(reqData);
          let results = await db.addApplication(reqData);
          let id = results.insertId;
          res.send({
            success: true,
            message: `Successfully submitted your form. Your reference number is ${id}`,
            status: results,
          });
        }
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

// special form update
shoppingRouter.put("/specialform", verifyToken, (req, res, next) => {
  let reqData = {};
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        reqData.registrationNo = req.body.registrationNo || "";
        reqData.name = req.body.name || "";
        reqData.address = req.body.address || "";
        reqData.dob = req.body.dob || "";
        reqData.age = req.body.age || "";
        reqData.mobile = req.body.mobile || "";
        reqData.adhaarNumber = req.body.adhaarNumber || "";
        reqData.bankAccNumber = req.body.bankAccNumber || "";
        reqData.IFSCcode = req.body.IFSCcode || "";
        reqData.nameInBank = req.body.nameInBank || "";
        reqData.bankName = req.body.bankName || "";
        reqData.rejectedDate = dateTimer.getDate();
        reqData.approvedDate = dateTimer.getDate();
        reqData.status = req.body.status || "";
        reqData.remarks =
          "Applications " + req.body.status + " manually by admin";

        let results = await db.updateSpecialForm(reqData);
        // console.log(results);
        res.send({
          success: true,
          message: `Successfully updated your form`,
          status: results,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

function checkBase64(img) {
  let imgUrl = "https://karshakathozhilali";
  let inputImgUrl = img.substr(0, 26);
  let retValue = inputImgUrl === imgUrl ? false : true;
  return retValue;
}

//User Update application
shoppingRouter.put("/applications", async (req, res, next) => {
  // const aa = JSON.stringify(encrypto.encrypt("some ecrlk djsdlgjdjgsd sdgsdljgsdlg"));
  // console.log(aa);
  // console.log(encrypto.decrypt(JSON.parse(aa)));
  let imgAadhar,
    imgBankPassbook,
    imgWelfareFront,
    imgWelfareBack,
    oneCertificate;
  let reqData = req.body;

  try {
    if (checkBase64(req.body.imgAadhar)) {
      let timgAadhar = await imageUploader.uploadImage(
        req.body.imgAadhar,
        "adhaar",
        req.body.adhaarNumber
      );
      imgAadhar = process.env.S3_BASEURL + timgAadhar;
    } else {
      imgAadhar = req.body.imgAadhar;
    }

    if (checkBase64(req.body.imgBankPassbook)) {
      let timgBankPassbook = await imageUploader.uploadImage(
        req.body.imgBankPassbook,
        "bpass",
        req.body.adhaarNumber
      );
      imgBankPassbook = process.env.S3_BASEURL + timgBankPassbook;
    } else {
      imgBankPassbook = req.body.imgBankPassbook;
    }

    if (checkBase64(req.body.imgWelfareFront)) {
      let timgWelfareFront = await imageUploader.uploadImage(
        req.body.imgWelfareFront,
        "wfarefront",
        req.body.adhaarNumber
      );
      imgWelfareFront = process.env.S3_BASEURL + timgWelfareFront;
    } else {
      imgWelfareFront = req.body.imgWelfareFront;
    }

    if (checkBase64(req.body.imgWelfareBack)) {
      let timgWelfareBack = await imageUploader.uploadImage(
        req.body.imgWelfareBack,
        "wfareback",
        req.body.adhaarNumber
      );
      imgWelfareBack = process.env.S3_BASEURL + timgWelfareBack;
    } else {
      imgWelfareBack = req.body.imgWelfareBack;
    }

    if (req.body.oneCertificateRequired === "yes") {
      if (checkBase64(req.body.oneCertificate)) {
        let toneCertificate = await imageUploader.uploadImage(
          req.body.oneCertificate,
          "onecert",
          req.body.adhaarNumber
        );
        oneCertificate = process.env.S3_BASEURL + toneCertificate;
      } else {
        oneCertificate = req.body.oneCertificate;
      }
    }

    reqData.imgAadhar = imgAadhar;
    reqData.imgBankPassbook = imgBankPassbook;
    reqData.imgWelfareFront = imgWelfareFront;
    reqData.imgWelfareBack = imgWelfareBack;
    reqData.oneCertificate =
      req.body.oneCertificateRequired === "yes" ? oneCertificate : "";

    reqData.submittedDate = dateTimer.getDate();
    reqData.rejectedDate = dateTimer.getDate();
    reqData.approvedDate = dateTimer.getDate();
    reqData.status = "submitted";
    reqData.remarks =
      "Your form has been updated with the changes and it is waiting for approval";
    reqData.extraColmn = "re-submitted";

    let results = await db.updateApplication(reqData);
    // let id = results.insertId;
    // console.log(results);
    res.send({
      success: true,
      message: `Successfully updated your form`,
      status: results,
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Adming update
shoppingRouter.put("/verify", verifyToken, (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let reqData = req.body;
      try {
        reqData.rejectedDate = dateTimer.getDate();
        reqData.approvedDate = dateTimer.getDate();
        let results = await db.verifyApplication(reqData);
        res.send({
          success: true,
          message: `Successfully verified the application`,
          status: results,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

module.exports = shoppingRouter;
