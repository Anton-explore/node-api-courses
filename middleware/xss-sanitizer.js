const xssFilters = require('xss-filters');

const xssSanitizer = (req, res, next) => {
    if (req.body) {
        for (const key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                if (Array.isArray(req.body[key])) {
                    req.body[key] = req.body[key].map(item => xssFilters.inHTMLData(item));
                } else {
                    req.body[key] = xssFilters.inHTMLData(req.body[key]);
                }
            }
        }
    }

    if (req.params) {
        for (const key in req.params) {
            if (req.params.hasOwnProperty(key)) {
                req.params[key] = xssFilters.inHTMLData(req.params[key]);
            }
        }
    }

    next();
};

module.exports = xssSanitizer;