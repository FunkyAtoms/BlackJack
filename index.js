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

function getRandomCard() {
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
    
    isAlive = true
    hasBlackJack = false
    let firstCard = getRandomCard()
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
    }
}
  
function renderGame() {
    cardsEl.textContent = "Player's Cards: "
    for (let i = 0; i < playerCards.length; i++) {
      cardsEl.textContent += playerCards[i] + " "
    }
    
    sumEl.textContent = "Player's Sum: " + playerSum
    
    let dealerSum = dealer.cards[0] + dealer.cards[1]
    let dealerCardsText = "Dealer's Cards: " + dealer.cards[0] + " ?"
    let dealerSumText = "Dealer's Sum: ?"
    
    if (isAlive === false) {
        dealerCardsText = "Dealer's Cards: " + dealer.cards[0] + " " + dealer.cards[1]
        dealerSumText = "Dealer's Sum: " + dealerSum
    }
    
    if (playerSum <= 20) {
        message = "Do you want to draw a new card?"
    } else if (playerSum === 21) {
        hasBlackJack = true
        isAlive = false
    } else if (playerSum > 21) {
        isAlive = false
    }

    if (isAlive === false) {
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
  
function newCard() {
    if (isAlive === true && hasBlackJack === false) {
        let card = getRandomCard()
        playerSum += card
        playerCards.push(card)
        renderGame()
        // if (playerSum > 21) {
        //     isAlive = false
        //     message = "Bust! Dealer wins!"
        //     renderGame()
        //     document.getElementById("hit-btn").disabled = true;
        //     document.getElementById("stand-btn").disabled = true;
        //     document.getElementById("bet-btn").disabled = false;
        // } else if (playerSum === 21) {
        //     isAlive = false
        //     message = "You've got Blackjack!"
        //     renderGame()
        //     document.getElementById("hit-btn").disabled = true;
        //     document.getElementById("stand-btn").disabled = true;
        //     document.getElementById("bet-btn").disabled = false;
        // }        
    }
}
  
function stand() {
    if (isAlive === false) {
        return
    }

    isAlive = false
    let dealerSum = dealer.cards[0] + dealer.cards[1]
    if (playerSum > 21) {
        message = "You bust! Dealer wins!"
    } else if (dealerSum > 21) {
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
    // document.getElementById("hit-btn").disabled = true;
    // document.getElementById("stand-btn").disabled = true;
    // document.getElementById("bet-btn").disabled = false;
}
  
document.getElementById("hit-btn").addEventListener("click", newCard)
document.getElementById("stand-btn").addEventListener("click", stand)
