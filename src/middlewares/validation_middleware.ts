import { body } from 'express-validator';

const validateNewRegister = () => {
    return[
        body('name')
            .trim()
            .isLength({min: 2}).withMessage('Name must be at least of 2 characters.')
            .isLength({max: 30}).withMessage('Name must be a maximum of 30 characters.'),
        body('surname')
            .trim()
            .isLength({min: 2}).withMessage('Surname must be at least 2 characters')
            .isLength({max: 30}).withMessage('Surname must be a maximum of 30 characters.'),
        body('email')
            .trim()
            .isEmail()
            .withMessage('Please enter a valid email.'),
        body('companyName')
            .trim()
            .isLength({min: 2}).withMessage('Company name must be at least of 25 characters.')
            .isLength({max: 30}).withMessage('Company name must be a maximum of 25 characters.'),
        body('password')
            .trim()
            .isLength({min: 6}).withMessage('Password must be at least 6 characters.')
            .isLength({max: 25}).withMessage('Password must be a maximum of 25 characters.'),
        ];
};

const validateAddNewUser = () => {
    return[
        body('name')
            .trim()
            .isLength({min: 2}).withMessage('Name must be at least of 2 characters.')
            .isLength({max: 30}).withMessage('Name must be a maximum of 30 characters.'),
        body('surname')
            .trim()
            .isLength({min: 2}).withMessage('Surname must be at least 2 characters')
            .isLength({max: 30}).withMessage('Surname must be a maximum of 30 characters.'),
        body('email')
            .trim()
            .isEmail()
            .withMessage('Please enter a valid email.'),
        body('department')
            .isNumeric(),
        body('password')
            .trim()
            .isLength({min: 6}).withMessage('Password must be at least 6 characters.')
            .isLength({max: 25}).withMessage('Password must be a maximum of 25 characters.'),
    ];
};

const validateLogin = ()=>{
    return [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Please enter a valid email.'),
        body('password')
            .trim()
            .isLength({min: 6}).withMessage('Password must be at least 6 characters.')
            .isLength({max: 25}).withMessage('Password must be a maximum of 25 characters.'),
    ];
};

const validateProduct = () => {
    return [
        body('name')
            .trim()
            .isLength({min: 3}).withMessage('Name must be at least 3 characters.')
            .isLength({max: 25}).withMessage('Name must be a maximum of 25 characters.'),
        body('number')
            .isNumeric(),
        body('barcodeNumber')
            .trim()
            .isLength({min: 12, max: 12}).withMessage('Barcode number need 12 characters.'),
        body('buyingPrice')
            .isNumeric(),
        body('saleingPrice')
            .isNumeric(),
    ];
}

export { 
    validateNewRegister, 
    validateAddNewUser,
    validateLogin, 
    validateProduct,
};