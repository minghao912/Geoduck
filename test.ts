import * as fs from 'fs';

export function run(response): void {
    response.writeHead(200, {"Content-Type": "application/json"});

    fs.readFile('./test.json', null, (err, data) => {
        if (err) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("File not found");
        } else {
            response.write(data);
        }
        response.end();
    })
}   