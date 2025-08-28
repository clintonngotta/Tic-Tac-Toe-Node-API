import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());
app.use(cors());

app.get("/", (req, res) => {
	res.send("root route");
});

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
	console.log(`Server is running @${port}`);
});
