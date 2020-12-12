import * as url from 'url';
import * as fs from 'fs';
import * as test from './test';
import * as panda from './panda';

function renderHTML(filepath: string, response): void {
    response.writeHead(200, {'Content-Type': 'text/html'});

    fs.readFile(filepath, null, (err, data) => {
        if (err) {
            response.writeHead(404);
            response.write('File not found: ./index.html');
        } else {
            response.write(data);
        }
        response.end();
    });
}

export function handleRequest(request, response): void {
    const path = url.parse(request.url).pathname;

    const pathSplit = path.split('/');
    if (pathSplit.length >= 1 && pathSplit[1] == 'panda')   // transfers all "/panda/xxx" requests to panda
        return panda.run(path, response);

    switch (path) {
        case '/':
            renderHTML('./index.html', response);
            break;
        case '/test':
            test.run(response);
            break;
        default:
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.write('File not found');
            response.end();
            break;
    }
}