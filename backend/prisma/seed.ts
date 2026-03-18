import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const movies = [
  {
    title: "Inception",
    genre: "Sci-Fi",
    description: "A thief enters dreams to steal secrets and plant ideas.",
    releaseYear: 2010,
  },
  {
    title: "Interstellar",
    genre: "Sci-Fi",
    description: "Explorers travel through a wormhole to save humanity.",
    releaseYear: 2014,
  },
  {
    title: "The Dark Knight",
    genre: "Action",
    description: "Batman faces Joker in Gotham's biggest moral battle.",
    releaseYear: 2008,
  },
  {
    title: "Mad Max: Fury Road",
    genre: "Action",
    description: "A high-speed chase through a desert wasteland.",
    releaseYear: 2015,
  },
  {
    title: "The Shawshank Redemption",
    genre: "Drama",
    description: "A banker survives prison life with hope and friendship.",
    releaseYear: 1994,
  },
  {
    title: "Forrest Gump",
    genre: "Drama",
    description: "A kind man witnesses major events in American history.",
    releaseYear: 1994,
  },
  {
    title: "The Hangover",
    genre: "Comedy",
    description: "Friends retrace wild events after a bachelor party.",
    releaseYear: 2009,
  },
  {
    title: "Superbad",
    genre: "Comedy",
    description: "Teen friends chase one unforgettable school party.",
    releaseYear: 2007,
  },
  {
    title: "The Conjuring",
    genre: "Horror",
    description: "Paranormal investigators face a dark supernatural case.",
    releaseYear: 2013,
  },
  {
    title: "Get Out",
    genre: "Horror",
    description: "A weekend visit uncovers terrifying truths.",
    releaseYear: 2017,
  },
  {
    title: "La La Land",
    genre: "Romance",
    description: "Two dreamers balance love and ambition in Los Angeles.",
    releaseYear: 2016,
  },
  {
    title: "Pride and Prejudice",
    genre: "Romance",
    description: "Classic love story shaped by family and first impressions.",
    releaseYear: 2005,
  },
];

async function main() {
  await prisma.movie.createMany({
    data: movies,
    skipDuplicates: true,
  });

  console.log("Seed complete: movies added.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
