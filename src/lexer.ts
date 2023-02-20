export enum TOKENS {
  SYMB = 1,
  OPERATION,
  LPAREN,
  RPAREN
};

export enum OPS {
  CONJ = "*",
  DISJ = "+",
  NEG = "!"
};

const ALPH = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
	      'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1'];

const OPS_ARR = ['/\\', '\\/', '!'];

const OPS_TRANS = [OPS.CONJ, OPS.DISJ, OPS.NEG];

export class Lexer {
  constructor() { }

  splitInput(input: string) {
    input = input.replace(/\s/gi, "");
    let res: { value: string, type: number }[] = [];
    let buff = "";
    for (let i = 0; i < input.length; ++i) {
      if (input[i] == '(') {
        res.push({
          value: "",
          type: TOKENS.LPAREN
        });
      } else if (input[i] == ')') {
        res.push({
          value: "",
          type: TOKENS.RPAREN
        });
      } else if (ALPH.indexOf(input[i]) != -1) {
        res.push({
          value: input[i],
          type: TOKENS.SYMB
        });
      } else {
        buff = buff.concat(input[i]);
        if (OPS_ARR.indexOf(buff) != -1) {
          res.push({
            value: OPS_TRANS[OPS_ARR.indexOf(buff)],
            type: TOKENS.OPERATION
          });
          buff = "";
        }
      }
    }
    if (buff != "") throw (buff as string) + ": syntax error - bad name";
    return res;
  }
}
