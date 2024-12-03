const pool = require("../index.js").mysql_pool;

let shoppingListDb = {};

shoppingListDb.getAllShopping = () => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM shopping`, (err, results) => {
      if (err) {
        reject(err);
      }
      return resolve(results);
    });
  });
};

shoppingListDb.getAllVendors = () => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM vendor`, (err, results) => {
      if (err) {
        reject(err);
      }
      return resolve(results);
    });
  });
};

shoppingListDb.getShoppingListById = (shoppingId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM shopping_list WHERE shoppingId = ? `,
      shoppingId,
      (err, results) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};

shoppingListDb.updateListStatus = (data) => {
  const query =
    "UPDATE shopping_list SET active = ? WHERE id = ? AND shoppingId = ?";
  return new Promise((resolve, reject) => {
    pool.query(
      query,
      [data.active, data.id, data.shoppingId],
      (err, results, fields) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};

shoppingListDb.addShopping = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO shopping(name,vendor)
        values(?,?)`,
      [data.name, data.vendor],
      (err, results) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};
shoppingListDb.addItemToShoppingList = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO shopping_list(shoppingId,title,active,category)
        values(?,?,?,?)`,
      [data.shoppingId, data.title, data.active, data.category],
      (err, results) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};

shoppingListDb.removeItemFromShopping = (id) => {
  const query = `DELETE FROM shopping WHERE id = ?`;
  return new Promise((resolve, reject) => {
    pool.query(query, [id], (err, results) => {
      if (err) {
        reject(err);
      }
      return resolve(results);
    });
  });
};

shoppingListDb.removeItemFromShoppingList = (id) => {
  const query = `DELETE FROM shopping_list WHERE id = ?`;
  return new Promise((resolve, reject) => {
    pool.query(query, [id], (err, results) => {
      if (err) {
        reject(err);
      }
      return resolve(results);
    });
  });
};

shoppingListDb.clearShoppingList = (id) => {
  const query = `DELETE FROM shopping_list WHERE shoppingId = ?`;
  return new Promise((resolve, reject) => {
    pool.query(query, [id], (err, results) => {
      if (err) {
        reject(err);
      }
      return resolve(results);
    });
  });
};

shoppingListDb.search = (aadharNumber, dob) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM kswfapplication WHERE adhaarNumber = ? AND dob = ?`,
      [aadharNumber, dob],
      (err, results) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};

shoppingListDb.searchAdhaar = (aadharNumber) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM kswfapplication WHERE adhaarNumber = ? `,
      aadharNumber,
      (err, results) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};

shoppingListDb.searchProcessedAdhar = (aadharNumber) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM completedApplication WHERE adhaarNumber = ? `,
      aadharNumber,
      (err, results) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};

shoppingListDb.getProcessedApplication = (aadharNumber) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM completedApplication WHERE adhaarNumber = ? `,
      aadharNumber,
      (err, results) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};

shoppingListDb.getSpecialForms = (username, submittedDate) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM kswfapplication WHERE extraColmn = ? AND submittedDate = ? AND status = ?`,
      [username, submittedDate, "submitted"],
      (err, results) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};

shoppingListDb.addApplication = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO kswfapplication(name,address,dob,age,mobile,registrationNo,adhaarNumber,district,taluk,village,membershipPaidFrom,membershipPaidTo,bankAccNumber,IFSCcode,nameInBank,bankName,isAnySocialSecPension,isMemberofOtherWFS,submittedBy,volunteerNumber,submittedDate,rejectedDate,approvedDate,oneCertificateRequired,imgAadhar,imgBankPassbook,imgWelfareFront,imgWelfareBack,oneCertificate,status,remarks,extraColmn)
        values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,

      [
        data.name,
        data.address,
        data.dob,
        data.age,
        data.mobile,
        data.registrationNo,
        data.adhaarNumber,
        data.district,
        data.taluk,
        data.village,
        data.membershipPaidFrom,
        data.membershipPaidTo,
        data.bankAccNumber,
        data.IFSCcode,
        data.nameInBank,
        data.bankName,
        data.isAnySocialSecPension,
        data.isMemberofOtherWFS,
        data.submittedBy,
        data.volunteerNumber,
        data.submittedDate,
        data.rejectedDate,
        data.approvedDate,
        data.oneCertificateRequired,
        data.imgAadhar,
        data.imgBankPassbook,
        data.imgWelfareFront,
        data.imgWelfareBack,
        data.oneCertificate,
        data.status,
        data.remarks,
        data.extraColmn,
      ],
      (err, results, fields) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};

shoppingListDb.updateApplication = (data) => {
  const query =
    "UPDATE kswfapplication SET name = ?,address = ?,dob = ?,age = ?,mobile = ?,registrationNo = ?,adhaarNumber = ?,district = ?,taluk = ?,village = ?,membershipPaidFrom = ?,membershipPaidTo = ?,bankAccNumber = ?,IFSCcode = ?,nameInBank = ?,bankName = ?,isAnySocialSecPension = ?,isMemberofOtherWFS = ?,submittedBy = ?,volunteerNumber = ?,submittedDate = ?,rejectedDate = ?,approvedDate = ?,oneCertificateRequired = ?,imgAadhar = ?,imgBankPassbook = ?,imgWelfareFront = ?,imgWelfareBack = ?,oneCertificate = ?,status = ?,remarks = ?,extraColmn = ? WHERE adhaarNumber = ? AND applicationId =?";
  return new Promise((resolve, reject) => {
    pool.query(
      query,
      [
        data.name,
        data.address,
        data.dob,
        data.age,
        data.mobile,
        data.registrationNo,
        data.adhaarNumber,
        data.district,
        data.taluk,
        data.village,
        data.membershipPaidFrom,
        data.membershipPaidTo,
        data.bankAccNumber,
        data.IFSCcode,
        data.nameInBank,
        data.bankName,
        data.isAnySocialSecPension,
        data.isMemberofOtherWFS,
        data.submittedBy,
        data.volunteerNumber,
        data.submittedDate,
        data.rejectedDate,
        data.approvedDate,
        data.oneCertificateRequired,
        data.imgAadhar,
        data.imgBankPassbook,
        data.imgWelfareFront,
        data.imgWelfareBack,
        data.oneCertificate,
        data.status,
        data.remarks,
        data.extraColmn,
        data.adhaarNumber,
        data.applicationId,
      ],
      (err, results, fields) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};

shoppingListDb.verifyApplication = (data) => {
  const query =
    "UPDATE kswfapplication SET status = ?,remarks = ?,extraColmn = ?,approvedDate = ?,rejectedDate = ? WHERE applicationId = ?";
  return new Promise((resolve, reject) => {
    pool.query(
      query,
      [
        data.status,
        data.remarks,
        data.extraColmn,
        data.approvedDate,
        data.rejectedDate,
        data.applicationId,
      ],
      (err, results, fields) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};

shoppingListDb.bulkUpdateForm = (applicationIds, today) => {
  let inQuery = "";
  let status = "approved";
  let remarks = "Applications submitted manually";
  if (applicationIds && applicationIds.length > 0) {
    applicationIds.map((item) => {
      inQuery = inQuery + "?, ";
    });
  }
  inQuery = inQuery.substr(0, inQuery.length - 2);
  const query =
    "UPDATE kswfapplication SET status = ?,approvedDate = ? WHERE remarks =?  AND applicationId in (" +
    inQuery +
    ")";
  return new Promise((resolve, reject) => {
    pool.query(
      query,
      [status, today, remarks, ...applicationIds],
      (err, results, fields) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = shoppingListDb;
