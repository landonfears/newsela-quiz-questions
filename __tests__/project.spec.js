const project = require('../project');

describe('Quiz Questions', () => {
  test('should correctly NOT have "a" in result', async () => {
    let results = await project.quizQuestions({
      poorPercent: 50,
      n: 100,
      excludeWords: ['of', 'the', 'that', 'from', 'to', 'a', 'is', 'in', 'and', 'for', 'an', 'by', 'has']
    });

    // output results
    console.log(JSON.stringify(results, null, 2));

    expect('a' in results.poor).toEqual(false);
    expect('article' in results.poor).toEqual(true);
    expect('a' in results.well).toEqual(false);
    expect('sentence' in results.well).toEqual(true);
  });
});