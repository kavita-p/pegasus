const jsdom = require("jsdom");
const { JSDOM } = jsdom;

(async () => {
  // retrieval
  const rss = await fetch(
    "https://us12.campaign-archive.com/feed?u=c993b88231f5f84146565840e&id=ff7136981c",
    { cache: "no-store" }
  );
  const xml = await rss.text();
  const dom = new JSDOM(xml, "text/html").window.document;

  // plucking
  let poem = {
    url: dom.querySelector(".poemTitle a").getAttribute("href"),
    title: dom.querySelector(".poemTitle").textContent.trim(),
    text: dom.querySelector(".poem").innerHTML.trim(),
    author: dom.querySelector(".text-attribution").innerHTML.trim(),
    supportingText: dom.querySelector(".text-supporting").innerHTML.trim(),
    note: dom.querySelector(".note p").innerHTML.trim(),
    source: "",
  };

  [poem.source] = [...dom.querySelectorAll(".fauxGraph")].filter((tag) =>
    tag.textContent.includes("Source:")
  );

  poem.source = poem.source.innerHTML.trim();

  // formatting
  const postContent = `*${poem.author}  
  ${poem.supportingText}  
  via [the Poetry Foundation](${poem.url})*
  ${poem.text}
  
  **A Note from the Editor**  
  ${poem.note}  
  <sup>${poem.source}</sup>
  
  <hr/>
  <sup>I'm Pegasus! I fetch the Poetry Foundation's Poem of the Day and crosspost it to cohost. Find more details about me here.</sup>`;

  console.log(postContent);
})();
