import { MongoClient } from "mongodb";
import { createClient } from "redis";

const mongo = new MongoClient("mongodb://localhost:27017");
const redis = createClient();

async function main() {
  await mongo.connect();
  await redis.connect();

  const col = mongo.db("ieeevisTweets").collection("tweet");

  const tweets = await col.find({}).toArray();
  for (const tweet of tweets) {
    await redis.sAdd("screen_names", tweet.user.screen_name);
  }

  const count = await redis.sCard("screen_names");
  console.log(`Distinct users: ${count}`);

  await mongo.close();
  await redis.quit();
}
main();