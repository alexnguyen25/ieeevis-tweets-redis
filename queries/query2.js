// Query 2: What is the total number of favorites in the dataset?
// Initializes a favoritesSum key to 0 in Redis (SET), queries all tweets from MongoDB,
// and increments favoritesSum by each tweet's favorite_count (INCRBY).
// Finally gets the value (GET) and prints the total.

import { MongoClient } from "mongodb";
import { createClient } from "redis";

const mongo = new MongoClient("mongodb://localhost:27017");
const redis = createClient();

async function main() {
  await mongo.connect();
  await redis.connect();

  const col = mongo.db("ieeevisTweets").collection("tweet");

  await redis.set("favoritesSum", 0);

  const tweets = await col.find({}).toArray();
  for (const tweet of tweets) {
    await redis.incrBy("favoritesSum", tweet.favorite_count || 0);
  }

  const total = await redis.get("favoritesSum");
  console.log(`Total favorites: ${total}`);

  await mongo.close();
  await redis.quit();
}
main();