const handleErrors = (res, error) => {
  return res.status(400).send({ error: error.toString() });
};
module.exports = {
  handleErrors,
};
