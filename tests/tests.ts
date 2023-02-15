import { Parser } from "./parser";
import { PCNFAnalyzer } from "./analyzer";

enum RESULT {
  OK = 0,
  SYNTAX_ERROR,
  NOT_PCNF
}

let parser = new Parser();
let analyzer = new PCNFAnalyzer();

function testOk(example: string) : boolean {
  parser.parseStruct(example);
  return analyzer.check(parser.AST, true);
}

function testNotPcnf(example: string) : boolean {
  parser.parseStruct(example);
  return !analyzer.check(parser.AST, true);
}

function testSyntaxError(example: string) : boolean {
  try {
    parser.parseStruct(example);
    return false;
  } catch(e) {
    return true;
  }
}

function test(example: string, res: number) {
  let testArr: { (data: string): boolean; }[] = [testOk, testSyntaxError, testNotPcnf];
  (testArr[res](example) == true)? console.log(example, ": PASS") : console.log(example, ": FAIL");
}


test("((A /\\ B) \\/ ((A \\/ B) /\\ (A \\/ B)))", RESULT.NOT_PCNF);
