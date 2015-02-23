# Reddit Guesser v0.2.1

Type in two subreddits, and decide which title belongs to which subreddit!

[Live example](http://www.natzim.me/reddit-guesser/)

## Todo:

### In the near future:

- Have the option to add more subreddits for an extra challenge
- Add loading thing
- Add some kind of cool logo thing

### In the distant future:

- Have an option rate your subreddit combination and submit it to an online database, where people can upvote their favourite combinations

## Changelog

### v1.0.0

- Cleaned up literally everything
- Removed PHP option

### v0.2.1

- Added "Use PHP?" option for people who cannot access reddit

### v0.2

- Changed info icon to info icon with circle
- Changed icon hover cursor to default
- Changed title and solution storage solution to a 2D array to allow for expandability
- Split the JSON calls into two, making it slower but allowing both subreddits to have equal amounts of results
- Rearranged the script file into a more logical order
- Removed comments - ain't nobody got time for that
- Added JSHint crap
- Added warning if the user has javascript disabled or an outdated browser
- Added some witty banter to the console for cheaters
- Updated buttons to improve cross-browser stuff

### v0.1.2

- Changed jQuery version to support older browsers
- Changed cog icon to info icon
- Changed some classes into ids for speed purposes
- Changed "limit" to "results per subreddit"
- Replaced individual subreddit variables with array to allow for eventual expandability
- Added javascript annotation
- Added basic error reporting
- Removed button colouring to allow for eventual expandability
- Removed that damned JSHint code

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
