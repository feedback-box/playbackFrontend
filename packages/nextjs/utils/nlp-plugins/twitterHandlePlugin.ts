import nlp from "compromise";

// Define the plugin to detect Twitter handles
const twitterHandlePlugin = {
  patterns: {
    TwitterHandle: /@\w+/,
  },
  tags: {
    TwitterHandle: {
      isA: "Person",
      description: "A Twitter handle like @username",
    },
  },
  words: {},
};

// Extend nlp with the new plugin
nlp.plugin(twitterHandlePlugin);

export default nlp;
