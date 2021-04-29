const multiparty = require("multiparty");

const getFiles = (req, res, next) => {
  try {
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
      if (err) {
        throw new Error(err);
      }
      // req
      req.locals = {};
      req.locals["fields"] = fields;
      req.locals["files"] = files;
      next();
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getFiles;
