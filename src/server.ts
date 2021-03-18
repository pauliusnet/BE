import app from './app';
import { createConnection } from 'typeorm';

createConnection().then(() => {
    console.log('Connection to DB succeeded!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on localhost: ${port}`);
});
