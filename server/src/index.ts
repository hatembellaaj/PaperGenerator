import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import assistSectionRouter from './routes/assistSection.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', assistSectionRouter);

const port = process.env.PORT || 9551;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
