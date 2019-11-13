
$( document ).ready(function() {


//construct a deck

function getDeck() {
    
    let deck = [];
	
	const suits = ['&hearts;', '&clubs;', '&diams;','&spades;'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10' ,'J', 'Q', 'K'];
        
    for (let i=0; i< suits.length; i++) {
      for (let j=0; j < values.length; j++) {
            deck.push(values[j] + '' + suits[i]);
        }
    }    
	
    return deck;
	}


// Shuffle the deck

function shuffle (cardDeck){
    
    let shuffled =[];
    let n = cardDeck.length;
    let i;
    
    while (n > 30) {
        i = Math.floor(Math.random() * n--);
        shuffled.push(cardDeck.splice(i, 1)[0]);

    }
    return shuffled;
    
}
    
    
let currentDeck = shuffle(getDeck());
let playersCards = [];
let dealersCards = [];
let yourscore = 0;
let compscore = 0;
    
//calculate current hand's score
    
function scoreCalculator(array) {
        
    for (let i=0; i< array.length; i++){
        array[i] = array[i].replace(/[H|	&clubs;|&diams;|&spades;|&hearts;]/g,'');
        array[i] = array[i].replace(/K|Q|J/g, '10');
        array[i] = array[i].replace(/A/g, '11');   
    }
        
   let total = array.map(Number).reduce((a, b) => a+b);               
    
    return total;
}
    
// reset the game 
    
function reset(){
    console.log(currentDeck);
    currentDeck = shuffle(getDeck());
    playersCards = [];
    dealersCards = [];
    
    //card cleaup
    $('.addedcard').hide(200);
    $('#card1').hide(200);
    $('#card2').hide(200);
    
    $('#dealerCard1').hide(200);
    $('#dealerCard2').hide(200);
    
    //rebuild scoreboard
    
    $('.totalscore').html('Your total is: <span class="playerscore"></span>');
    $('.dealertotalscore').html('The dealer\'s total is: <span class="dealerscore"></span>')
    
    
}  
 
   //results handlers 
    
   function dealerWin() {
       
    $('#stand').hide(1000);
    $('#hit').hide(1000);
    compscore++;  
    
    $('#compscore').text(compscore);
    
   } 

   function playerWin() {
       
    $('#stand').hide(1000);
    $('#hit').hide(1000);
    yourscore++;  
    $('#yourscore').text(yourscore);
    
   } 
   
    function draw() {
     $('.totalscore').text('A draw!');
     $('.dealertotalscore').text('Neither player scores');  
    $('#stand').hide(1000);
    $('#hit').hide(1000);
        
   } 
 
    //new game clicked

$('#newgame').on('click', () => {
    
    reset()
    $('#stand').show(1000);
    $('#hit').show(1000);
    
    
    playersCards.push(currentDeck.pop());
    $('#card1').show(1000);
    $('#card1').html(playersCards[0]);
    
    playersCards.push(currentDeck.pop());
    $('#card2').show(1000);
    $('#card2').html(playersCards[1]);
    
    //check for two aces
    
    if(scoreCalculator(playersCards) > 21){
          playersCards.splice(playersCards.indexOf('11'), 1, '1');
          $('.playerscore').text(scoreCalculator(playersCards));
                  }
    
    //deal cards to dealer
    
    dealersCards.push(currentDeck.pop());
    $('#dealerCard1').show(1000);
    $('#dealerCard1').html(dealersCards[0]);
    
    dealersCards.push(currentDeck.pop());
    $('#dealerCard2').show(1000);
    $('#dealerCard2').html(dealersCards[1]);
    
     //check for two aces 
    
    if(scoreCalculator(dealersCards) > 21){
          playersCards.splice(dealersCards.indexOf('11'), 1, '1');
          $('.dealerscore').text(scoreCalculator(dealersCards));                  }
    
    
    //check for 21 on first two cards
    
    if (scoreCalculator(dealersCards) == 21 && scoreCalculator(playersCards) == 21){
        draw();
    }
        
    else if (scoreCalculator(dealersCards) == 21){
        dealerWin();
        $('.totalscore').text('Unlucky deal!');
        $('.dealertotalscore').text('The dealer wins!');
    }   
    else if (scoreCalculator(playersCards) == 21){
        playerWin();
        $('.totalscore').text('Lucky deal!');
        $('.dealertotalscore').text('You win!');
    }  
    
    //initiate scores
    $('.playerscore').text(scoreCalculator(playersCards));
    $('.dealerscore').text(scoreCalculator(dealersCards));
    
     
});

    // player hits

  $('#hit').on('click', () => {  
      
      let newCard = currentDeck.pop();
      playersCards.push(newCard);
      $('.cards').append('<div class="card addedcard">' + newCard + '</div>');
      $('.playerscore').text(scoreCalculator(playersCards));
      $('.dealerscore').text(scoreCalculator(dealersCards));
      
      if(scoreCalculator(playersCards) > 21){
          if(playersCards.includes('11') && scoreCalculator(playersCards) !== 32){
              playersCards.splice(playersCards.indexOf('11'), 1, '1');
              $('.playerscore').text(scoreCalculator(playersCards));
              
          }
          else{
          $('.totalscore').text('You went bust!');
          $('.dealertotalscore').text('The dealer wins!');
          dealerWin();
             }
      }
      
      
  });
               
     //player stands
    
     $('#stand').on('click', () => { 
         
         if(scoreCalculator(dealersCards) === scoreCalculator(playersCards) && scoreCalculator(dealersCards) > 15) {
              
              draw();
          }
         else {
                   
        while (scoreCalculator(dealersCards) <= scoreCalculator(playersCards) || scoreCalculator(dealersCards) < 17){
             
             let dealerCard = currentDeck.pop();
             dealersCards.push(dealerCard);
             $('.dealercards').append('<div class="card addedcard">' + dealerCard + '</div>');
             $('.dealerscore').text(scoreCalculator(dealersCards));      
     
         
            
          if(scoreCalculator(dealersCards) > scoreCalculator(playersCards) ) {
              if(scoreCalculator(dealersCards) > 21){
               
              if(dealersCards.includes('11')){
              dealersCards.splice(dealersCards.indexOf('11'), 1, '1');
              $('.dealerscore').text(scoreCalculator(dealersCards));
              
          }
              
            else{ 
          $('.totalscore').text('You win!');
          $('.dealertotalscore').text('The dealer went bust!');
           playerWin();
                }
                }
              
              else {
             $('.dealertotalscore').append('<p>The dealer wins!</p>');
             dealerWin();
              }
          }
            
            
        };
         } 
    });
});

