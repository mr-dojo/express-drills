const express = require("express");
const morgan = require("morgan");
const app = express();

/* Create a route handler function on the path /sum that accepts two query parameters 
named a and b and find the sum of the two values. Return a string in the format 
"The sum of a and b is c". Note that query parameters are always strings so some thought 
should be given to converting them to numbers.*/

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("App is working");
});

app.get("/sum", (req, res) => {
  let { a, b } = req.query
  let sum = parseInt(a) + parseInt(b)
  res.send(`The sum of ${a} and ${b} is ${sum}`)
}) 

/*Create an endpoint /cipher. The handler function should accept a query parameter 
named text and one named shift. Encrypt the text using a simple shift cipher also 
known as a Caesar Cipher. It is a simple substitution cipher where each letter is 
shifted a certain number of places down the alphabet. So if the shift was 1 then 
A would be replaced by B, and B would be replaced by C and C would be replaced by 
D and so on until finally Z would be replaced by A. using this scheme encrypt the 
text with the given shift and return the result to the client. 
Hint - String.fromCharCode(65) is an uppercase A and 'A'.charCodeAt(0) is the 
number 65. 65 is the integer value of uppercase A in UTF-16. See the documentation 
for details.*/

app.get("/cipher", (req, res) => {
  let requiredFields = ["text", "shift"]
  let { text, shift } = req.query
  requiredFields.forEach(field => {
    if (!req.query[field]) {
      res.status(400).send(`query ${field} is required`);
    }
  });

  text = text.toUpperCase()
  shift = parseInt(shift)

  const start = 65
  const max = 90
  let encryptedText = ""

  for (let i = 0; i < text.length; i++) {
    let textCode = parseInt(text[i].charCodeAt(0)) + shift
    if (textCode > max) {
      encryptedText += String.fromCharCode(start + ((textCode - max) - 1))
    } else {
      encryptedText += String.fromCharCode(textCode)
    }
  }  

  res.send(encryptedText)
});

/*To send an array of values to the server via a query string simply repeat 
the key with different values. For instance, the query string ?arr=1&arr=2&arr=3 results
in the query object { arr: [ '1', '2', '3' ] }. Create a new endpoint /lotto 
that accepts an array of 6 distinct numbers between 1 and 20 named numbers. 
The function then randomly generates 6 numbers between 1 and 20. Compare the 
numbers sent in the query with the randomly generated numbers to determine how 
many match. If fewer than 4 numbers match respond with the string "Sorry, you lose". 
If 4 numbers match respond with the string "Congratulations, you win a free ticket", 
if 5 numbers match respond with "Congratulations! You win $100!". If all 6 numbers 
match respond with "Wow! Unbelievable! You could have won the mega millions!".
*/

app.get("/lotto", (req, res) => {
  let requiredFields = ["arr"]
  let { arr } = req.query
  const randomArr = []

  requiredFields.forEach(field => {
    if (!req.query[field]) {
      res.status(400).send(`query ${field} is required`);
    } else if (arr.length < 6) {
      res.status(400).send("requires 6 arguments");
    };
  });
  
  arr.forEach(num => {
    randomArr.push(Math.round(Math.random() * 20))
  })

  let checkArray = (arr, randomArr) => {
    let score = 0

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == randomArr[i]) {
        score = score + 1
      }
    }

    if (score === 1) {
      return "You lose, but at least its working";
    } else if (score < 4) {
      return "Sorry, you loose";
    } else if (score === 4) {
      return "Congratulations, you win a free ticket";
    } else if (score === 5) {
      return "Congratulations! You win $100!";
    } else if (score === 6) {
      return "Wow! Unbelievable! You could have won the mega millions!";
    }
  };

  res.status(200).send(checkArray(arr, randomArr));
});

app.listen(8080, console.log("listening on port http://localhost:8080"));
