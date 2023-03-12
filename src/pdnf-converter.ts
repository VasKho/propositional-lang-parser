import { Parser } from "./parser"


function binaryToArr(num: number, mask: number): boolean[] {
  let tmp = num.toString(2);
  for (let i = mask-tmp.length; i != 0; --i) {
    tmp = "0".concat(tmp);
  }
  let res = new Array<boolean>;
  for (let i of tmp) {
    res.push((i == '1')? true: false);
  }
  return res;
}

function buildElemConj(interpr: object): string {
  let elem_conj = "";
  let el_num = 0;
  for (const key of Object.keys(interpr)) {
    if (el_num != 0) {
      if (interpr[key]) elem_conj = String("("+key+"/\\"+elem_conj+")");
      else elem_conj = String("((!"+key+")/\\"+elem_conj+")");
    } else {
      if (interpr[key]) elem_conj = elem_conj.concat(key);
      else elem_conj = elem_conj.concat("(!"+key+")");
    }
    ++el_num;
  }
  return elem_conj;
}

export function toPDNF(parser: Parser): string {
  let num = 2 << (parser.symTable.symbols.size-1);
  let tmp_res = new Array<boolean>;
  let pdnf: string[] = [];
  let conj_num = 0;
  for (let i = num-1; i >= 0; --i) {
    tmp_res = binaryToArr(i, parser.symTable.symbols.size);
    let result = tmp_res.reduce((result, field, index) => {
      result[[...parser.symTable.symbols][index]] = field;
      return result;
    }, {});
    if(parser.AST.eval(result)) {
      if(conj_num != 0) {
	pdnf.unshift("\\/");
	pdnf.unshift(buildElemConj(result));
	pdnf.unshift("(");
	pdnf.push(")");
      }
      else {
	pdnf.push(buildElemConj(result));
      }
      ++conj_num;
    }
  }
  pdnf.push(")".repeat(conj_num));
  return pdnf.join('');
}
