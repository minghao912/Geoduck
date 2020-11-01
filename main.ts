import pkg from 'opencc';
const {OpenCC} = pkg;

const s2t = new OpenCC('s2t.json');
const t2s = new OpenCC('t2s.json');

async function main() { 
    const result: string = await s2t.convertPromise("汉字");
    console.log(result);
}

main();