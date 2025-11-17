import { db } from "../src/app/_lib/prisma";

async function main() {
  console.log("⏳ Atualizando registros antigos…");

  const result = await db.quizQuestion.updateMany({
    where: {
      expiresAt: null,
    },
    data: {
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // agora + 30 min
    },
  });

  console.log(`✔ Atualizados ${result.count} registros`);
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await db.$disconnect();
  });
