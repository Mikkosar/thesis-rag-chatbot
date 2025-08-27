import createApp from "./app";
import { connectDB } from "./config/db";

const PORT = Number(process.env.PORT) || 4000;

const startServer = async () => {
  await connectDB();

  const app = createApp();

  app.listen(PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
