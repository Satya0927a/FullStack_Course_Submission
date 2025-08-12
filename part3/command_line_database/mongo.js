const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('You must enter your password');
    process.exit(1)
}

const password = process.argv[2]

const persondata = {
    name:process.argv[3],
    number: process.argv[4]
}

const url = `mongodb+srv://satyapc06:${password}@cluster1.adg6yhr.mongodb.net/PhonebookApp?retryWrites=true&w=majority&appName=Cluster1`

mongoose.connect(url)

const personschema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personschema)

if(process.argv.length>3){
    new Person(persondata).save().then(result=>{
        console.log(`added ${persondata.name} number ${persondata.number} to the phonebook`);
        mongoose.connection.close()
    })
}
else{
    Person.find({}).then(res=>{
        res.forEach(data=>{
            console.log(`${data.name} ${data.number}`);
        })
        mongoose.connection.close()
    })
}
