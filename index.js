let player = {
    name: "You",
    chips: 500
}

let cards = []
let bet = 0
let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""
let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")
let playerEl = document.getElementById("player-el")

let dealer = {
    name: "Dealer",
    cards: []
}

playerEl.textContent = player.name + ": $" + player.chips

function getRandomCard() { //gets a random card at the beginning of the round. also works for the dealer and when HIT is clicked
    let randomNumber = Math.floor( Math.random()*13 ) + 1
    if (randomNumber > 10) {
        return 10
    } else if (randomNumber === 1) {
        return 11
    } else {
        return randomNumber
    }
}

function startGame() { //game starts when BET button is clicked
    if (player.chips === 0) {
      alert("You've run out of money! Game over.")
      return
    }
    
    isAlive = true //sets the player as "alive" to make the game run
    hasBlackJack = false //by default, the player does not have a black jack unless achieved
    let firstCard = getRandomCard() //both player and dealer get 1st two random cards
    let secondCard = getRandomCard()
    playerCards = [firstCard, secondCard]
    playerSum = firstCard + secondCard
    
    dealer.cards = [getRandomCard(), getRandomCard()]
    
    renderGame()
    
    // Ask for bet
    let betInput = prompt("Enter your bet (1-" + player.chips + "):")
    bet = parseInt(betInput)
    
    // Check if bet is valid
    if (isNaN(bet) || bet < 1 || bet > player.chips) {
      alert("Invalid bet. Please enter a number between 1 and " + player.chips + ".")
      startGame()
    } else {
        player.chips -= bet
        playerEl.textContent = player.name + ": $" + player.chips
        document.getElementById("bet-btn").disabled = true;
        document.getElementById("hit-btn").disabled = false;
        document.getElementById("stand-btn").disabled = false;

        if (playerSum === 21) {
            hasBlackJack = true
            isAlive = false
            message = "You've got Blackjack! You win!"
            player.chips += bet * 2
            playerEl.textContent = player.name + ": $" + player.chips
            document.getElementById("hit-btn").disabled = true;
            document.getElementById("stand-btn").disabled = true;
            document.getElementById("bet-btn").disabled = false;
        } else if (playerSum > 21) {
            isAlive = false
            message = "You bust! Dealer wins!"
            document.getElementById("hit-btn").disabled = true;
            document.getElementById("stand-btn").disabled = true;
            document.getElementById("bet-btn").disabled = false;
        }
        renderGame()
    }
}
  
function renderGame() { //this method is called every button click and event to ensure that the game state is updated and the values are changed
    cardsEl.textContent = "Player's Cards: "
    for (let i = 0; i < playerCards.length; i++) {
      cardsEl.textContent += playerCards[i] + " "
    }
    
    sumEl.textContent = "Player's Sum: " + playerSum
    
    let dealerSum = dealer.cards[0] + dealer.cards[1]
    let dealerCardsText = "Dealer's Cards: " + dealer.cards[0] + " ?"
    let dealerSumText = "Dealer's Sum: ?"
    
    if (isAlive === false) {
        let dealerSum = dealer.cards[0] + dealer.cards[1]
        let dealerCardsText = "Dealer's Cards: " + dealer.cards.join(" ")
        let dealerSumText = "Dealer's Sum: " + dealerSum
        document.getElementById("dealer-cards-el").textContent = dealerCardsText
        document.getElementById("dealer-sum-el").textContent = dealerSumText
    }
    
    if (playerSum <= 20) { //checks if the player achievs a black jack, or wins against the dealer ending the round
        message = "Do you want to draw a new card?"
    }

    if (isAlive === false) { //finalizes the score and displays the result
      if (dealerSum > 21) {
            message = "Dealer bust! You win!"
      } else if (playerSum > 21) {
            message = "Bust! Dealer wins!"
      } else if (dealerSum < playerSum) {
            message = "You win!"
      } else if (dealerSum > playerSum) {
            message = "Dealer wins!"
      } else {
            message = "It's a tie!"
      }
    }
    
    messageEl.textContent = message
    document.getElementById("dealer-cards-el").textContent = dealerCardsText
    document.getElementById("dealer-sum-el").textContent = dealerSumText
}
  
function newCard() { //new card for every HIT clicked
    if (isAlive === true && hasBlackJack === false) {
        let card = getRandomCard()
        playerSum += card
        playerCards.push(card)
        renderGame()
    }
}
  
function stand() { //ends round
    if (isAlive === false) {
        return
    }

    isAlive = false
    let dealerSum = dealer.cards[0] + dealer.cards[1]
    if (playerSum > 21) { //finalizes the round giving the results
        message = "Bust! Dealer wins!"
        document.getElementById("dealer-cards-el").textContent = "Dealer's Cards: " + dealer.cards[0] + " " + dealer.cards[1]
        document.getElementById("dealer-sum-el").textContent = "Dealer's Sum: " + dealerSum
    } else {
        // Dealer's turn
        document.getElementById("dealer-cards-el").textContent = "Dealer's Cards: " + dealer.cards[0] + " " + dealer.cards[1]
        document.getElementById("dealer-sum-el").textContent = "Dealer's Sum: " + dealerSum

        let intervalId = setInterval(function() {
            if (dealerSum < 17) {
                let card = getRandomCard()
                dealer.cards.push(card)
                dealerSum += card
                document.getElementById("dealer-cards-el").textContent = "Dealer's Cards: " + dealer.cards.join(" ")
                document.getElementById("dealer-sum-el").textContent = "Dealer's Sum: " + dealerSum
            } else {
                clearInterval(intervalId)

                // Check if dealer has won or lost
                if (dealerSum > 21) {
                    message = "Dealer busts! You win!"
                    player.chips += bet * 2
                } else if (dealerSum < playerSum) {
                    message = "You win!"
                    player.chips += bet * 2
                } else if (dealerSum > playerSum) {
                    message = "Dealer wins!"
                } else {
                    message = "It's a tie!"
                    player.chips += bet
                }
                playerEl.textContent = player.name + ": $" + player.chips
                renderGame()
                document.getElementById("hit-btn").disabled = true;
                document.getElementById("stand-btn").disabled = true;
                document.getElementById("bet-btn").disabled = false;

                // Reset game state and start new round
                setTimeout(function() {
                    document.getElementById("hit-btn").disabled = false;
                    document.getElementById("stand-btn").disabled = false;
                    document.getElementById("bet-btn").disabled = true;
                    startGame();
                }, 2000);
            }
        }, 1000);
    }
}
  
document.getElementById("hit-btn").addEventListener("click", newCard) //adds event listeners to HIT and STAND buttons.
document.getElementById("stand-btn").addEventListener("click", stand)
