import { TOKENS, OPS } from "./lexer";

export enum NODE {
  LEFT = 0,
  RIGHT
};

export abstract class AST_NODE {
  protected _content: {value: string, type: number};
  protected _parent: AST_NODE;
  protected _left: AST_NODE;
  protected _right: AST_NODE;

  constructor(c: {value: string, type: number}) {
    this.content = c;
    this._left = null;
    this._right = null;
  }

  set content(c: {value: string, type: number}) { this._content = c; }
  get content() { return this._content; }
  get parent() { return this._parent; }
  get left() { return this._left; }
  get right() { return this._right; }

  insertChild(node: AST_NODE, direction: NODE) {
    if (direction == NODE.LEFT) {
      this._left = node;
      this._left._parent = this;
    } else if (direction == NODE.RIGHT) {
      this._right = node;
      this._right._parent = this;
    }
  }

  abstract eval(interpretations: object): boolean;
}

export class AST_SYMB_NODE extends AST_NODE {
  constructor(value: string) {
    super({ value: value, type: TOKENS.SYMB });
  }
  
  eval(interpretations: object): boolean {
    if (this.content.value == '1') return true;
    if (this.content.value == '0') return false;
    return interpretations[this.content.value];
  }
}

export class AST_OP_NODE extends AST_NODE {
  constructor(value: string) {
    super({ value: value, type: TOKENS.OPERATION });
  }
  
  eval(interpretations: object): boolean {
    let lVal: boolean, rVal: boolean;
    if (this.left != null) lVal = this.left.eval(interpretations);
    if (this.right != null) rVal = this.right.eval(interpretations);
    switch (this.content.value) {
      case OPS.CONJ: { return lVal && rVal; }
      case OPS.DISJ: { return lVal || rVal; }
      case OPS.EQL: { return lVal == rVal; }
      case OPS.IMPL: { return !lVal || rVal; }
      case OPS.NEG: { return !lVal; }
    }
  }
}

class AST_ROOT extends AST_NODE {
  constructor() {
    super({ value: "", type: 0 });
  }

  eval(): boolean { return false; }
}

export class AST {
  protected _current_node: AST_NODE;
  protected _root: AST_NODE;

  constructor() {
    let root = new AST_ROOT();
    this._current_node = root;
    this._root = root;
  }

  get root() { return this._root; }

  get current_node() { return this._current_node; }

  buildBlock(direction: NODE) {
    let newBlock = new AST_OP_NODE("");
    this.current_node.insertChild(newBlock, direction);
    if (direction == NODE.LEFT)
      this._current_node = this.current_node.left;
    else if (direction == NODE.RIGHT)
      this._current_node = this.current_node.right;
  }

  endBlock() {
    this._current_node = this.current_node.parent;
  }

  buildOperation(value: string) {
    this.current_node.content.value = value;
  }

  buildSymbol(value: string, direction: NODE) {
    let newSym = new AST_SYMB_NODE(value);
    this.current_node.insertChild(newSym, direction);
  }
};
