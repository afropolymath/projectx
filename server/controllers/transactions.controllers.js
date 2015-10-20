'use strict'

var async = require('async'),
  asyncEachObject = require('async-each-object'),
  _ = require('lodash'),
  natural = require('natural'),
  tokenizer = new natural.WordTokenizer();

module.exports = (root) => {
  return {
    smsRegisterTransaction: (req, res) => {
      try {
        root.child('transactions').once('value',
          snap => {
            var transactions = snap.val();
            
            if(!req.query || _.isEmpty(req.query)) {
              throw new Error('Invalid Request');
            }
            
            var payload = req.query;
            var mId = root.child('messages').push();
            mId.set(payload, 
              err => {
                if(err) {
                  throw new Error('An error occured');
                }

                parseMessage(payload.msisdn, payload.text,
                  decoupled => {
                    if(!decoupled) {
                      throw new Error('Does not require my attention');
                    }
                    
                    var status = false;
                    
                    async.eachObject(transactions,
                      (transaction, id, next) => {
                        var amount = sanitizeNumber(decoupled.amount);
                        var diff = Math.abs(transaction.amount - amount); 
                        
                        if(compare(transaction.name, decoupled.depositor) && diff < 100) {
                          decoupled.mId = mId.toString();
                          decoupled.date = Date.now();
                          root.child('transactions').child(id).child('history').push(decoupled, function(err) {
                            if(err)
                              throw new Error('An error occured');
                            status = true
                            next();
                          });
                        } else {
                          next();
                        }
                      },
                      err => {
                        if(err)
                          throw new Error('An error occured');
                        if(status) {
                          res.json({'status': 'Success'});
                        }
                        else {
                          res.json({'status': 'Does not require my attention'});
                        }
                      }
                    ); 
                  }
                );
              }
            );
          }
        );
      }
      catch (ex) {
        res.json({'status': ex.message})
      }
      
    }
  };
};

// Refactor to load formats from database
const FORMATS = {
  diamond: {
    sender: 'DIAMOND',
    pattern: /Credit Alert!\s+Acc#:.+\s+Amt:(.+)\s+Desc:(.+)\s+Time:(.+)\s+[.\s,:\w]+/
  },
  stanbic: {
    sender: 'STANBIC',
    pattern: /Credit Alert!/
  }
};

const ASYNC_COMPLETE = 4;

const compare = (phraseA, phraseB) => {
  // Reorder the phrases to follow alphabetical order for optimal search
  phraseA = tokenizer.tokenize(phraseA).sort().join(" ");
  phraseB = tokenizer.tokenize(phraseB).sort().join(" ");
  
  // Compare both phrases using to get p between 0 and 1
  var p = natural.JaroWinklerDistance(phraseA, phraseB);
  console.log(phraseA, phraseB, p);
  // Require p > 0.8 to succeed
  return p > 0.8 ? true : false;
};

const parseMessage = (sender, message, complete) => {
  async.eachObject(FORMATS,
    (bank, id, next) => {
      // Ensure the sender you got is the sender being expected
      if(bank.sender.toLowerCase() === sender.toLowerCase()) {
        // Run messages against regular expression
        var res = bank.pattern.exec(message);
        if(res) {
          // Return some information about the message you found
          var result = {
            data: {
              depositor: res[2],
              rawDate: res[3],
              amount: res[1],
              bank: bank.sender
            },
            status: ASYNC_COMPLETE
          };
          
          next(result);
        }
        else {
          next();
        }
      }
    },
    err => {
      if(err.status && err.status === ASYNC_COMPLETE) {
        complete(err.data);
      }
      else {
        if(err)
          console.log("Something went wrong!");
        complete(false);
      }
    }
  );
};

const sanitizeNumber = function(formattedNumber) {
  formattedNumber = formattedNumber.replace(",", "");
  return parseFloat(formattedNumber)
}