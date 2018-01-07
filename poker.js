Poker = (function($) {

  var cardBaseURL = "http://h3h.net/images/cards/{suit}_{card}.svg";
  var suits = ['spade', 'heart', 'diamond', 'club'];
  var cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  var handA = [];
  var handB = [];
  var handAmatches = [];
  var handBmatches = [];
  var handApairs;
  var handBpairs;
  var handAtotal;
  var handBtotal;
  var count = 0;
  var keyCount = 0;

  // *-* public methods *-*

  var init = function() {
    $(".buttons button").on("click", eventPlayAgainClicked);
    makeGame();
  };

  // *-* utility methods *-*

  var makeGame = function() {

    var makeHand = function() {
      var pair = isPair();

      // make hands
      if (count === 0) {
        for (var i = 0; i < 5; i++) {
          handA.push({
            "id": i + 1,
            "rank": cards[getRandomInt(0, 12)],
            "suit": suits[getRandomInt(0, 3)],
            "player": 1
          })
          count++
        }
      } else {
        for (var i = 0; i < 5; i++) {
          handB.push({
            "id": i + 1,
            "rank": cards[getRandomInt(0, 12)],
            "suit": suits[getRandomInt(0, 3)],
            "player": 2
          })
          count++
        }
      }

      // force pair 90 percent of the time
      if (count === 5 && pair === true) {
        handA[getRandomInt(0, 4)].rank = handA[getRandomInt(0, 4)].rank;
      }
      if (count === 10 && pair === true) {
        handB[getRandomInt(0, 4)].rank = handB[getRandomInt(0, 4)].rank;
      }
    };

    // get random integer given a minimum value and max value
    var getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // choose random integer between 1 and 100
    var isPair = function() {
      var x = getRandomInt(1, 100)

      if (x <= 90) {
        // 90 percent chance x is between 1 and 90
        return true
      } else if (x > 90) {
        // 10 percent chance x is between 91 and 100
        return false
      }
    }

    // find pairs
    var findPairs = function(hand) {
      var rankArray = [];

      // add immag tag to card object and standardize rank vaules
      for (var i = 0; i < cards.length; i++) {
        for (var j = 0; j < hand.length; j++) {
          var imageTag = '<img src="http://h3h.net/images/cards/' + hand[j].suit + '_' + hand[j].rank + '.svg"' + ' class="card">'
          hand[j].image = imageTag
          if (cards[i] === hand[j].rank) {
            var newRankValue = hand[j].value = i + 1;
            rankArray.push(newRankValue)
          }
        }
      }

      var counts = {};
      var totalPairs = 0;
      var valueSum = 0;

      // count all matching ranks in hand
      for (var i = 0; i < rankArray.length; i++) {
        var num = rankArray[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }

      // calculate value of only pairs, not all matches
      for (key in counts) {
        if (counts[key] > 1) {
          valueSum += Number(key) + Number(key)
          // if two pair ranks are all the same
          if (counts[key] === 4) {
            valueSum *= 2
          }
          // found pair
          totalPairs++

          if (hand[0].player === 2) {
            keyCount = 0;
          }
          // set pair0 or pair1 and push pairs into an array
          for (var i = 0; i < hand.length; i++) {
            if (hand[i].value === Number(key)) {
              var pair;
              if (counts[key] >= 4 && keyCount < 2) {
                pair = "pair0";
                keyCount++
              } else if (counts[key] >= 4 && keyCount >= 2) {
                pair = "pair1";
              } else {
                pair = "pair" + (totalPairs - 1);
              }
              hand[i].image = hand[i].image.slice(0, -2) + " " + pair + '">'
              if (count === 10) {
                handAmatches.push(hand[i]);
              } else {
                handBmatches.push(hand[i]);
              }
            }
          }
        }
      }

      // set hand value and pair variables
      if (count === 10) {
        handAtotal = valueSum
        handApairs = totalPairs
        console.log("handA ", handA)
        console.log("handAmatches ", handAmatches)
        console.log("handApairs ", handApairs)
        console.log("handAtotal: ", handAtotal);
      } else {
        handBtotal = valueSum
        handBpairs = totalPairs
        console.log("handB ", handB)
        console.log("handBmatches ", handBmatches)
        console.log("handBpairs ", handBpairs)
        console.log("handBtotal: ", handBtotal);
      }
      count++
    }

    // make hands
    makeHand()
    makeHand()
    // find pairs in hands
    findPairs(handA)
    findPairs(handB)

    // determine winner
    if (handApairs > handBpairs) {
      console.log("A IS THE WINNER")
      $("#player1").parent().addClass("winning");
    } else if (handBpairs > handApairs) {
      console.log("B IS THE WINNER")
      $("#player2").parent().addClass("winning");
    } else if (handApairs === handBpairs && handAtotal > handBtotal) {
      console.log("A IS THE WINNER")
      $("#player1").parent().addClass("winning");
    } else if (handApairs === handBpairs && handAtotal < handBtotal) {
      console.log("B IS THE WINNER")
      $("#player2").parent().addClass("winning");
    } else {
      console.log("NO WINNER")
    }

    // add card images to the dom
    var appendCards = function(hand) {
      for (var i = 0; i < hand.length; i++) {
        var player;
        if (count === 12) {
          player = '#player1';
        } else {
          player = '#player2';
        }
        $(player).append(hand[i].image)
      }
      count++
    }

    // add card images to the dom
    appendCards(handA)
    appendCards(handB)

  }

  var newGame = function() {
    $("#player1").empty();
    $("#player2").empty();
    $(".hand").removeClass("winning");
    handA = [];
    handB = [];
    handAmatches = [];
    handBmatches = [];
    handApairs;
    handBpairs;
    handAtotal;
    handBtotal;
    count = 0;
    makeGame();
  }

  // *-* event methods *-*

  var eventPlayAgainClicked = function() {
    newGame();
  };

  // expose public methods
  return {
    init: init
  };
})(jQuery);

$(document).ready(Poker.init);
