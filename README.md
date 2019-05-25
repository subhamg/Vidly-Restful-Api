# Vidly-Restful-Api

### Building RESTful APIs with Express

- REST defines a set of conventions for creating HTTP services:
  - POST: to create a resource
  - PUT: to update it
  - GET: to read it
  - DELETE: to delete it
- Express is a simple, minimalistic and lightweight framework for building web
  servers.

```javascript
// Build a web server
const express = require(‘express’);
const app = express();
```

```javascript
// Creating a course
app.post(‘/api/courses’, (req, res) => {
    // Create the course and return the course object
    resn.send(course);
});
```

```javascript
// Getting all the courses
app.get(‘/api/courses’, (req, res) => {
    // To read query string parameters (?sortBy=name)
    const sortBy = req.query.sortBy;
    // Return the courses
    res.send(courses);
});
```

```javascript
// Getting a single course
app.get(‘/api/courses/:id’, (req, res) => {
    const courseId = req.params.id;

    // Lookup the course
    // If not found, return 404
    res.status(404).send(‘Course not found.’);
    // Else, return the course object
    res.send(course);
});
```

```javascript
// Updating a course
app.put(‘/api/courses/:id’, (req, res) => {
    // If course not found, return 404, otherwise update it
    // and return the updated object.
});
```

```javascript
// Deleting a course
app.delete(‘/api/courses/:id’, (req, res) => {
    // If course not found, return 404, otherwise delete it
    // and return the deleted object.
});
```

```javascript
// Listen on port 3000
app.listen(3000, () => console.log(‘Listening…’));
```

- We use **Nodemon** to watch for changes in files and automatically restart the
  node process.
- We can use environment variables to store various settings for an application. To
  read an environment variable, we use **process.env**.

```javascript
// Reading the port from an environment variable
const port = process.env.PORT || 3000;
app.listen(port);
```

- You should never trust data sent by the client. Always validate! Use Joi package
  to perform input validation.

---

### Express: Middleware, Routes

- A middleware function is a function that takes a request object and either
  terminates the request/response cycle or passes control to another middleware
  function.
- Express has a few built-in middleware functions:
  - **json()**: to parse the body of requests with a JSON payload
  - **urlencoded()**: to parse the body of requests with URL-encoded payload
  - **static()**: to serve static files
- You can create custom middleware for cross-cutting concerns, such as logging,
  authentication, etc.

```javascript
// Custom middleware (applied on all routes)
app.use(function(req, res, next)) {
    // …
    next();
}
```

```javascript
// Custom middleware (applied on routes starting with /api/admin)
app.use(‘/api/admin’, function(req, res, next)) {
    // …
    next();
}
```

- We can detect the environment in which our Node application is running
  (development, production, etc) using **process.env.NODE_ENV** and
  **app.get(‘env’)**.
- The **config** package gives us an elegant way to store configuration settings for
  our applications.
- We can use the **debug** package to add debugging information to an application.
  Prefer this approach to console.log() statements.
- To return HTML markup to the client, use a templating engine. There are various
  templating engines available out there. Pug, EJS and Mustache are the most
  popular ones.

---

### CRUD Operations using Mongoose and MongoDB

- MongoDB is an open-source document database. It stores data in flexible, JSONlike documents.
- In relational databases we have **tables** and **rows**, in MongoDB we have
  **collections** and **documents**. A document can contain sub-documents.
- We don’t have relationships between documents.

- To connect to MongoDB:

```javascript
// Connecting to MongoDB
const mongoose = require(‘mongoose’);
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log(‘Connected…’))
    .catch(err => console.error(‘Connection failed…’));
```

- To store objects in MongoDB, we need to define a Mongoose **schema** first. The
  schema defines the shape of documents in MongoDB.

```javascript
// Defining a schema
const courseSchema = new mongoose.Schema({
  name: String,
  price: Number
});
```

- We can use a SchemaType object to provide additional details:

```javascript
// Using a SchemaType object
const courseSchema = new mongoose.Schema({
  isPublished: { type: Boolean, default: false }
});
```

- Supported types are: **String**, **Number**, **Date**, **Buffer** (for storing binary data),
  **Boolean** and **ObjectID**.
- Once we have a schema, we need to compile it into a model. A model is like a
  class. It’s a blueprint for creating objects:

```javascript
// Creating a model
const Course = mongoose.model(‘Course’, courseSchema);
```

---

### CRUD Operations

```javascript
// Saving a document
let course = new Course({ name: ‘…’ });
course = await course.save();
```

