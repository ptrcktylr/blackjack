/**
 * @fileOverview
 * Holds the constructor for the Card, Deck, and Shoe object and 
 * contains the ordered deck of cards as well as some other 
 * card-related functions.
 */
"use strict";

/**
 * Constructor for Card; a Card has a suit, rank, value and an image.
 * @constructor
 * @param {String} suit The suit of the card can be clubs, diamonds, hearts, or spades.
 * @param {String} rank The rank of the card indicates which card in the suit is better.
 * @param {Number} value The number given to the card to be added to the score.
 */
class Card {
    constructor(suit, rank, value) {
        this.suit = suit;
        this.rank = rank;
        this.value = value;

        // image names are first char of rank and suit.
        this.image_name = (rank[0] + suit[0]).toUpperCase() + ".png";
    }
}


/**
 * Constructor for Deck; a Deck has 52 cards which excludes Jokers.
 * @constructor
 */
class Deck {
    constructor() {
        this.cards = [];    
    }
    
    /**
     * Initializes the unshuffled deck and adds all cards.
     */
    createDeck() {
        // ace can be 1 or 11 (1+10), face cards all worth 10.
        let suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        let ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
        let values = [[1, 10], 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < ranks.length; j++) {
                // ranks & values correspond, use j for both.
                this.cards.push(new Card(suits[i], ranks[j], values[j]));
            }
        }
    }

    /**
     * Shuffles the deck of cards using the Fisher-Yates shuffle, O(n) time complexity.
     */
    shuffleDeck() {
        let i = 0,
            j = 0,
            temp = null;

        for (i = this.cards.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1));
            temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }
}

/**
 * Constructor for Shoe, which holds numDecks of shuffled cards for dealing
 * to players and the dealer.
 * @constructor
 * @param {Number} numDecks The number of shuffled decks to place into the shoe.
 * @param {Number} cutoff The minimum percent of cards remaining before shoe is reshuffled.
 */
class Shoe {
    constructor(numDecks, cutoff=0.75) {
        this.cards = [];
        this.numDecks = numDecks;
        this.cutoff = cutoff;
    }

    /**
     * Adds one shuffled deck to the shoe.
     */
    addShuffledDeck() {
        let deck = new Deck();
        deck.createDeck();
        deck.shuffleDeck();
        this.cards = this.cards.concat(deck.cards);
    }

    /**
     * Initializes shoe and adds the number of decks.
     */
    createShoe() {
        for (let i = 0;i < this.numDecks; i++) {
            this.addShuffledDeck();
        }
    }

    /**
     * Indicates whether or not the shoe is past the cut point and needs to be reshuffled.
     * @returns {Boolean} True if shoe is past cut point, false otherwise.
     */
    pastCutoff() {
        let numCards = this.numDecks * 52;
        let remainingCards = this.cards.length;
        let percentRemaining = Math.floor((remainingCards / numCards) * 100);
        return (percentRemaining < this.cutoff);
    }

    /**
     * Deals a card by removing from top of the shoe, when card dealt it's no longer in shoe.
     * @param {Number} [num] Optional number of cards to deal, deals 1 if not present.
     * @returns {Card|Card[]} Card or array of cards.
     */
    deal(num=1) { 
        if (this.cards.length < num) throw new Error('Not enough cards to deal!');

        // if number to deal is 1
        if (num === 1) return this.cards.shift();

        // if number to deal > 1
        let cards = [];
        for (let i = 0; i < num; i++) {
            cards.push(this.cards.shift());
        }
        return cards;
    }
}

/**
 * Gets the numeric value of a given hand of cards.
 * @param {Card[]} [hand] An array of cards.
 * @returns {Number} The value of the hand.
 */
function evalHand(hand) {

    // calc num of aces
    let numAces = hand.reduce((total, {rank}) => rank === "ace" ? total + 1 : total, 0);
    console.log(`evalHand: numAces: ${numAces}`)
    
    // calc score (aces valued at 11)
    let score = hand.reduce((total, {value}) => Array.isArray(value) ? total + value.reduce((acc, curr) => acc + curr, 0) : total + value, 0);
    console.log(`evalHand: score: ${score}`)

    // if an ace would make you bust, make it value 1 instead of 11
    while (score > 21 && numAces) {
        score -= 10;
        numAces--;
    }

    console.log(`evalHand: return: ${score}`)
    return score;
}

/**
 * Gets the numeric value of a given hand of cards.
 * @param {Card[]} [hand] An array of cards.
 * @returns {Number} The integer value of the hand.
 */
function scoreHand(hand) {
    let value = evalHand(hand);
    return value;
}

/**
 * Returns boolean indicating whether the hand is bust, over 21, or not.
 * @param {Card[]} [hand] An array of cards.
 * @returns {Boolean} True if hand value is above 21, false otherwise.
 */
function isBust(hand) {
    let value = evalHand(hand);
    return value > 21;
}

/**
 * Indicates whether dealer's hand is below a hard 17
 * @param {Card[]} hand An array of the dealers cards.
 * @return {Boolean} true if the dealer's hand is below a hard 17, 
 * false otherwise
 */
function belowHard17(hand) {
    let value = evalHand(hand);
    return value < 17;
}

export { Shoe, scoreHand, isBust, belowHard17 };