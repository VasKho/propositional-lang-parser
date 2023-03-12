export enum TOKENS {
  SYMB = 1,
  OPERATION,
  LPAREN,
  RPAREN
};

export const ALPH = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
	      'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1'];

export const OPS = { CONJ: '/\\', DISJ: '\\/', NEG: '!', IMPL: '->', EQL: '~' };

export class Lexer {
  constructor() { }

  splitInput(input: string) {
    input = input.replace(/\s/gi, "");
    let res: { value: string, type: number }[] = [];
    let buff = "";
    for (let i = 0; i < input.length; ++i) {
      if (input[i] == '(') {
        res.push({
          value: "(",
          type: TOKENS.LPAREN
        });
      } else if (input[i] == ')') {
        res.push({
          value: ")",
          type: TOKENS.RPAREN
        });
      } else if (ALPH.indexOf(input[i]) != -1) {
        res.push({
          value: input[i],
          type: TOKENS.SYMB
        });
      } else {
        buff = buff.concat(input[i]);
	for(let key in OPS) {
	  let value: string = OPS[key];
	  if (buff === value) {
	    res.push({
              value: buff,
              type: TOKENS.OPERATION
            });
            buff = "";
	  }
	}
      }
    }
    if (buff != "") throw (buff as string) + ": syntax error - bad name ";
    return res;
  }
}
