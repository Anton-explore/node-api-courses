const mongoose = require('mongoose');

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };


const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    const conn = await mongoose.connect(uri, clientOptions);

    await mongoose.connection.db.admin().command({ ping: 1 });

    console.log(`MongoDB connected: ${conn.connection.host}`
        .cyan.underline.bold
    );
}

module.exports = connectDB;