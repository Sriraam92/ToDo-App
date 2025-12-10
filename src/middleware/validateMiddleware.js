export const validate = (schema) => {
  return (req, res, next) => {
    const options = {
      abortEarly: false,        // return all errors, not just first
      allowUnknown: false,      // reject unknown fields
      stripUnknown: true        // remove extra fields
    };

    const { error, value } = schema.validate(req.body, options);

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map(err => err.message)
      });
    }

    req.body = value;
    next();
  };
};
