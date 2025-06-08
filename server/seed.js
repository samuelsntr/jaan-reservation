const mysql = require("mysql2/promise");
const { faker } = require("@faker-js/faker");

const connectionConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "jaan_rest",
  port: 8889,
};

const statuses = ["pending", "confirmed", "rejected"];
const tableTypes = ["Table 2 pax", "Table 4 pax", "Table 6 pax", "Bar"];
const floors = ["First Floor", "Second Floor", "Third Floor"];

function getRandomTime() {
  const hour = faker.number.int({ min: 17, max: 22 });
  const minute = faker.helpers.arrayElement(["00", "15", "30", "45"]);
  return `${String(hour).padStart(2, "0")}:${minute}:00`;
}

async function seedReservations(count = 1000) {
  const connection = await mysql.createConnection(connectionConfig);

  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName();
    const phoneNumber = faker.phone.number("08##########");
    const date = faker.date.between({ from: "2025-06-01", to: "2025-06-30" });
    const time = getRandomTime();
    const pax = faker.number.int({ min: 1, max: 6 });
    const tableType = faker.helpers.arrayElement(tableTypes);
    const status = faker.helpers.arrayElement(statuses);
    const floor = faker.helpers.arrayElement(floors);

    // Add createdAt and updatedAt fields to fix the error
    const now = new Date();
    const createdAt = now.toISOString().slice(0, 19).replace("T", " ");
    const updatedAt = createdAt;

    await connection.execute(
      `INSERT INTO reservations 
      (name, phoneNumber, date, time, pax, tableType, status, floor, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        phoneNumber,
        date.toISOString().split("T")[0],
        time,
        pax,
        tableType,
        status,
        floor,
        createdAt,
        updatedAt,
      ]
    );
  }

  console.log(`${count} reservations inserted.`);
  await connection.end();
}

seedReservations().catch(console.error);
