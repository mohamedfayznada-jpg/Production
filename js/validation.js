// ======================================================
// MES CORE V27 Enterprise
// File: /js/validation.js
// Part 1 / 4
// ======================================================

class Validator {

    required(value) {

        return value !== null &&
               value !== undefined &&
               value !== "";

    }

    number(value) {

        return !isNaN(Number(value));

    }

    integer(value) {

        return Number.isInteger(Number(value));

    }

    positive(value) {

        return this.number(value) &&
               Number(value) > 0;

    }

    min(value, min) {

        return Number(value) >= min;

    }

    max(value, max) {

        return Number(value) <= max;

    }

    between(value, min, max) {

        return this.min(value, min) &&
               this.max(value, max);

    }

    email(value) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    }

    length(value, min, max) {

        const len = String(value).length;

        return len >= min &&
               len <= max;

    }

}

const validator = new Validator();


// ======================================================
// MES CORE V27 Enterprise
// File: /js/validation.js
// Part 2 / 4
// ======================================================

Validator.prototype.pattern = function (value, regex) {

    return regex.test(String(value));

};

Validator.prototype.oneOf = function (value, list) {

    return list.includes(value);

};

Validator.prototype.notEmpty = function (value) {

    return String(value).trim().length > 0;

};

Validator.prototype.date = function (value) {

    return !isNaN(Date.parse(value));

};

Validator.prototype.time = function (value) {

    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

};

Validator.prototype.boolean = function (value) {

    return typeof value === "boolean";

};

Validator.prototype.array = function (value) {

    return Array.isArray(value);

};

Validator.prototype.object = function (value) {

    return value !== null &&
           typeof value === "object" &&
           !Array.isArray(value);

};

Validator.prototype.phone = function (value) {

    return /^\+?[0-9]{7,15}$/.test(String(value));

};

Validator.prototype.url = function (value) {

    try {

        new URL(value);

        return true;

    } catch {

        return false;

    }

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/validation.js
// Part 3 / 4
// ======================================================

Validator.prototype.alpha = function (value) {

    return /^[A-Za-z\s]+$/.test(String(value));

};

Validator.prototype.alphaNumeric = function (value) {

    return /^[A-Za-z0-9\s]+$/.test(String(value));

};

Validator.prototype.numeric = function (value) {

    return /^\d+$/.test(String(value));

};

Validator.prototype.decimal = function (value) {

    return /^-?\d+(\.\d+)?$/.test(String(value));

};

Validator.prototype.json = function (value) {

    try {

        JSON.parse(value);

        return true;

    } catch {

        return false;

    }

};

Validator.prototype.startsWith = function (value, prefix) {

    return String(value).startsWith(prefix);

};

Validator.prototype.endsWith = function (value, suffix) {

    return String(value).endsWith(suffix);

};

Validator.prototype.contains = function (value, text) {

    return String(value).includes(text);

};

Validator.prototype.unique = function (value, array) {

    return !array.includes(value);

};

Validator.prototype.equal = function (value1, value2) {

    return value1 === value2;

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/validation.js
// Part 4 / 4
// ======================================================

Validator.prototype.validate = function (rules = {}, data = {}) {

    const errors = {};

    for (const field in rules) {

        const validators = rules[field];

        const value = data[field];

        for (const rule of validators) {

            const valid = rule(value);

            if (!valid) {

                if (!errors[field]) {

                    errors[field] = [];

                }

                errors[field].push("Validation failed");

            }

        }

    }

    return {

        valid: Object.keys(errors).length === 0,

        errors

    };

};

Validator.prototype.firstError = function (result) {

    if (result.valid) {

        return null;

    }

    const key = Object.keys(result.errors)[0];

    return result.errors[key][0];

};

Validator.prototype.destroy = function () {

    return true;

};

export default validator;

export {

    validator,

    Validator

};
