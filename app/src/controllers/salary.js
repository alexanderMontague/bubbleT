const ontario2010 = require('../data/ontario2010.json');
const ontario2011 = require('../data/ontario2011.json');
const ontario2012 = require('../data/ontario2012.json');
const ontario2013 = require('../data/ontario2013.json');
const testData = require('../data/test.json');

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
  let salaryFile = null;

  try {
    salaryFile = eval('ontario' + req.query.year || req.body.year);
  } catch (error) {
    console.log('Salary File Unknown', error);
    return res.json({ salaryData: null });
  }

  return res.json({ salaryData: salaryFile });
}

/*
 *   GET /api/queryData
 *
 *   REQ: {
 *      body: {
 *        queryObj: {
 *          year: String || Number || null,
 *          sector: String || null,
 *          salary: {
 *            min: String || Number,
 *            max: String || Number
 *          } || null,
 *          employer: String || null,
 *          firstName: String || null,
 *          lastName: String || null,
 *          exact: Bool || null,
 *        }
 *      }
 *   }
 *
 *   RES: {
 *     response: {
 *       queryData: Array
 *     }
 *   }
 */
function querySalaryData(req, res) {
  // TODO: remove parse once coming from FE
  const queryObj = JSON.parse(req.body.queryObj);
  let salaryFile = null;

  // TODO: does not encorporate searches without year...
  try {
    salaryFile = eval('ontario' + queryObj.year);
    // salaryFile = testData;
  } catch (error) {
    console.log('Salary File Unknown', error);
    return res.json({ queryData: null });
  }

  const queriedData = salaryFile.filter(record => {
    // sector filter
    if (
      queryObj.sector &&
      (record.sector || record._sector).content.toLowerCase() !== queryObj.sector.toLowerCase()
    ) {
      return false;
    }

    // salary filter
    record.salary_paid.content = record.salary_paid.content.replace(/\,|\$/g, '');
    if (
      queryObj.salary &&
      !(
        Number(queryObj.salary.min) <= Number(record.salary_paid.content) &&
        Number(record.salary_paid.content) <= Number(queryObj.salary.max)
      )
    ) {
      return false;
    }

    // employer filter
    if (
      queryObj.employer &&
      record.employer.content.toLowerCase() !== queryObj.employer.toLowerCase()
    ) {
      return false;
    }

    // first name filter
    if (
      queryObj.firstName &&
      record.first_name.content.toLowerCase() !== queryObj.firstName.toLowerCase()
    ) {
      return false;
    }

    // last name filter
    if (
      queryObj.lastName &&
      record.last_name.content.toLowerCase() !== queryObj.lastName.toLowerCase()
    ) {
      return false;
    }

    // TODO: confirm what exact means and then use .includes

    return true;
  });

  return res.json(queriedData);
}

// GET /api/test
function testSalaryData(req, res) {
  return res.json({
    '2010': ontario2010[0],
    '2011': ontario2011[0],
    '2012': ontario2012[0],
    '2013': ontario2013[0],
  });
}

module.exports = {
  fullSalaryData,
  querySalaryData,
  testSalaryData,
};
