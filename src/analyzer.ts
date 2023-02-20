import { TOKENS } from "./lexer"
import { AST_NODE } from "./ast";

// 1. Subtree of disjunction mustn't content conjunction
// 2. Only one child of conjunction could be conjunction
// 3. Child of negation should always be symbol
// Additional:
// 4. No childs in symbols
// 5. Only one child in negation

export class PCNFAnalyzer {
  constructor () {}

  protected checkSyms() : boolean { return true; }
  
  check(structRoot: AST_NODE, allowConjunction: boolean) : boolean {
    if (structRoot === null) return true;
    if (structRoot.content.value == "*") {
      if (!allowConjunction) return false;
      if (structRoot.left.content.value == "*" && structRoot.right.content.value == "*") return false;
    }
    if (structRoot.content.value == "!" && structRoot.left.content.type != TOKENS.SYMB) {
      return false;
    }
    let left = true, right = true;
    allowConjunction = structRoot.content.value == "*";
    left = this.check(structRoot.left, allowConjunction);
    right = this.check(structRoot.right, allowConjunction);
    return left && right && this.checkSyms();
  }
}
