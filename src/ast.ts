export enum NODE {
  LEFT = 0,
  RIGHT
};

export class AST_NODE {
  protected _content: string;
  protected _parent: AST_NODE;
  protected _left: AST_NODE;
  protected _right: AST_NODE;

  constructor(c: string, parent: AST_NODE) {
    this.content = c;
    this._parent = parent;
    this._left = null;
    this._right = null;
  }

  set content(c: string) { this._content = c; }

  get content() { return this._content; }

  get parent() { return this._parent; }

  get left() { return this._left; }

  get right() { return this._right; }

  insertChild(node: AST_NODE, direction: NODE) {
    if (direction == NODE.LEFT) {
      this._left = node;
    } else if (direction == NODE.RIGHT) {
      this._right = node;
    }
  }
}

export class AST {
  protected _current_node: AST_NODE;
  protected _root: AST_NODE;

  constructor(root: AST_NODE) {
    this._current_node = root;
    this._root = root;
  }

  get root() { return this._root; }

  get current_node() { return this._current_node; }

  buildBlock(node: AST_NODE, direction: NODE) {
    this.current_node.insertChild(node, direction);
    if (direction == NODE.LEFT)
      this._current_node = this.current_node.left;
    else if (direction == NODE.RIGHT)
      this._current_node = this.current_node.right;
  }

  endBlock() {
    this._current_node = this.current_node.parent;
  }

  buildOperation(value: string) {
    this.current_node.content = value;
  }

  buildSymbol(node: AST_NODE, direction: NODE) {
    this.current_node.insertChild(node, direction);
  }
};
