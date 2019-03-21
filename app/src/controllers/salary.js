const ontario2010 = require('../data/ontario2010.json');
const ontario2011 = require('../data/ontario2011.json');
const ontario2012 = require('../data/ontario2012.json');

/*
 *   GET /api/salaryData
 *
 *   REQ: {
 *      body || query: {
 *        year: Number
 *      }
 *   }
 *
 *   RES: {
 *     response: {
 *       salaryData: Array || null
 *     }
 *   }
 */
function fullSalaryData(req, res) {
  const salaryYear = req.query.year || req.body.year;
  const salaryFile = eval('ontario' + salaryYear);

  if (!salaryFile) {
    return res.json({ salaryData: null });
  }

  return res.json({ salaryData: salaryFile });
}

module.exports = {
  fullSalaryData,
};
