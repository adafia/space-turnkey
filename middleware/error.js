
module.exports = (err, req, res) => {
  res.status(500).send({
    message: 'Internal server error. Something failed at our end try again in a few minutes while we fix it.', err,
  });
};
