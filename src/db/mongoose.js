const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('Connected to mongoose!');
}).catch(err => {
    console.log(err);
})