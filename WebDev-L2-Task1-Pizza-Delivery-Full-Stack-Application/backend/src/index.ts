import { createApp } from "./app";
import { constants } from "./configs/constants";
import { initScheduledJobs } from "./jobs/inventory.job";

const app = createApp();

app.listen(constants.PORT, () => {
  console.log(`Server is running on port ${constants.PORT}`);
  initScheduledJobs();
});
