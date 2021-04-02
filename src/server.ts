import { createConnection } from 'typeorm';
import app from './app';

createConnection().then(() => {
    console.log('Connection to DB succeeded!');
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on localhost: ${port}`);
});
