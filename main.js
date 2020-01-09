const PORT = 3001;

const app = require('express')();
const BodyParser = require('body-parser');

app.use(require('./middleware/cors'));
app.use(BodyParser.json());

require('./handlers')(app);

app.listen(PORT);
console.log(`Listening on port ${PORT}`);