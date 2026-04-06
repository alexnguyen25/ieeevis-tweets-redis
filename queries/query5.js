// Query 5: Get all tweets for a specific user.
// Uses Redis Lists with keys like tweets:screen_name to store all tweet IDs per user (RPUSH).
// Uses Redis Hashes with keys like tweet:id to store each tweet's data
// including user_name, text, created_at, retweet_count, and favorite_count (HSET).
// Demonstrates by fetching all tweet IDs for a specific user (LRANGE)
// and retrieving each tweet's full data from its hash (HGETALL).

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
    const screenName = tweet.user.screen_name;
    const tweetId = tweet.id_str;

    // Add tweet ID to user's list
    await redis.rPush(`tweets:${screenName}`, tweetId);

    // Store tweet data as a hash
    await redis.hSet(`tweet:${tweetId}`, {
      user_name: screenName,
      text: tweet.text,
      created_at: tweet.created_at,
      retweet_count: tweet.retweet_count,
      favorite_count: tweet.favorite_count
    });
  }

  // Demo: get all tweet IDs for one user and fetch their data
  const exampleUser = "duto_guerra";
  const tweetIds = await redis.lRange(`tweets:${exampleUser}`, 0, -1);
  console.log(`Tweets for ${exampleUser}:`);
  for (const id of tweetIds) {
    const tweetData = await redis.hGetAll(`tweet:${id}`);
    console.log(tweetData);
  }

  await mongo.close();
  await redis.quit();
}
main();