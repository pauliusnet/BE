const dotenv = require('dotenv');
const path = require('path');

if (process.env.ENVIRONMENT) {
    dotenv.config({ path: path.resolve(__dirname, `.env.${process.env.ENVIRONMENT}`) });
} else {
    dotenv.config({ path: path.resolve(__dirname, `.env`) });
}
