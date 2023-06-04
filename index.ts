import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ["query"] })

async function main() {
  await createUser();
  await findUnique();
  await findFirst();
  await findMany();
}

async function createUser() {
  const randomInt = Math.floor(Math.random() * 10);
  await prisma.user.create({
    data: {
      name: `Alice_${randomInt}`,
      email: `alice${randomInt}@prisma.io`,
      posts: {
        create: { title: 'Hello World' },
      },
      profile: {
        create: { bio: 'I like turtles' },
      },
    },
  })
}

async function findUnique() {
  // By unique identifier
  const user = await prisma.user.findUnique({
    where: {
      email: 'alice@prisma.io'
    }
  })
  console.log(user);
}

async function findFirst() {
  const user = await prisma.user.findFirst({
    where: {
      posts: {
        some: {
          title: {
            contains: 'Hello'
          }
        }
      }
    },
    orderBy: {
      email: 'asc'
    },
    select: {
      id: true,
      email: true,
    }
  });
  console.log(user);
}

async function findMany() {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      posts: {
        select: {
          id: true,
          title: true,
          published: true,
        }
      }
    },
  })
  console.log(result);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
