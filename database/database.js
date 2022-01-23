
const Pool = require("pg").Pool;

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "crmSystem",
  password: "lbs1991930",
  port: 5432,
};

const pool=new Pool(credentials);

pool.on("end",()=>{
    console.log("Database connection end");
})

module.exports = pool;