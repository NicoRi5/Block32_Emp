const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const router = express.Router();
const PORT = 3000;
app.use(express.json());
app.use("/", router);

router.get("/", (req, res) => {
  res.send("Hello employees!");
});

const employees = require("./employees");

router.get("/employees", (req, res) => {
  res.json(employees);
});

router.get("/employees/random", (req, res) => {
  const i = Math.floor(Math.random() * employees.length);
  res.json(employees[i]);
});

router.get("/employees/:id", (req, res) => {
  const { id } = req.params;
  const employee = employees.find((e) => e.id === +id);
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).send(`There is no employee with id ${id}.`);
  }
});

// POST /employees will add new employee with provided name (if correctly provided)
router.post("/employees", (req, res, next) => {
  const { name } = req.body;
  if (!name?.trim()) {
    return res.status(400).send("No correctly provided name!");
  }

  employees.push({ id: uuidv4(), name: name.trim() });
  res.send(employees);
});

// 404 and error-handling middleware:
app.use((req, res, next) => {
  res.status(404).send("Not Found.");
});

// error-handling:
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something went wrong!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
