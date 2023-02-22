import { TOKENS } from "./lexer";
import { AST_NODE } from "./ast";
import { SymTable } from "./parser";

// 1. Subtree of disjunction mustn't content conjunction
// 2. Only one child of conjunction could be conjunction
// 3. Child of negation should always be symbol
// Additional:
// 4. No childs in symbols
// 5. Only one child in negation

export class PCNFAnalyzer {
  protected _symb_arr: string[][];
  
  constructor () {
    this._symb_arr = new Array();
  }
  
  protected checkSyms(sym_table: SymTable) : boolean {
    for (let disjunc_1 = 0; disjunc_1 < this._symb_arr.length; ++disjunc_1) {
      if (!sym_table.compare(this._symb_arr[disjunc_1])) return false;
      for (let disjunc_2 = disjunc_1+1; disjunc_2 < this._symb_arr.length; ++disjunc_2) {
	if (JSON.stringify(this._symb_arr[disjunc_1].sort()) === JSON.stringify(this._symb_arr[disjunc_2].sort())) return false;
      }
    }
    return true;
  }

  protected addSymb(symb: string, pos: number) : boolean {
    if (this._symb_arr[pos].includes(symb)) return false;
    this._symb_arr[pos].push(symb);
    return true;
  }
  
  protected checkCNF(structRoot: AST_NODE, inserter: number, allowConjunction: boolean) : boolean {
    if (structRoot === null) return true;
    let left_inserter = inserter, right_inserter = inserter;
    if (structRoot.content.type == TOKENS.SYMB) {
      if (this._symb_arr.length == 0) this._symb_arr.push(new Array<string>);
      if (structRoot.parent.content.value == "!") {
	if (!this.addSymb("!"+structRoot.content.value, inserter)) return false;
      } else if (!this.addSymb(structRoot.content.value, inserter)) return false;
    }
    if (structRoot.content.value == "*") {
      if (!allowConjunction) return false;
      if (structRoot.left.content.value == "*" && structRoot.right.content.value == "*") return false;
      if (structRoot.left.content.value != "*") {
	this._symb_arr.push(new Array<string>());
	left_inserter = this._symb_arr.length - 1;
      }
      if (structRoot.right.content.value != "*") {
	this._symb_arr.push(new Array<string>());
	right_inserter = this._symb_arr.length - 1;
      }
    }
    if (structRoot.content.value == "!" && structRoot.left.content.type != TOKENS.SYMB) {
      return false;
    }
    let left = true, right = true;
    allowConjunction = (structRoot.content.value == "*");
    left = this.checkCNF(structRoot.left, left_inserter, allowConjunction);
    right = this.checkCNF(structRoot.right, right_inserter, allowConjunction);
    return left && right;
  }

  check(structRoot: AST_NODE, symTable: SymTable) : boolean {
    let res1 = this.checkCNF(structRoot, 0, true);
    let res2 = this.checkSyms(symTable);
    this._symb_arr = new Array();
    return res1 && res2;
  }
}
