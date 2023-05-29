import { MongoClient, ServerApiVersion } from "mongodb";
import bcrypt from "bcryptjs";
import validator from "validator";
import inquirer from "inquirer";
import * as dotenv from "dotenv";
dotenv.config();

// validate: firstname, lastname and username and database name
const validateString = (input) => {
  if (input === "" || input.length < 2) {
    return "Answer must be 2 characters or more.";
  }
  return true;
};

// validate email
const validateEmail = async (input) => {
  if (!validator.isEmail(input)) {
    return "Invalid email";
  }
  return true;
};

// validate password
const validatePassword = (input) => {
  if (input.length < 6) {
    return "Password should be at least 6 characters long";
  }
  return true;
};

const createAdmin = async (configs) => {
  const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server
    await client.connect();

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(configs.password, salt);

    // create user
    const user = {
      firstname: configs.firstname,
      lastname: configs.lastname,
      username: configs.username,
      email: configs.email,
      password: hashedPassword,
    };

    // Insert the user document
    const result = await client
      .db(configs.dbName)
      .collection("users")
      .insertOne(user);

    console.log("\n\nAdmin User created successfully");
    console.log(result);
  } catch (err) {
    console.log(err.message);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

inquirer
  .prompt([
    {
      name: "dbName",
      message: "Enter database name",
      type: "input",
      default: "webworm",
      validate: validateString,
    },
    {
      name: "firstname",
      message: "Enter firstname",
      type: "input",
      validate: validateString,
    },
    {
      name: "lastname",
      message: "Enter lastname",
      type: "input",
      validate: validateString,
    },
    {
      name: "username",
      message: "Enter username",
      type: "input",
      validate: validateString,
    },
    {
      name: "email",
      message: "Enter email",
      type: "input",
      validate: validateEmail,
    },
    {
      name: "password",
      message: "Enter admin password",
      type: "password",
      validate: validatePassword,
    },
    {
      name: "confirm_password",
      message: "confirm password",
      type: "password",
      validate: function (value, answers) {
        const password = answers.password;
        if (value === password) {
          return true; // passwords match
        }
        return "Passwords do not match!";
      },
    },
  ])
  .then((answer) => {
    createAdmin(answer).catch(console.dir);
  });
