import { question } from "readline-sync";
import { Parser } from "./parser";
import { PCNFAnalyzer } from "./analyzer";

// let input = "(A \\/ (B \\/ C)) /\\ (A \\/ ((!B) \\/ C))"; // => HEHE
// let input = "(A \\/ (B \\/ C)) /\\ (A /\\ ((!B) \\/ C))"; // => NOT HEHE
// let input = "((A/\\B)\\/((A\\/B)/\\(A\\/B)))" // => NOT HEHE;
// let input = "(((((A \\/ B) \\/ ((!A) \\/ B)) /\\ (A \\/ (!B))) /\\ ((A \\/ B) \\/ C)) /\\ (((!A) \\/ B) \\/ (A \\/ B)))";

// while (true) {
// let input = question("Enter formula: ");
let input = "1";
  console.log(input);
  let parser = new Parser();

  parser.parseStruct(input);
  parser.print(parser.AST, 0);
  let analyzer = new PCNFAnalyzer();
  if (analyzer.check(parser.AST, true) == true) {
    console.log("PASS");
  } else console.log("FAIL");
// }
