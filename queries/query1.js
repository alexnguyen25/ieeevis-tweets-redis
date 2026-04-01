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