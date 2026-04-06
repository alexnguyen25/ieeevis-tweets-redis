# ieeevis-tweets-redis

Building on the MongoDB tweets database from Assignment 5 to interact with an in-memory Redis database for CS 3200 Assignment 6.

By Alexander Nguyen

## Setup

Make sure MongoDB is running with the ieeevisTweets database from Assignment 5, then start Redis:

```bash
docker run -d --name redis -p 6379:6379 redis:latest
```

Then install dependencies:

```bash
npm install
```

## Answers

You can find the answers in the [queries folder](./queries).

## Queries

### Query 1 – Tweet Count

How many tweets are there? Initializes a `tweetCount` key in Redis, queries all tweets from MongoDB, and increments the counter for each tweet using INCR. Prints the total number of tweets.

### Query 2 – Total Favorites

Compute and print the total number of favorites in the dataset. Initializes a `favoritesSum` key in Redis and increments it by each tweet's favorite count using INCRBY.

### Query 3 – Distinct Users

Compute how many distinct users are there in the dataset. Uses a Redis Set called `screen_names` to store unique screen names, then prints the total count.

### Query 4 – Leaderboard

Create a leaderboard with the top 10 users with the most tweets. Uses a Redis Sorted Set called `leaderboard` to rank users by tweet count.

### Query 5 – User Tweet Index

Create a structure that lets you get all the tweets for a specific user. Uses Redis Lists with keys like `tweets:screen_name` to store tweet IDs per user, and Redis Hashes with keys like `tweet:id` to store tweet data.

## AI Disclosure

This assignment was completed with the assistance of Claude Sonnet 4.6. The following prompts were used during development:

- "Create the boilerplate for each query"
- "Check my work and if it fulfils the rubric requirement"
- "Generate a readme based off the queries and rubric"
- "Create comments for each query detailing what it is"

All AI-generated code and content was reviewed and validated for correctness.