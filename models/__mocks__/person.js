const mockData = [
  { id: '1', content: 'Alice', number: '123-456' },
  { id: '2', content: 'Bob', number: '789-012' },
]

// Constructor function to simulate the creation of a new Person instance
class Person {
  constructor(data) {
    this.content = data.content
    this.number = data.number
    this.id = data.id || '123' // Default id if not provided

    // Mock save method
    this.save = jest.fn().mockResolvedValue({
      content: this.content,
      number: this.number,
      id: this.id,
    })

    // Mock validate method (resolve as valid for testing purposes)
    this.validate = jest.fn().mockResolvedValue(true)
  }
}

// Static methods for Person (mimicking Mongoose model)
Person.find = jest.fn().mockResolvedValue(mockData)
Person.findById = jest.fn((id) => Promise.resolve(mockData.find(person => person.id === id)))
Person.findByIdAndRemove = jest.fn().mockResolvedValue(null)
Person.findByIdAndUpdate = jest.fn((id, person) => Promise.resolve({ ...person, id }))
Person.countDocuments = jest.fn().mockResolvedValue(mockData.length)
Person.create = jest.fn((person) => Promise.resolve(new Person(person)))

const mockPersonConstructor = jest.fn((data) => new Person(data))

// Export the mock class as default
export default mockPersonConstructor
