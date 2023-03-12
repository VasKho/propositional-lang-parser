import { question } from "readline-sync";
import { Parser } from "./parser";
import { toPDNF } from "./pdnf-converter";
import { PCNFAnalyzer } from "./analyzer";

while (true) {
  let input = question("Enter formula: ");
  console.log(input);
  let parser = new Parser();
  try {
    parser.parseStruct(input);
    parser.print(parser.AST, 0);
    console.log("PDNF:", toPDNF(parser));
    let analyzer = new PCNFAnalyzer();
    if (analyzer.check(parser.AST, parser.symTable) == true) {
      console.log("PASS");
    } else console.log("FAIL");
  } catch (e) {
    console.log(e);
  }
}
