const { response } = require('express');
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

let personList = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postinfo'));

morgan.token('url', function(req, res) {
    return req.url;
});
morgan.token('type', function (req, res) { return req.headers['content-type'] })
morgan.token('postinfo', function (req, res) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    }
     return ''; 
})

app.get("/api/persons", (req, res) => {
    res.json(personList);
})

app.get("/info", (req, res) => {
    const date = new Date()
    const info = `<p>Phonebook has info for ${personList.length} people</p>
                    <p>${date}</p>`
    res.send(info)
})

app.get("/api/persons/:id", (req, res) => {
    const num = Number(req.params.id);
    let person = personList.find(per => per.id === num);
    if (person) {
        res.json(person);
    } else {
        return res.status(400).json({
            error: 'person not found'
        })
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const num = Number(req.params.id);
    personList = personList.filter(per => per.id !== num);

    res.status(204).end();
})

app.post("/api/persons", (req, res) => {
    const body = req.body
    // console.log(body);
    if (!body.number || !body.name) {
        return res.status(400).json({
            error: 'missing content'
        })
    }

    let nameTaken = personList.find(person => person.name === body.name);
    if (nameTaken) {
        return res.status(400).json({
            error: 'name taken'
        })
    } else {
        const newPerson = {
            id: Math.floor(Math.random() * 10000),
            name: body.name,
            number: body.number
        }
        // console.log('newPerson', newPerson)
        personList = personList.concat(newPerson) 
        res.json(newPerson);
    }
})

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on Port ${PORT}`);
