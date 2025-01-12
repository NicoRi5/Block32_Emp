const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello employees!");
});

const employees = require("./employees");

app.get("/employees", (req, res) => {
  res.json(employees);
});

app.get("/employees/random", (req, res) => {
  const i = Math.floor(Math.random() * employees.length);
  res.json(employees[i]);
});

app.get("/employees/:id", (req, res) => {
  const { id } = req.params;
  const employee = employees.find((e) => e.id === +id);
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).send(`There is no employee with id ${id}.`);
  }
});

// POST /employees will add new employee with provided name (if correctly provided)
app.post("/employees", (req, res, next) => {
  const { name } = req.body;
  if (!name?.trim()) {
    return res.status(400).send("No correctly provided name!");
  }

  employees.push({ id: uuidvd(), name: name.trim });
  res.send(employees);
});

// 404 and error-handling middleware:
app.use((req, res, next) => {
  next({ status: 404, message: "Not found." });
});

// error-handling:
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something went wrong!");
});

app.listen(PORT, () => {
  `Listening on port ${PORT}...`;
});
