const express = require('express');
const productRoutes = require('./routes');
const mongoose = require('mongoose');

const HOST = '0.0.0.0';
const PORT = 8080;

mongoose.connect('mongodb+srv://tjsry0466:!j14682533@cluster0.tk8cp.mongodb.net/Cluster0?retryWrites=true&w=majority',
    {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useFindAndModify: false
    })
    .then(() => {
        console.log('MongoDb Connected...');
    })
    .catch(err => console.log(err));

const app = express();
app.use(express.json());
app.use("/api/products/", productRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

app.use((error, req, res, next) => {
    res.status(500).json({message: error.message});
})

module.exports = app;