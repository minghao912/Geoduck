var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// const OpenCC = require('opencc');
import pkg from 'opencc';
const { OpenCC } = pkg;
const s2t = new OpenCC('s2t.json');
const t2s = new OpenCC('t2s.json');
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield s2t.convertPromise("汉字");
        console.log(result);
    });
}
main();
