import express from 'express';
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const user = { name: 'Mark' };
    const greetUser = (user) => `Hello, ${user.name}!`;

    res.render('index', { user, greetUser });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
