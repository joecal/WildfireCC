"use strict" 

var Poker = (function($) {

  // set global variables
  var suits = ["spade", "heart", "diamond", "club"]
  var cards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
  var handA = []
  var handB = []
  var handAmatches = []
  var handBmatches = []
  var handApairs
  var handBpairs
  var handAtotal
  var handBtotal
  var count = 0
  var keyCount = 0

  // *-* public methods *-*

  var init = function() {
    // set button click listener to execute eventPlayAgainClicked function if clicked
    $(".buttons button").on("click", eventPlayAgainClicked)
    // start making the game
    makeGame()
  }

  // *-* utility methods *-*

  // create the game
  var makeGame = function() {

    // set noRepeatNumber as a random number between 0 and 4
    // must stay outside the makeHand functions scope
    var noRepeatNumber = randomNoRepeats([0,1,2,3,4]);

    // chooses a random index value of an array
    // will not choose the same index value until all other index values are chosen
    function randomNoRepeats(array) {
      var copy = array.slice(0)
      return function() {
        if (copy.length < 1) {
          copy = array.slice(0)
        }
        var index = Math.floor(Math.random() * copy.length)
        var item = copy[index]
        copy.splice(index, 1)
        return item
      }
    }

    // make individual card hands 
    var makeHand = function(player) {

      // determine player and set hand to the appropriate players global hand array
      var hand = player === 1 ? handA : handB

      // make hand
      for (var i = 0; i < 5; i++) {
        hand.push({
          "id": i + 1,
          "rank": cards[getRandomInt(0, 12)],
          "suit": suits[getRandomInt(0, 3)],
          "player": player
        })
      }

      // chooses a random number between 1 and 100, return true or false (90% chance true is returned)
      var isPair = function() {
        var x = getRandomInt(1, 100)
        x = x <= 90 ? true : false
        return x 
      }

      // set pair to true or false
      var pair = isPair()

      // if pair is true, force two random cards in the hand to match
      if (pair === true) {
        // noRepeatNumber() prevents a random card chosen from the original hand on the first execution
        // to not be chosen again on the second execution
        hand[noRepeatNumber()].rank = hand[noRepeatNumber()].rank
      }

    }

    // get a random integer given a minimum value and maximum value
    var getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    var findPairs = function(hand) {

      // container for standardized rank values
      var rankArray = []
      // determine player
      var player = hand[0].player === 1 ? 1 : 2

      // add an image tag to the card object and standardize rank vaules
      // loop through the cards array
      for (var i = 0; i < cards.length; i++) {
        // loop through the hand array
        for (var j = 0; j < hand.length; j++) {
          // set the cards image tag
          var imageTag = '<img src="http://h3h.net/images/cards/' + hand[j].suit + '_' + hand[j].rank + '.svg"' + ' class="card">'
          hand[j].image = imageTag
          // if the cards rank matches the rank in the cards array, 
          // set the cards standardized value and push the value to the rankArray
          if (cards[i] === hand[j].rank) {
            var newRankValue = hand[j].value = i + 1
            rankArray.push(newRankValue)
          }
        }
      }

      // container for card counts per hand
      var counts = []
      // number of pairs found in the hnd
      var totalPairs = 0
      // total score for pairs found in the hand
      var valueSum = 0
      // determine player and set handMatches to the appropriate players global handMatches array
      var handMatches = player === 1 ? handAmatches : handBmatches

      // count the number of ranks in the rankArray/hand
      for (var i = 0; i < rankArray.length; i++) {
        var num = rankArray[i]
        counts.push()
        counts[num] = counts[num] ? counts[num] + 1 : 1
      }

      // loop throught the card count to calculate value of only pairs, not all matches
      for (var key = 0; key < counts.length; key++) {
        // if more than one card with the same rank is found...
        if (counts[key] > 1 && counts[key] !== undefined) {
          // found pair
          totalPairs++
          // calculate the score of the matching pair
          valueSum += key + key
          // if four ranks are all the same
          if (counts[key] === 4) {
            valueSum *= 2
          }
          // if player two, reset keyCount
          if (player === 2) {
            keyCount = 0
          }
          // loop through the hand
          for (var i = 0; i < hand.length; i++) {
            // if the cards value matches the pairs key, set pair as pair0 or pair1
            if (hand[i].value === key) {
              var pair
              // if 4 or more matching cards are found, set pair as pair0 for the first pair 
              if (counts[key] >= 4 && keyCount < 2) {
                pair = "pair0"
                keyCount++
                // if 4 or more matching cards are found and the first pair is set, 
                // set pair as pair1 for the remaining mathes/pairs 
              } else if (counts[key] >= 4 && keyCount >= 2) {
                pair = "pair1"
                // otherwise, set pair as "pair" + (totalPairs - 1)
              } else {
                pair = "pair" + (totalPairs - 1)
              }
              // deconstruct the cards original image tag and add the image tags new pair class
              hand[i].image = hand[i].image.slice(0, -2) + " " + pair + '">'
              // push the matching card into the appropriate players global handMatches array
              handMatches.push(hand[i])
            }
          }
        }
      }

      // set the hand, hands matches, hands pairs and hands score variables
      var hand = player === 1 ? handA : handB
      var matches = player === 1 ? handAmatches : handBmatches
      var pairs = player === 1 ? handApairs = totalPairs : handBpairs = totalPairs
      var score = player === 1 ? handAtotal = valueSum : handBtotal = valueSum

      // log the results
      console.log("player: " + player + " hand: ",hand)
      console.log("player: " + player + " matches: ",matches)
      console.log("player: " + player + " pairs: ",pairs)
      console.log("player: " + player + " score: ",score)

    }

    // start making the hands
    makeHand(1)
    makeHand(2)

    // start finding the pairs in hands
    findPairs(handA)
    findPairs(handB)

    // determine the winner
    if (handApairs > handBpairs) {
      console.log("PLAYER 1 IS THE WINNER")
      $("#player1").parent().addClass("winning");
    } else if (handBpairs > handApairs) {
      console.log("PLAYER 2 IS THE WINNER")
      $("#player2").parent().addClass("winning");
    } else if (handApairs === handBpairs && handAtotal > handBtotal) {
      console.log("PLAYER 1 IS THE WINNER")
      $("#player1").parent().addClass("winning")
    } else if (handApairs === handBpairs && handAtotal < handBtotal) {
      console.log("PLAYER 2 IS THE WINNER")
      $("#player2").parent().addClass("winning")
    } else {
      console.log("NO WINNER")
    }

    // adds card images to the dom
    var appendCards = function(hand) {
      // determine the player
      var player = hand[0].player === 1 ? "#player1" : "#player2"
      // append players cards to the dom
      for (var i = 0; i < hand.length; i++) {
        $(player).append(hand[i].image)
      }
    }

    // start adding card images to the dom
    appendCards(handA)
    appendCards(handB)

  }

  var newGame = function() {
    // clear the card images from the dom
    $("#player1").empty()
    $("#player2").empty()
    // remove the "winning" class
    $(".hand").removeClass("winning")
    // reset all global variables
    handA = []
    handB = []
    handAmatches = []
    handBmatches = []
    handApairs
    handBpairs
    handAtotal
    handBtotal
    // start a new game
    makeGame()
  }

  // *-* event methods *-*

  var eventPlayAgainClicked = function() {
    // start new game
    newGame()
  }

  // expose public methods
  return {
    init: init
  }
})(jQuery)

$(document).ready(Poker.init)