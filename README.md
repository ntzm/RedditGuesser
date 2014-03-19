# Reddit Guesser v0.1.1

Type in two subreddits, and decide which title belongs to which subreddit!

[Live example](http://www.natzim.com/redditguesser/)

## Todo:

### In the near future:

- Have an equal number of results per subreddit (will take longer, so will introduce a loading bar of some description)
- Make a branch which uses PHP to call the reddit API, so people at work or school where reddit is blocked can still use it
- Improve error reporting
- Add more options
- Make it harder to cheat
- Have the option to add more subreddits for an extra challenge
- Clean up bootstrap CSS that I stole (make sure to check responsiveness)

### In the distant future:

- Have an option rate your subreddit combination and submit it to an online database, where people can upvote their favourite combinations

## Changelog

### v0.1.2

- Changed jQuery version to support older browsers
- Changed cog icon to info icon
- Changed some classes into ids for speed purposes
- Changed "limit" to "results per subreddit"
- Replaced individual subreddit variables with array to allow for eventual expandability
- Added javascript annotation
- Added basic error reporting
- Removed button colouring to allow for eventual expandability

### v0.1.1

- (minor fix) Forced all inputs and solutions to be lower case

- Improved reddit API call by merging the two calls
- Added an endgame tab which shows your score
- Made the tabs disappear when you click either of the buttons
- Removed loading bar
- Added limit and order options
- Cut down unnecessary jQuery
- Some other stuff I probably forgot

### v0.1

Original release