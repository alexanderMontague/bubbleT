const ontario2017 = require('../salaryData/ontario2017.json');

/*
 *   GET /api/salaryData
 *
 *   REQ: {
 *
 *   }
 *
 *   RES: {
 *     response: {
 *       code: Integer,
 *       message: String,
 *       data: Object || Array || null,
 *       error: Boolean
 *     }
 *   }
 */
function fullSalaryData(req, res) {
  const salaryYear = req.query.year || req.body.year;

  return res.json(eval('ontario' + salaryYear));
}

module.exports = {
  fullSalaryData,
};
