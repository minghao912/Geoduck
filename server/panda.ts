import * as fs from 'fs';
import { OpenCC } from 'opencc';

export function run(url, response): void {
    response.writeHead(200, {"Content-Type": "application/json"});
    
    // a path in form "/panda/s2t" would return 's2t'
    const path = handleURL(url);
    const dir = path[0];
    const query = path[1];

    getData(dir, query).then(panda => {
        console.log(panda);

        response.write(JSON.stringify(panda));
        response.end();
    }).catch(err => {
        console.log(err);
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.write('File not found');
        response.end();
    });
}

interface Panda {
    original: string;
    conversion: string;
}

async function getData(direction: string, query: string): Promise<Panda> {
    let data = {
        "original": "",
        "conversion": ""
    };

    let converter: OpenCC;
    if (["s2t", "t2s"].indexOf(direction) > -1)     // Only supported conversion directions
        converter = new OpenCC(`${direction}.json`);

    // Convert and put into correct form
    const result = await converter.convertPromise(query);
    data = {
        "original": query,
        "conversion": result
    }

    return new Promise((resolve, reject) => {
        resolve(data);
        reject(null);
    });
}

function handleURL(url: string): [string, string] {
    const path = url.split(/[/?]/);   // Split on "/" or "?"

    let dir = path[2];
    let queryEncoded = path[3]; // This uses HTML URL Encoding, e.g. "%E6%B1", so need to decode it to Unicode
    let queryDecoded = decodeURIComponent(queryEncoded);

    console.log(`> Panda received path ${path}`);
    console.log(`> Parsed direction: ${dir}`);
    console.log(`> Parsed query: ${queryEncoded.substring(6)}, decoded to: ${queryDecoded.substring(6)}`);

    return [dir, queryDecoded];
}