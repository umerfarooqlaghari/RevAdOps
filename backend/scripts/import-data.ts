// import { PrismaClient } from "@prisma/client";
// import data from "../backup.json" assert { type: "json" };

// const prisma = new PrismaClient();

// // Insert in batches of 100 to avoid overload
// const CHUNK_SIZE = 100;

// async function insertInChunks(model: any, records: any[]) {
//   for (let i = 0; i < records.length; i += CHUNK_SIZE) {
//     const chunk = records.slice(i, i + CHUNK_SIZE);

//     await prisma.$transaction(
//       chunk.map((record: any) => model.create({ data: record }))
//     );

//     console.log(`   ✔ Inserted ${i + chunk.length}/${records.length}`);
//   }
// }

// async function main() {
//   console.log("🔄 Importing database…");

//   const models = Object.keys(data);

//   for (const modelName of models) {
//     const records = (data as any)[modelName];

//     if (!records || records.length === 0) {
//       console.log(`→ Skipping ${modelName}, empty.`);
//       continue;
//     }

//     console.log(`→ Importing ${modelName} (${records.length} records)…`);

//     try {
//       const model = (prisma as any)[modelName];

//       if (!model || typeof model.create !== "function") {
//         console.log(`   ⚠ Skipped: ${modelName} is not a Prisma model`);
//         continue;
//       }

//       await insertInChunks(model, records);
//       console.log(`   ✔ Done ${modelName}`);

//     } catch (err) {
//       console.error(`   ✖ Failed importing ${modelName}`, err);
//     }
//   }

//   console.log("🎉 Import completed successfully!");
// }

// main()
//   .catch((e) => console.error(e))
//   .finally(() => prisma.$disconnect());
