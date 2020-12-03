const mongoose = require("mongoose");
const chalk = require("chalk");
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		});
		console.log(chalk.yellow(`MongoDB Connected: ${conn.connection.host}`));
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
};

module.exports = connectDB;
