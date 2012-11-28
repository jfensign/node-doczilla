var Redis=require("redis");
var Client=Redis.createClient();

module.exports={
 Client: Client,
 Redis: Redis
}