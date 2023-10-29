
const app = require('./router');

app.get('/ping-account', (req, res) => {
    return res.status(200).send(JSON.stringify({
        message: "pong"
    }));
});


app.listen(9000, () => console.log('App listen at 9000'));