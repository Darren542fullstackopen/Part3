const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('include password');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://darrenluck01:${password}@cluster0.iyuzx1e.mongodb.net/person?retryWrites=true&w=majority`;
mongoose.set('strictQuery', false)
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('person', personSchema);
if (process.argv.length === 3 ) {
    console.log('phonebook');
    Person.find({}).then(result => {
        result.forEach(number => {
            console.log(number.name, number.number);
        })
        mongoose.connection.close();
    });
} else {
    const newName = process.argv[3];
    const newNumber = process.argv[4];

    const newPerson = new Person({
        name: newName,
        number: newNumber,
    })

    newPerson.save().then(result => {
        console.log(`added ${newName} number ${newNumber} to phonebook`);
        mongoose.connection.close();
    })

}