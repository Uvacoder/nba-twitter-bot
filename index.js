require('dotenv').config()
const {
    TwitterClient
} = require('twitter-api-client')
const axios = require('axios')
const cron = require('node-cron')
// import * as cron from 'node-cron'

const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
})

const config = {
    headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER}` }
};

const bodyParameters = {
    key: "value"
};

const tweet = cron.schedule('* 16 * * 6', () => {
    tweetScheduler()
});
tweet.start()

function tweetScheduler() {
    axios.get('https://www.balldontlie.io/api/v1/stats?seasons[]=2021&player_ids[]=145&postseason=false',
        bodyParameters,
        config
    )
        .then(response => {
            // https://stackoverflow.com/questions/36577205/what-is-the-elegant-way-to-get-the-latest-date-from-array-of-objects-in-client-s 

            /* var mostRecentDate = new Date(Math.max.apply(null, response.data.data[0].map( e => {
                return new Date(e.game.date);
             })));

             var mostRecentObject = response.data.data[0].filter( e => { 
                 var d = new Date( e.game.date ); 
                 return d.getTime() == mostRecentDate.getTime();
             })[0]; */

            const data = response.data.data[0] ? response.data : {}
            // const data = mostRecentObject ? mostRecentObject : {}
            let tweet
            const random = Math.floor(Math.random() * 100);
            // console.log('data', data.data[0])

            if (data && data.data[0].length) {
                for (let i = 0; i < data.data[0].length; i++) {
                    tweet = '  NBA Player Stats 🏀 ' + data.data[0].player.first_name + '' + data.data[0].player.last_name + ' - ' + data.data[0].player.position + `  #nba #basketball ${random} 🏀 ` + data.data[0].team.name
                }
            } else {
                tweet = '  NBA Player Stats 🏀 ' + data.data[0].player.first_name + '' + data.data[0].player.last_name + ' - ' + data.data[0].player.position + `  #nba #basketball ${random} 🏀 ` + data.data[0].team.name
            }

            // send tweet
            twitterClient.tweets.statusesUpdate({
                status: tweet
            }).then(response => {
                console.log('Tweeted', response)
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.error(err)
        })
}