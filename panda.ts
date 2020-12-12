import * as fs from 'fs';

export function run(path, response): void {
    response.writeHead(200, {"Content-Type": "application/json"});

    let dir = path.split('/')[2];   // a path in form "/panda/s2t" would return 's2t'

    getData(dir).then(panda => {
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

async function getData(direction: string): Promise<Panda> {
    let data = {
        "original": "",
        "conversion": ""
    };

    return new Promise((resolve, reject) => {
        resolve(data);
        reject(null);
    });
}