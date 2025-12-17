import app from './src/app.js';
import {DB_HOST, DB_NAME, SERVER_PORT} from "./src/utils/config.js";

const port = SERVER_PORT


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});