import express from 'express'
const app = express()
app.set("view engine","ejs")

app.get('/',(req, res) =>{
    res.render("index.ejs")
})

//app.get('/', (req, res) => {
//  res.send('Hello Woooorrrldd!')
//})

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})