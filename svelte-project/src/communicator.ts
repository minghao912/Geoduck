export enum Direction {
    s2t = "s2t",
    t2s = "t2s"
};

export async function convert(direction: Direction, query: string): Promise<string> {
    let url = `https://node.dragonfruit.tk/panda_linux/${direction}?query=${query}`;
    
    console.log("> Direction is " + direction + ", query is " + query);
    console.log("> GET URL: " + url);

    return new Promise((resolve, reject) => {
        try {
            // Send GET request
            fetch(url).then(response => {
                response.json().then(panda => {
                    console.log(`> Server responded with {${panda.original}, ${panda.conversion}}`);

                    resolve(panda.conversion);
                }, rejection => {
                    reject("An error occurred: " + rejection);
                })
            }, rejection => {
                reject("An error occurred: " + rejection);
            })
        } catch (err) {
            console.log(err);
            reject("There was an error with the GET request: " + err);
        }
    });
}