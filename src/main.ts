import { question } from "readline-sync";
import { Parser } from "./parser";

// let input = "(A \\/ (B \\/ C)) /\\ (A \\/ ((!B) \\/ C))";
// let input = "(((((A \\/ B) \\/ ((!A) \\/ B)) /\\ (A \\/ (!B))) /\\ ((A \\/ B) \\/ C)) /\\ (((!A) \\/ B) \\/ (A \\/ B)))";

while (true) {
  let input = question("Enter formula: ");
  console.log(input);
  let parser = new Parser();

  parser.parseStruct(input);
  parser.print(parser.AST, 0);
}
