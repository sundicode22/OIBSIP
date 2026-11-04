import { createApp } from "./app.js";
import { constants } from "./configs/constants.js";

createApp().listen(constants.PORT, () => {
  console.log(`Server is running on port ${constants.PORT}`);
});
