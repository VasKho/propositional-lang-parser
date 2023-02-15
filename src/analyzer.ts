import { AST_NODE } from "./ast";

// 1. Subtree of disjunction mustn't content conjunction
// 2. Both childs of conjunction must be of the same type (if operation only one conjunction is possible)
// Additional:
// 3. No childs in symbols
// 4. Only one child in negation

export class PCNFAnalyzer {
  constructor () {}

  check(structRoot: AST_NODE, allowConjunction: boolean) : boolean {
    if (structRoot === null) return true;
    if (structRoot.content.value == "*") {
      if (!allowConjunction) return false;
      if (structRoot.left.content.type != structRoot.right.content.type) return false;
      if (structRoot.left.content.value == "*" && structRoot.left.content.value == "*") return false;
    }
    let left = true, right = true;
    allowConjunction = structRoot.content.value == "*";
    left = this.check(structRoot.left, allowConjunction);
    right = this.check(structRoot.right, allowConjunction);
    return left && right;
  }
}
