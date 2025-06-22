// Connect to MongoDB (if using Node.js MongoDB driver)
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017"; // Or Atlas URI

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("bookstore");
    const books = db.collection("books");

    // CRUD Examples

    // Create
    await books.insertOne({ title: "New Book", author: "John Doe", year: 2023 });

    // Read
    const allBooks = await books.find({}).toArray();
    console.log("Books:", allBooks);

    // Update
    await books.updateOne({ title: "New Book" }, { $set: { author: "Jane Doe" } });

    // Delete
    await books.deleteOne({ title: "New Book" });

    // Advanced Query: Projection + Sort
    const sortedBooks = await books.find({}, { projection: { title: 1, _id: 0 } }).sort({ year: -1 }).toArray();
    console.log("Sorted Books:", sortedBooks);
    
    // Aggregation Example
    const result = await books.aggregate([
      { $group: { _id: "$author", total: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]).toArray();
    console.log("Aggregation Result:", result);

    // Indexing
    await books.createIndex({ title: 1 });
    
  } finally {
    await client.close();
  }
}
run();
