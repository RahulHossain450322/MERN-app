const app = require("./App");
require("dotenv");
const PORT = process.env.URL || 5000;
app.listen(PORT);
