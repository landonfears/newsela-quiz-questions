# Newsela Quiz Questions

Run `npm install` to install the test module.

Then Run `npm run start` or `npm run test` to run the function that will analyze the json file of quiz data in Jest.

### Notes
This functionality is defineid in the function `quizQuestions`

I computed the count of each word and phrase in every question to determine the number of words or phrases in "poor" quiz questions and "well" quiz questions.  The variable "poorPercent" determines what qualifies as poor.  The default value is 50, but it can be changed as a function parameter to tweak the results.

I also made a list of default excluded words that were omitted from the words. The default values are:

`['of', 'the', 'that', 'from', 'to', 'a', 'is', 'in', 'and', 'for']`

These values can also be edited as an options parameter of the function.

I returned the top N words and phrases that appear in both "poor" and "well" questions.  Again, the N parameter can be edited as a function parameter.  The default is 50.

Since many of the words can be found in both poor and well lists, I also returned the phrases appearing in only "poor" results, as well as only in "well" results.  This list gives a better chance that it's a relevant phrase that contributes to a poor or well result.

Use `N = 100`, `poorPercent = 50`, and the above list of excluded words, these are the results of the most relevant phrases and counts:

```
"poorOnly": {
  "from the article that": 294,
  "paragraph from the article": 286,
  "paragraph from the article that": 260,
  "the paragraph from the article": 247,
  "the paragraph from the article that": 243,
  "Select the paragraph from the article": 237,
  "Select the paragraph from the article that": 236,
  "author": 192,
  "between": 179,
  "that BEST": 178,
  "MOST": 174,
  "not": 173,
  "evidence": 164,
  "The article": 160,
  "supports": 159,
  "idea of": 156,
  "in a": 155,
  "include": 155,
  "explains": 154
}

"wellOnly": {
  "According to the": 510,
  "What is": 479,
  "the word": 467,
  "to the article,": 461,
  "According to the article,": 454,
  "Why": 413,
  "was": 413,
  "what": 376,
  "used": 359,
  "What is the": 336,
  "is a": 320,
  "can": 317,
  "contains a": 314,
  "meaning": 309,
  "do": 307,
  "word that": 305,
  "sentence above": 302,
  "reason": 301,
  "the sentence above": 301
}
```

With more time, I would do a more in depth analysis that would return more results and/or exclude more irrelevant words.

