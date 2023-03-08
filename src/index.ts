import express, { Router } from "express";
import connects from "./conn/db";
import { router } from "./routers/router";
const app = express()
const port = 8000 || process.env.PORT


app.use(express.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
connects()

// app.use(express.urlencoded)
app.use('/',router
)

app.listen(port,()=>{
    console.log(`port  listing to the ${port}`);
    
})
