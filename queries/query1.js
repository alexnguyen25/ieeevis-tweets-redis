// Query 1: How many tweets are there?
// Initializes a tweetCount key to 0 in Redis (SET), queries all tweets from MongoDB,
// and increments tweetCount by 1 for each tweet (INCR).
// Finally gets the value (GET) and prints "There were ### tweets"

import { MongoClient } from "mongodb";
import { createClient } from "redis";

const mongo = new MongoClient("mongodb://localhost:27017");
const redis = createClient();

async function main() {
  await mongo.connect();
  await redis.connect();

  const col = mongo.db("ieeevisTweets").collection("tweet");

  // Initialize tweetCount to 0
  await redis.set("tweetCount", 0);

  // Get all tweets and increment for each one
  const tweets = await col.find({}).toArray();
  for (const tweet of tweets) {
    await redis.incr("tweetCount");
  }

  // Get final value and print
  const count = await redis.get("tweetCount");
  console.log(`There were ${count} tweets`);

  await mongo.close();
  await redis.quit();
}
main();