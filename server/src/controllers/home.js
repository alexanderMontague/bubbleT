/*
 *   GET /api/v1/public/test
 *
 *   REQ: NULL
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
function test(req, res) {
  return res.json({ hello: 'world' });
}

module.exports = {
  test,
};
