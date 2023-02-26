import { question } from "readline-sync";
import { Parser } from "./parser";
import { PCNFAnalyzer } from "./analyzer";

while (true) {
  let input = question("Enter formula: ");
  console.log(input);
  let parser = new Parser();

  try {
    parser.parseStruct(input);
    parser.print(parser.AST, 0);
    let analyzer = new PCNFAnalyzer();
    if (analyzer.check(parser.AST, parser.symTable) == true) {
      console.log("PASS");
    } else console.log("FAIL");
  } catch (e) {
    console.log(e);
  }
}
