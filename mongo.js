import mongoose from 'mongoose';

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://Cluster81652:${password}@cluster81652.tsbwsce.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  content: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length==5) {

  const content = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    content: content,
    number: number,
  })
  
  person.save().then(result => {
    console.log("added " + content + " number " + number + " to phonebook");
    mongoose.connection.close();
  })

} else {

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })

}