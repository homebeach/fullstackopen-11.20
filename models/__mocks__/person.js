const mockData = [
  { id: '1', content: 'Alice', number: '123-456' },
  { id: '2', content: 'Bob', number: '789-012' },
]

class Person {
  constructor(data) {
    this.content = data.content
    this.number = data.number
    this.id = data.id || '123'

    // Mock the save method to resolve with the object itself
    this.save = jest.fn().mockResolvedValue({
      content: this.content,
      number: this.number,
      id: this.id,
    })

    // Mock the validate method (assuming always successful for simplicity)
    this.validate = jest.fn().mockResolvedValue(true)
  }

  // Method to simulate the Mongoose 'toJSON' transformation
  toJSON() {
    const returnedObject = {
      id: this.id,
      content: this.content,
      number: this.number,
    }
    delete returnedObject.__v // Simulating Mongoose behavior
    return returnedObject
  }
}

// Mock static methods that the Person model will use
Person.find = jest.fn().mockResolvedValue(mockData)
Person.findById = jest.fn((id) =>
  Promise.resolve(mockData.find(person => person.id === id))
)
Person.findByIdAndRemove = jest.fn().mockResolvedValue(null)
Person.findByIdAndUpdate = jest.fn((id, person) =>
  Promise.resolve({ ...person, id })
)
Person.countDocuments = jest.fn().mockResolvedValue(mockData.length)
Person.create = jest.fn((person) => Promise.resolve(new Person(person)))

// Export a mock of the Person constructor
const mockPersonConstructor = jest.fn((data) => new Person(data))

export default mockPersonConstructor