```javascript
// Querying documents
const courses = await Course
    .find({ author: ‘Mosh’, isPublished: true })
    .skip(10)
    .limit(10)
    .sort({ name: 1, price: -1 })
    .select({ name: 1, price: 1 });
```

```javascript
// Updating a document (query first)
const course = await Course.findById(id);
if (!course) return;
course.set({ name: ‘…’ });
course.save();
```

```javascript
// Updating a document (update first)
const result = await Course.update({ _id: id }, {
 $set: { name: ‘…’ }
});
```

```javascript
// Updating a document (update first) and return it
const result = await Course.findByIdAndUpdate({ _id: id }, {
 $set: { name: ‘…’ }
}, { new: true });
```

```javascript
// Removing a document
const result = await Course.deleteOne({ _id: id });
const result = await Course.deleteMany({ _id: id });
const course = await Course.findByIdAndRemove(id);
```

---

### Mongoose: Validation

- When defining a schema, you can set the type of a property to a SchemaType
  object. You use this object to define the validation requirements for the given
  property.

```javascript
// Adding validation
new mongoose.Schema({
  name: { type: String, required: true }
});
```

- Validation logic is executed by Mongoose prior to saving a document to the
  database. You can also trigger it manually by calling the validate() method.
- Built-in validators:
- Strings: minlength, maxlength, match, enum
- Numbers: min, max
- Dates: min, max
- All types: required

```javascript
// Custom validation
tags: [
    type: Array,
    validate: {
        validator: function(v) { return v && v.length > 0; },
        message: ‘A course should have at least 1 tag.’
    }
]
```

- If you need to talk to a database or a remote service to perform the validation,
  you need to create an async validator:

```javascript
 validate: {
    isAsync: true
    validator: function(v, callback) {
        // Do the validation, when the result is ready, call the callback
        callback(isValid);
    }
 }
```

- Other useful SchemaType properties:
- Strings: lowercase, uppercase, trim
- All types: get, set (to define a custom getter/setter)

```javascript
price: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v)
}
```

---

### Mongoose: Modelling Relationships between Connected Data

- To model relationships between connected data, we can either reference a
  document or embed it in another document.

- When referencing a document, there is really no relationship between these two
  documents. So, it is possible to reference a non-existing document.

- Referencing documents (normalization) is a good approach when you want to
  enforce data consistency. Because there will be a single instance of an object in
  the database. But this approach has a negative impact on the performance of
  your queries because in MongoDB we cannot JOIN documents as we do in
  relational databases. So, to get a complete representation of a document with its
  related documents, we need to send multiple queries to the database.

- Embedding documents (denormalization) solves this issue. We can read a
  complete representation of a document with a single query. All the necessary
  data is embedded in one document and its children. But this also means we’ll
  have multiple copies of data in different places. While storage is not an issue
  these days, having multiple copies means changes made to the original
  document may not propagate to all copies. If the database server dies during an
  update, some documents will be inconsistent. For every business, for every
  problem, you need to ask this question: “can we tolerate data being inconsistent
  for a short period of time?” If not, you’ll have to use references. But again, this
  means that your queries will be slower.

```javascript
// Referencing a document
const courseSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ‘Author’
    }
})
```

```javascript
// Referencing a document
const courseSchema = new mongoose.Schema({
  author: {
    type: new mongoose.Schema({
      name: String,
      bio: String
    })
  }
});
```

- Embedded documents don’t have a save method. They can only be saved in the
  context of their parent.

```javascript
// Updating an embedded document
const course = await Course.findById(courseId);
course.author.name = ‘New Name’;
course.save();
```

- We don’t have transactions in MongoDB. To implement transactions, we use a
  pattern called “Two Phase Commit”. If you don’t want to manually implement this
  pattern, use the **Fawn** NPM package:

```javascript
// Implementing transactions using Fawn
try {
await new Fawn.Task()
    .save(‘rentals’, newRental)
    .update(‘movies’, { \_id: movie.\_id }, { \$inc: numberInStock: -1 }})
    .run();
}
catch (ex) {
    // At this point, all operations are automatically rolled back
}
```

- **ObjectIDs** are generated by MongoDB driver and are used to uniquely identify a
  document. They consist of 12 bytes:

  - 4 bytes: timestamp
  - 3 bytes: machine identifier
  - 2 bytes: process identifier
  - 3 byes: counter

- ObjectIDs are almost unique. In theory, there is a chance for two ObjectIDs to be
  equal but the odds are very low (1/16,000,000) for most real-world applications.

```javascript
// Validating ObjectIDs
mongoose.Types.ObjectID.isValid(id);
```

- To validate ObjectIDs using **joi**, use **joi-objectid** NPM package.
