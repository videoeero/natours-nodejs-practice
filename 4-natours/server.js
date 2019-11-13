const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

console.log(process.env);

// NOTES: Start server

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App is running on port ${port}...`);
});

const x = 23;
x = 2222;
