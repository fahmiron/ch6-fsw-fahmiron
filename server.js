const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT = 8000

// connect to DB
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres', // your db user
  host: 'localhost',
  database: 'chapter6', // your db name
  password: 'C0c01945', // your db password
  port: 5432,
})

// View Engine
app.use(express.static('public'))
app.set('view engine', 'ejs')

// Parser
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.post('/articles', (req, res) => {
    pool.query(
        `INSERT INTO players (name, email, experience, lvl)
        VALUES
        * FROM players ORDER BY id ASC`
        ,[] , (error, results) => {
        if (error) {
            res.status(500).json(error)
        }
        res.render('players/all', {data: results})
    })
}
)

app.get('/articles/create', (req, res) => {
    res.render('articles/bikin') // lokasi file yang mau di render dari folder views
})

app.get('/home', (req, res) => {
    res.render('home') // lokasi file yang mau di render, dari folder views
})

app.get('/players', async (req, res) => {
    pool.query('SELECT * FROM players ORDER BY id ASC', (error, results) => {
        if (error) {
          res.status(500).json(error)
        }
        res.render('players/all', {data: results})
    })
})

// TUGAS
// get players under level X
// '/players/under/:6' --> player with level 6 or lower
app.get('/players/under/:lvl', (req, res) => {
    pool.query('SELECT * FROM players WHERE lvl < $1 ORDER BY id ASC', [req.params.lvl], (error, results) => {
        if (error) {
          res.status(500).json(error)
        }
        res.render('players/all', {data: results})
    })
})

app.get('/players/:id') // menampilkan player dengan id tertentu

app.get('/players/update/:id', (req, res) => {
    res.render('players/edit', {id : req.params.id})
}) // tampilkan form untuk update player id tertentu

app.post('/players/:id', (req, res) => {
    pool.query(`
        UPDATE TABLE players
        SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        experience = COALESCE($3, experience),
        lvl = COALESCE($4, lvl)
        WHERE
        id = $5
        `, [
            req.body.name,
            req.body.email,
            req.body.experience,
            req.body.lvl,
            req.params.id
        ], (error, results) => {
        if (error) {
          res.status(500).json(error)
        }
        res.render('players/edit', {id: req.params.id})
    })
}) // eksekusi update data

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    if (req.body.username === 'admin' && req.body.password === 'admin') {
        res.render('home')
    } else {
        res.status(401).send({'message': 'unauthorized'})
    }
})

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})
