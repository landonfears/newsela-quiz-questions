var fs = require('fs');
let jsonData = require('./sample/quiz_questions.json');

const defaultPoorPercent = 50;
const defaultN = 50; // 50 most frequent words or phrases
const omitChars = ['\n', '\r', '\t', '•', '\\?', '\\.'];
const defaultExcludeWords = ['of', 'the', 'that', 'from', 'to', 'a', 'is', 'in', 'and', 'for'];
const defaultWordsOnly = false;

/*
  Will analyze the json file with quiz questions results, and returns and object
  with the top N occurences of words or phrases that appeared in the questions
  students did poorly and well on, along with the count of the occurences.

  Also returns a total count of the poor and well questions, as well as returns
  the poor and well words or phrases not found in the other list
*/
function quizQuestions(options) {
  const poorPercent = (options && options.poorPercent) || defaultPoorPercent;
  const N = (options && options.n) || defaultN;
  const excludeWords = (options && options.excludeWords) || defaultExcludeWords;
  const wordsOnly = (options && options.wordsOnly) || defaultWordsOnly;

  // Map object for words that do poorly and well
  const poorMap = new Map();
  const wellMap = new Map();
  let poorTotal = 0;
  let wellTotal = 0;

  //console.log("json data", jsonData);
  jsonData.map((question, index) => {
    // Split question into words, filtering out extra spaces and HTML tags
    let split = stripTags(question.text)
      .allReplace(omitChars)
      .split(' ')
      .filter(word => word);
    
    if (question.percent_correct * 100 > poorPercent) {
      // Put in the wellMap object
      insetWordsAndPhrases({
        words: split, 
        map: wellMap, 
        wordsOnly,
        excludeWords
      });
      wellTotal++;
    } else {
      insetWordsAndPhrases({
        words: split, 
        map: poorMap, 
        wordsOnly,
        excludeWords
      });
      poorTotal++;
    }
  });

  const poorNode = mapSort(poorMap).entries();
  let poorCurr = poorNode.next().value;
  let poorCount = 0;
  let poorTop = {};
  while(poorCurr && poorCount < N) {
    poorTop[poorCurr[0]] = poorCurr[1];
    poorCurr = poorNode.next().value;
    poorCount++;
  }

  const wellNode = mapSort(wellMap).entries();
  let wellCurr = wellNode.next().value;
  let wellCount = 0;
  let wellTop = {};
  while(wellCurr && wellCount < N) {
    wellTop[wellCurr[0]] = wellCurr[1];
    wellCurr = wellNode.next().value;
    wellCount++;
  }

  var key;
  const poorOnly = {};
  const wellOnly = {};
  // words in poor list not in well list
  for (key in poorTop) {
    if (!wellTop[key]) {
      poorOnly[key] = poorTop[key];
    }
  }
  for (key in wellTop) {
    if (!poorTop[key]) {
      wellOnly[key] = wellTop[key];
    }
  }

  return {
    poorTotal,
    wellTotal,
    poor: poorTop,
    well: wellTop,
    poorOnly,
    wellOnly
  };
}

// allReplace will take a hash and replace the value in key with the value the key points to
String.prototype.allReplace = function(list) {
  var retStr = this;
  list.map(s => {
    retStr = retStr.replace(new RegExp(s, 'g'), '');
  })
  return retStr;
};

function insetWordsAndPhrases(options) {
  let {words, map, wordsOnly, excludeWords} = options;
  // Get all permutations of phrases from words in the question
  for (var i = 0; i < words.length; i++) {
    if (wordsOnly && !excludeWords.includes(words[i])) {
      if (map.has(words[i])) {
        map.set(words[i], map.get(words[i]) + 1);
      } else {
        map.set(words[i], 1);
      }
    } else {
      for (var j = 0; j <= i; j++) {
        let phrase = words.slice(j, i + 1).join(' ');

        // Omit excluded word if single work and not phrase
        if (j < i || (j === i && !excludeWords.includes(phrase))) {
          if (map.has(phrase)) {
            map.set(phrase, map.get(phrase) + 1);
          } else {
            map.set(phrase, 1);
          }
        }
      }
    }
  }
  return map;
}

function stripTags(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, "");
}

function mapSort(map) {
  return new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
}

module.exports = {
  quizQuestions
};