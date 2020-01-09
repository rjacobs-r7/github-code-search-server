const Validator = require('input-field-validator');
const ValidationError = require('./error/ValidationError');
const CodeSearch = require('./CodeSearch');

const validate = (input, rules) => {
  const validator = new Validator(input, rules);
  if (validator.validate()) {
    return true;
  }

  throw new ValidationError(validator.errors);
};

const errorHandler = (res, error) => {
  if (error.httpstatus && error.getResponseBody) {
    return res.status(error.httpstatus).send(error.getResponseBody());
  }

  return res.status(500).send({
    message: error.message
  });
};

module.exports = app => {
  app.post('/:project', (req, res) => {
    console.log(req.body, req.params);
    validate({ ...req.body, ...req.params }, {
      project: ['required', 'minlength:1'],
      query: ['required', 'minlength:3']
    });

    new CodeSearch(req.params.project).search(req.body.query)
      .then(results => res.status(200).send(results))
      .catch(err => errorHandler(res, err));
  });
};
