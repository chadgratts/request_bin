// import { MongoClient } from "mongodb";
const { MongoClient } = require('mongodb');

// Replace with your connection string
const mongoURI = "mongodb://requestbin:PGWun5fc9Wi2JJA82EUD5gWa@localhost:27017/requestbin";
const client = new MongoClient(mongoURI);

async function seedMongoDB() {
  // requests
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('requestbin');
    const collection = db.collection('mongo_requests');

    const rawRequestOne = `GET/  HTTP/1.1\r\nHost: jwm187dsq8xt.domain.com\r\nUser-Agent: PostmanRuntime/7.41.0\r\n\Accept: */*\r\n\r\n`;
    const rawRequestTwo = `POST /sample/post/request HTTP/1.1\r\nHost: belaphqgy9xm.domain.com\r\nContent-Type: application/json\r\nContent-Length: 35\r\nUser-Agent: PostmanRuntime/7.32.3\r\nAccept: */*\r\nCache-Control: no-cache\r\nPostman-Token: iuhgs9824h5u20fhe\r\n\r\n{\r\n"name": "Alice",\r\n"email": "alice@example.com"\r\n}`;
    const rawRequestThree = `GET /sample/get/request?id=ddc5f0ed-60ff-4435-abc5-590fafe4a771&timestamp=1544827965&event=delivered HTTP/1.1\r\nHost: w8wt4asl1cu8.domain.com\r\naccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7\r\naccept-language: en-US,en;q=0.9\r\ncache-control: no-cache\r\npragma: no-cache\r\npriority: u=0, i\r\nsec-ch-ua-mobile: ?0\r\nsec-fetch-dest: document\r\nsec-fetch-mode: navigate\r\nsec-fetch-site: none\r\nsec-fetch-user: ?1\r\nupgrade-insecure-requests: 1\r\nuser-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36\r\nAccept-Encoding: gzip, deflate, br\r\n\r\n`;

    const resultOne = await collection.insertOne({ request_raw: rawRequestOne });
    const resultTwo = await collection.insertOne({ request_raw: rawRequestTwo });
    const resultThree = await collection.insertOne({ request_raw: rawRequestThree });

    // copy the IDs logged here into seed-data.sql for seeding postgres
    console.log('Inserted requests document one ID:', resultOne.insertedId, 'postgres mongo_request_id for GET to jwm187dsq8xt');
    console.log('Inserted requests document two ID:', resultTwo.insertedId, 'postgres mongo_request_id for POST to belaphqgy9xm');
    console.log('Inserted requests document three ID:', resultThree.insertedId, 'postgres mongo_request_id for GET to w8wt4asl1cu8');

  } catch (err) {
    console.error('Error inserting into mongo_requests:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }

  // bodies
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('requestbin');
    const collection = db.collection('mongo_bodies');

    const requestBodyOne = '';
    const requestBodyTwo = `{\r\n"name": "Alice",\r\n"email": "alice@example.com"\r\n}`;
    const requestBodyThree = '';

    const resultOne = await collection.insertOne({ request_body: requestBodyOne });
    const resultTwo = await collection.insertOne({ request_body: requestBodyTwo });
    const resultThree = await collection.insertOne({ request_body: requestBodyThree });

    // copy the IDs logged here into seed-data.sql for seeding postgres
    console.log('Inserted bodies document one ID:', resultOne.insertedId, 'postgres mongo_body_id for GET to jwm187dsq8xt');
    console.log('Inserted bodies document two ID:', resultTwo.insertedId, 'postgres mongo_body_id for POST to belaphqgy9xm');
    console.log('Inserted bodies document three ID:', resultThree.insertedId, 'postgres mongo_body_id for GET to w8wt4asl1cu8');
  } catch (err) {
    console.error('Error inserting into mongo_bodies:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

seedMongoDB();

// RAW HTTP REQUESTS



// GET / HTTP/1.1
// Host: jwm187dsq8xt.domain.com
// User-Agent: PostmanRuntime/7.41.0
// Accept: */*



// POST /sample/post/request HTTP/1.1
// Host: belaphqgy9xm.domain.com
// Content-Type: application/json
// Content-Length: 35
// User-Agent: PostmanRuntime/7.32.3
// Accept: */*
// Cache-Control: no-cache
// Postman-Token: iuhgs9824h5u20fhe

// {
//   "name": "Alice",
//   "email": "alice@example.com"
// }



// GET /sample/get/request?id=ddc5f0ed-60ff-4435-abc5-590fafe4a771&timestamp=1544827965&event=delivered HTTP/1.1
// host: w8wt4asl1cu8.domain.com
// accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
// accept-language: en-US,en;q=0.9
// cache-control: no-cache
// pragma: no-cache
// priority: u=0, i
// sec-ch-ua-mobile: ?0
// sec-fetch-dest: document
// sec-fetch-mode: navigate
// sec-fetch-site: none
// sec-fetch-user: ?1
// upgrade-insecure-requests: 1
// user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36
// Accept-Encoding: gzip, deflate, br