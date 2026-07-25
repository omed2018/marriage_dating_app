import { PrismaClient } from "../src/generated/prisma/client";
import { Gender, InteractionType } from "../src/generated/prisma/enums";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  host: "localhost",
  port: 5432,
  database: "mydb",
  user: "postgres",
  password: "postgres",
  ssl: false,
});
const prisma = new PrismaClient({ adapter });

const MALE_NAMES = [
  "James Smith", "Omar Hassan", "David Chen", "Mohammed Ali",
  "Robert Johnson", "Ahmad Khan", "Michael Brown", "Youssef Ibrahim",
  "William Davis", "Ali Mahmoud", "John Wilson", "Khalid Omar",
  "Daniel Martinez", "Hassan Youssef", "Ahmed Tarek", "Samuel Wright",
  "Tariq Al-Rashid", "Andrew Scott", "Hamza Abdullah", "Joseph Lee",
];

const FEMALE_NAMES = [
  "Fatima Zahra", "Sarah Johnson", "Aisha Patel", "Emily Brown",
  "Mariam Hassan", "Olivia Davis", "Noor Ahmed", "Jessica Wilson",
  "Layla Ibrahim", "Sophia Garcia", "Zainab Mohammed", "Emma Martinez",
  "Yasmin Ali", "Isabella Thomas", "Salma Khalil", "Mia Anderson",
  "Nadia Osman", "Charlotte Taylor", "Hana Yamamoto", "Amira Said",
];

const BIOS = [
  "Love hiking, cooking, and quiet evenings. Looking for someone who values family.",
  "Engineer by day, photographer by weekend. Seeking a genuine connection.",
  "Coffee enthusiast and bookworm. Let's explore the world together.",
  "Family-oriented, ambitious, and love to laugh. What about you?",
  "Foodie who loves trying new restaurants. Looking for my plus-one.",
  "Passionate about fitness and travel. Seeking a partner in adventure.",
  "Simple person with big dreams. Looking for honesty and loyalty.",
  "Music lover and amateur guitarist. Want someone to share playlists with.",
  "Dog parent, nature lover, and amateur chef. Swipe right if you love tacos.",
  "Work hard, play hard. Looking for someone who balances both.",
  "Introvert who comes alive in the right company. Let's have deep conversations.",
  "History buff and movie geek. Seeking someone for cozy movie nights.",
  "Plant mom/dad with 40+ plants. Looking for someone to help me water them.",
  "Startup founder building the future. Need someone who understands the grind.",
  "Teacher who loves shaping minds. Looking for someone who loves learning too.",
  "Travelled to 20+ countries. Want someone to add stamps to my passport with.",
  "Yoga instructor seeking inner peace and outer adventure.",
  "Astronomy nerd who loves stargazing. Looking for someone to count stars with.",
  "Volunteer at animal shelters. Must love dogs (and cats).",
  "Simple pleasures: sunset walks, home-cooked meals, and genuine laughter.",
];

const LOCATIONS = [
  "Dubai, UAE", "Cairo, Egypt", "Istanbul, Turkey", "London, UK",
  "New York, USA", "Riyadh, Saudi Arabia", "Amman, Jordan",
  "Kuala Lumpur, Malaysia", "Toronto, Canada", "Berlin, Germany",
];

const EDUCATIONS = [
  "Bachelor's in Computer Science", "Master's in Business Administration",
  "Bachelor's in Engineering", "Medical Degree",
  "Master's in Education", "PhD in Sciences",
  "Bachelor's in Arts", "Law Degree",
  "Diploma in Design", "Bachelor's in Finance",
];

const OCCUPATIONS = [
  "Software Engineer", "Doctor", "Teacher", "Business Analyst",
  "Architect", "Lawyer", "Graphic Designer", "Marketing Manager",
  "Entrepreneur", "Accountant", "Nurse", "Pharmacist",
  "Civil Engineer", "Data Scientist", "Project Manager",
];

const RELIGIONS = ["Islam", "Christianity", "Judaism", "Hinduism", "Buddhism", "Agnostic", "Prefer not to say"];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAge(min: number, max: number): Date {
  const age = Math.floor(Math.random() * (max - min + 1)) + min;
  const now = new Date();
  return new Date(now.getFullYear() - age, now.getMonth(), now.getDate());
}

async function main() {
  console.log("Seeding database...");

  await prisma.message.deleteMany();
  await prisma.match.deleteMany();
  await prisma.interaction.deleteMany();
  await prisma.report.deleteMany();
  await prisma.block.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const maleUsers = [];
  const femaleUsers = [];

  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `male${i + 1}@example.com`,
        name: MALE_NAMES[i],
        passwordHash,
        gender: Gender.MALE,
        dateOfBirth: randomAge(20, 40),
        bio: BIOS[i % BIOS.length],
        location: randomPick(LOCATIONS),
        education: randomPick(EDUCATIONS),
        occupation: randomPick(OCCUPATIONS),
        height: Math.floor(Math.random() * 30) + 165,
        religion: randomPick(RELIGIONS),
        isProfileComplete: true,
      },
    });
    maleUsers.push(user);
  }

  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `female${i + 1}@example.com`,
        name: FEMALE_NAMES[i],
        passwordHash,
        gender: Gender.FEMALE,
        dateOfBirth: randomAge(20, 38),
        bio: BIOS[(i + 10) % BIOS.length],
        location: randomPick(LOCATIONS),
        education: randomPick(EDUCATIONS),
        occupation: randomPick(OCCUPATIONS),
        height: Math.floor(Math.random() * 25) + 150,
        religion: randomPick(RELIGIONS),
        isProfileComplete: true,
      },
    });
    femaleUsers.push(user);
  }

  for (let i = 0; i < 5; i++) {
    const male = maleUsers[i];
    const female = femaleUsers[i];

    await prisma.interaction.createMany({
      data: [
        { senderId: male.id, receiverId: female.id, type: InteractionType.LIKE },
        { senderId: female.id, receiverId: male.id, type: InteractionType.LIKE },
      ],
    });

    await prisma.match.create({
      data: {
        userAId: male.id,
        userBId: female.id,
      },
    });
  }

  console.log(`Created ${maleUsers.length} male + ${femaleUsers.length} female users`);
  console.log("Created 5 matches with mutual likes");
  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
