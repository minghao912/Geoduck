import * as OpenCC from 'opencc-js';

/**
 * Runs PandaCC
 * @param url The GET request URL. In form "/direction?query=abc"
 * @param response The http response element.
 * 
 * This example converts "汉字" from Simplified to Traditional
 * @example run("/s2t?query=汉字", response)
 */
export function run(url: string, response): void {
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
        response.write('Error generating conversion');
        response.end();
    });
}

interface Panda {
    original: string;
    conversion: string;
}

async function getData(direction: string, query: string): Promise<Panda> {
    let data: Panda = {
        "original": "",
        "conversion": ""
    };
    
    return new Promise(async (resolve, reject) => {
        // Get direction
        let dir: [string, string];
        switch(direction) {
            case "s2t":
                dir = ['cn', 't'];
                break;
            case "t2s":
                dir = ['t', 'cn'];
                break;
            default:
                return reject(null);
        }

        // Convert
        let result: string;
        await OpenCC.Converter(dir[0], dir[1]).then(convert => {
            result = convert(query.substring(6)) as string;   // Remove the "query=" part of the query string
            console.log("> Result: " + result);
        });

        // Put into correct form
        data = {
            "original": query,
            "conversion": result
        }

    
        resolve(data);
    });
}

function handleURL(url: string): [string, string] {
    const path = url.split(/[/?]/);   // Split on "/" or "?"

    let dir = path[2];
    let queryEncoded = path[3]; // This uses HTML URL Encoding, e.g. "%E6%B1", so need to decode it to Unicode
    let queryDecoded = decodeURIComponent(queryEncoded);

    console.log(`> Panda received path ${path.join(", ")}`);
    console.log(`> Parsed direction: ${dir}`);
    console.log(`> Parsed query: ${queryEncoded.substring(6)}, decoded to: ${queryDecoded.substring(6)}`);

    return [dir, queryDecoded];
}
