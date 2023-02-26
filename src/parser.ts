import { Lexer, TOKENS } from "./lexer"
import { NODE, AST, AST_NODE } from "./ast"

export class SymTable {
  protected _symbols: Set<string>;
  
  constructor() {
    this._symbols = new Set();
  }

  addSymbol(symb: string) {
    this._symbols.add(symb);
  }

  compare(symbs: string[]) : boolean {
    let tmp_symbs = new Array<string>();
    let tmp_item: string;
    for (let item of symbs) {
      tmp_item = item.replace(/!/gi, "");
      if (tmp_symbs.includes(tmp_item)) return false;
      tmp_symbs.push(tmp_item);
    }
    for (let item of this._symbols.values()) {
      if (!tmp_symbs.includes(item)) return false;
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

  protected parseLparen(next_token: { value: string, type: number }) {
    let direction = (this._res_struct.current_node.left == null) ? NODE.LEFT : NODE.RIGHT;
    if (next_token != undefined && next_token.type == TOKENS.RPAREN) {
      throw "Parsing error at: ()";
    }
    this._res_struct.buildBlock(new AST_NODE({ value: "(", type: TOKENS.LPAREN }, this._res_struct.current_node), direction);
  }

  protected parseRparen(next_token: { value: string, type: number }) {
    if (next_token != undefined && (next_token.type == TOKENS.SYMB || next_token.type == TOKENS.LPAREN)) {
      throw "Parsing error at: )" + next_token.value;
    }
    this._res_struct.endBlock();
  }

  protected parseSymb(current_token: { value: string, type: number }, next_token: { value: string, type: number }) {
    let direction = (this._res_struct.current_node.left == null) ? NODE.LEFT : NODE.RIGHT;
    if (next_token != undefined && next_token.type == TOKENS.SYMB) {
      throw "Parsing error at: " + current_token.value + next_token.value;
    }
    this._sym_table.addSymbol(current_token.value);
    this._res_struct.buildSymbol(new AST_NODE({ value: current_token.value, type: TOKENS.SYMB}, this._res_struct.current_node), direction);
  }

  protected parseOperation(current_token: { value: string, type: number }, next_token: { value: string, type: number }) {
    if (next_token != undefined && next_token.type != TOKENS.SYMB && next_token.type != TOKENS.LPAREN) {
      throw "Parsing error at: " + current_token.value + next_token.value;
    }
    this._res_struct.buildOperation(current_token.value);
  }
  
  protected parseToken(current_token: { value: string, type: number }, next_token: { value: string, type: number }) {
    switch (current_token.type) {
      case TOKENS.LPAREN: {
	this.parseLparen(next_token);
        break;
      }
      case TOKENS.RPAREN: {
	this.parseRparen(next_token);
        break;
      }
      case TOKENS.SYMB: {
	this.parseSymb(current_token, next_token);
        break;
      }
      case TOKENS.OPERATION: {
	this.parseOperation(current_token, next_token);
        break;
      }
    }
  }
  
  parseStruct(input: string) {
    let token_list = this._lexer.splitInput(input);
    let current_token: { value: string, type: number };
    let next_token: { value: string, type: number };
    while (token_list.length != 0) {
      current_token = token_list.shift();
      next_token = token_list[0];
      this.parseToken(current_token, next_token);
    }
    if (this._res_struct.root.content.value != "") throw "Parenthesis parsing error - syntax error";
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
