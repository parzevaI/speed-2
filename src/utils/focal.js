export function findOVPIndex(word) {
  // remove any punctuation at the beginning or end of a word
  const nonPunctuation = word.replace(/^[^\w]+|[^\w]+$/g, '')
  const length = nonPunctuation.length

  // smaller words should favor the middle letter
  if (length <= 6) {
    return Math.ceil(length / 2) -1
  }

  return Math.ceil(length / 3) -1
}

export function getDuration(word, wpm) {
  let timePerWord = 60000 / wpm;

  // // increase time for words at the end of sentences (+40%)
  if (word.match(/[.?!;:]$/)) {
    timePerWord += timePerWord * 1
    return timePerWord
  }

  // // increase based on length of word (+10% per letter in the word)
  // // these should be adjusted and later also adjustable
  // timePerWord += (timePerWord * word.length * 0.5)
  if (word.length > 6) {
    timePerWord += (timePerWord * (word.length - 6) * 0.3)
  }

  return timePerWord;
}

