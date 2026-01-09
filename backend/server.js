const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const mongoConnect = require('./db/dbinit.js');
mongoConnect();
app.use(express.json())
const port = process.env.PORT || 5000;

app.use((_req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', '*');
      res.header('Access-Control-Allow-Methods', '*');
    next();
  })
  app.use(cors({
    origin:"*",
    credentials:true
  }))

  const workersRoutes = require("./routes/workersroutes");
  app.use("/workers", workersRoutes);
  const dataIngestionRoutes = require("./routes/dataingestion");
  app.use("/ingest", dataIngestionRoutes);

  app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"YOUR SERVER IS ACTIVATED"
    })
  })

app.listen(port, function() {
    console.log("Server is running on port " + port);
});