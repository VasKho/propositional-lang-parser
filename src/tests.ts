import { Parser } from "./parser";
import { PCNFAnalyzer } from "./analyzer";

enum RESULT {
  OK = 0,
  SYNTAX_ERROR,
  NOT_PCNF
}

let analyzer = new PCNFAnalyzer();

function testOk(example: string) {
  let parser = new Parser();
  parser.parseStruct(example);
  analyzer.check(parser.AST, true)? console.log(example, "- PASS: Is PCNF") : console.log(example, "- FAIL");
}

function testNotPcnf(example: string) {
  let parser = new Parser();
  parser.parseStruct(example);
  (!analyzer.check(parser.AST, true))? console.log(example, "- PASS: Not PCNF") : console.log(example, "- FAIL");
}

function testSyntaxError(example: string) {
  try {
    let parser = new Parser();
    parser.parseStruct(example);
    console.log(example, "- FAIL");
  } catch(e) {
    console.log(example, "- PASS: Syntax Error");
  }
}

function test(example: string, res: number) {
  let testArr: { (data: string) : any; }[] = [testOk, testSyntaxError, testNotPcnf];
  testArr[res](example);
}

// A
test("A", RESULT.OK);
// 1
test("1", RESULT.OK);
// (A /\ (!A))
test("(A /\\ (!A))", RESULT.OK);
// ((A \/ B) /\ C)
test("((A \\/ B) /\\ C)", RESULT.OK);
// ((A \/ (B \/ C)) /\ (A \/ ((!B) \/ C)))
test("((A \\/ (B \\/ C)) /\\ (A \\/ ((!B) \\/ C)))", RESULT.OK);
// ((A \/ ((!B) \/ (!C))) /\ ((!D) \/ (E \/ F)))
test("((A \\/ ((!B) \\/ (!C))) /\\ ((!D) \\/ (E \\/ F)))", RESULT.OK);
// (((((A \/ B) \/ ((!A) \/ B)) /\ (A \/ (!B))) /\ ((A \/ B) \/ C)) /\ (((!A) \/ B) \/ (A \/ B)))
test("(((((A \\/ B) \\/ ((!A) \\/ B)) /\\ (A \\/ (!B))) /\\ ((A \\/ B) \\/ C)) /\\ (((!A) \\/ B) \\/ (A \\/ B)))", RESULT.OK);
// (A \/ (B \/ C)) /\ (A \/ ((!B) \/ C))
test("(A \\/ (B \\/ C)) /\\ (A \\/ ((!B) \\/ C))", RESULT.SYNTAX_ERROR);
// ((A /\ B) \/ ((A \/ B) /\ (A \/ B)))
test("((A /\\ B) \\/ ((A \\/ B) /\\ (A \\/ B)))", RESULT.NOT_PCNF);
// (!(B \/ C))
test("(!(B \\/ C))", RESULT.NOT_PCNF);
