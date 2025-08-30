// import { PrismaClient } from "./generated/prisma/client";

// const globalForPrisma = globalThis as unknown as {
// 	prisma: PrismaClient | undefined;
// };

// export const prismaConn = globalForPrisma.prisma ?? new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaConn;

import { PrismaClient } from "./generated/prisma/client";

const prisma = new PrismaClient({
	errorFormat: "pretty",
	log: ["error"],
});
const globalForPrisma = global as unknown as { prisma: typeof prisma };

globalForPrisma.prisma = prisma;

export default prisma;
