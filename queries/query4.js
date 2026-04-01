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
    await redis.zIncrBy("leaderboard", 1, tweet.user.screen_name);
  }

  // Get top 10 with scores, highest first
  const top10 = await redis.zRangeWithScores("leaderboard", 0, 9, { REV: true });
  console.log("Top 10 users by tweet count:");
  top10.forEach((entry, i) => {
    console.log(`${i + 1}. ${entry.value} - ${entry.score} tweets`);
  });

  await mongo.close();
  await redis.quit();
}
main();