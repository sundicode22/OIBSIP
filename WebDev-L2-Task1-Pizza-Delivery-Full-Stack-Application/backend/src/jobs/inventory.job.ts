import cron from "node-cron";
import { prisma } from "../configs";
import { constants } from "../configs/constants";
import { sendEmail } from "../services/email.service";

export const checkLowStockAndNotify = async (): Promise<void> => {
  try {
    const lowStockItems = await prisma.ingredient.findMany({
      where: {
        stock: {
          lt: constants.LOW_STOCK_THRESHOLD,
        },
      },
      include: {
        type: true,
      },
    });

    if (lowStockItems.length === 0) {
      return;
    }

    const itemsSummary = lowStockItems
      .map(
        (item) =>
          `- ${item.name} (${item.type?.name || "Ingredient"}): ${item.stock} remaining (Threshold: ${constants.LOW_STOCK_THRESHOLD})`,
      )
      .join("\n");

    const subject = `[URGENT] Low Inventory Alert - ${lowStockItems.length} items below threshold`;
    const message = `
Hello Admin,

The following pizza inventory items have fallen below the configured threshold of ${constants.LOW_STOCK_THRESHOLD} units:

${itemsSummary}

Please restock these items soon to avoid disruption in customer orders.

- Automated Inventory Management System
    `.trim();

    await sendEmail(constants.EMAIL_USER, subject, message);
    console.log(`[Cron Job] Low stock alert sent for ${lowStockItems.length} items.`);
  } catch (error) {
    console.error("[Cron Job Error] Failed to run inventory stock check:", error);
  }
};

export const initScheduledJobs = (): void => {
  // Run once every hour at minute 0 (0 * * * *)
  cron.schedule("0 * * * *", () => {
    console.log("[Cron Job] Running scheduled inventory low stock check...");
    void checkLowStockAndNotify();
  });

  console.log("Scheduled jobs initialized: Inventory stock monitor active.");
};
