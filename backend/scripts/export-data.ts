import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Exporting database…");

  // AUTO-DETECT MODELS
  const models = Object.keys(prisma).filter(
    (key) => !key.startsWith("_") && typeof (prisma as any)[key].findMany === "function"
  );

  console.log("📦 Models detected:", models.join(", "));

  const data: any = {};

  for (const model of models) {
    console.log(`→ Exporting ${model}…`);

    try {
      data[model] = await (prisma as any)[model].findMany();
      console.log(`   ✔ ${data[model].length} records`);
    } catch (err) {
      console.error(`   ✖ Failed to export ${model}`, err);
    }
  }

  fs.writeFileSync("backup.json", JSON.stringify(data, null, 2));

  console.log("✅ Export completed. File saved as backup.json");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
