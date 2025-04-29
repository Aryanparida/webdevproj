const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
require("./connection/conn")
const user = require("./routes/user");

// app.get("/",(req,res) => {
//     res.get("hii mf");
// });
//routes
app.use("/api/v1",user);
app.listen(process.env.PORT, () => {
    console.log(`Server hii at port${process.env.PORT}`);
});