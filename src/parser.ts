import { Lexer, TOKENS } from "./lexer"
import { NODE, AST, AST_NODE } from "./ast"

class SymTable {
  private _symbols: string[];
  
  constructor() {
    this._symbols = [];
  }

  addSymbol(s: string) {
    this._symbols.push(s);
  }

  compareSymbols(syms: string[]) {
    for (const i of this._symbols) {
      if (syms.indexOf(i) === -1) return false;
    }
    return true;
  }
}

export class Parser {
  protected _lexer: Lexer;
  protected _sym_table: SymTable;
  protected _res_struct: AST;
  protected _size: number;

  constructor() {
    this._lexer = new Lexer();
    this._sym_table = new SymTable();
    this._res_struct = new AST(new AST_NODE({ value : "", type: 0 }, null));
    this._size = 0;
  }

  get AST() { return this._res_struct.current_node.left; }

  get symTable() { return this._sym_table; }

  parseStruct(input: string) {
    let token_list = this._lexer.splitInput(input);
    while (token_list.length != 0) {
      let current_token = token_list.shift();
      let direction = (this._res_struct.current_node.left == null) ? NODE.LEFT : NODE.RIGHT;
      switch (current_token.type) {
        case TOKENS.LPAREN: {
          this._res_struct.buildBlock(new AST_NODE({ value: "", type: 0 }, this._res_struct.current_node), direction);
          break;
        }
        case TOKENS.RPAREN: {
          this._res_struct.endBlock();
          break;
        }
        case TOKENS.SYMB: {
          this._sym_table.addSymbol(current_token.value);
          this._res_struct.buildSymbol(new AST_NODE({ value: current_token.value, type: TOKENS.SYMB}, this._res_struct.current_node), direction);
          break;
        }
        case TOKENS.OPERATION: {
          this._res_struct.buildOperation(current_token.value);
          break;
        }
      }
    }
    if (this._res_struct.root.content.value != "") throw "Parenthesis parsing error - syntax error";
    if (this._res_struct.current_node != this._res_struct.root) throw "Parenthesis parsing error - syntax error";
    if (this._res_struct.current_node.left.content.type == 0) throw "Extra parenthesis - syntax error";
  }

  print(root: AST_NODE, space: number) {
    if (root === null) return;
    space += 5;
    this.print(root.right, space);
    console.log("");
    let out = "";
    for (let i = 5; i < space; ++i) out += " ";
    out += root.content.value;
    console.log(out);
    this.print(root.left, space);
  }
}
