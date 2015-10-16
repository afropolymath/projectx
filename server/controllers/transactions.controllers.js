'use strict'

var async = require('async'),
  _ = require('lodash'),
  natural = require('natural'),
  tokenizer = new natural.WordTokenizer();

module.exports = (root) => {
  return {
    smsRegisterTransaction: (req, res) => {
      root.child('transactions').once('value',
        snap => {
          let transactions = snap.val();
          
          if(!req.query || _.isEmpty(req.query)) {
            res.json({'status': 'Invalid Request'});
          }

          let payload = req.query;
          let mId = root.child('messages').push();
          mId.set(payload, 
            err => {
              if(err)
                res.json({'status': 'An error occured'});
              
              parseMessage(payload.msisdn, payload.text,
                decoupled => {
                  if(!decoupled) {
                    res.json({'status': 'Does not require my attention'});
                  }
                  
                  let status = false;
                  
                  _.forEach(transactions,
                    (transaction, id) => {
                      let amount = sanitizeNumber(decoupled.amount);
                      let diff = Math.abs(transaction.amount - amount); 
                      
                      if(compare(transaction.name, decoupled.depositor) && diff < 100) {
                        decoupled.mId = mId.toString();
                        decoupled.date = Date.now();
                        root.child('transactions').child(id).child('history').push(decoupled, function(err) {
                          if(err)
                            res.json({'status': 'An error occured'});
                          res.json({'status': 'Success'});
                        });
                      } else {
                        res.json({'status': 'Might not require my attention'});
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
  };
};

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

const compare = (phraseA, phraseB) => {
  // Reorder the phrases to follow alphabetical order for optimal search
  phraseA = tokenizer.tokenize(phraseA).sort().join(" ");
  phraseB = tokenizer.tokenize(phraseB).sort().join(" ");
  
  // Compare both phrases using Jaro Winkler Distance algorithm to get p between 0 and 1
  let p = natural.JaroWinklerDistance(phraseA, phraseB);
  
  // Require p > 0.8 to succeed
  console.log(p);
  return p > 0.8 ? true : false;
};

const parseMessage = (sender, message, complete) => {
  let banks = _.keys(FORMATS);
  async.eachSeries(banks,
    (bank, next) => {
      // Ensure the sender you got is the sender being expected
      if(FORMATS[bank].sender.toLowerCase() === sender.toLowerCase()) {
        // Run messages against regular expression
        let res = FORMATS[bank].pattern.exec(message);
        if(res) {
          // Return some information about the message you found
          complete({depositor: res[2], rawDate: res[3], amount: res[1], bank: bank});
        }
        next();
      }
    },
    err => {
      if(err)
        console.log("Something went wrong!");
      complete(false);
    }
  );
};

const sanitizeNumber = function(formattedNumber) {
  formattedNumber = formattedNumber.replace(",", "");
  return parseFloat(formattedNumber)
}