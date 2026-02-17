import app from './src/app.js';
import connectDb from './src/config/db/db.js';
import { PORT } from './src/config/env/env.js';

app.listen(PORT, async () => {
    await connectDb()
    console.log(`Server is running on http://localhost:${PORT}`);
})