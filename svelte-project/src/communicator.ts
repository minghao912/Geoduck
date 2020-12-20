export enum Direction {
    s2t,
    t2s
};

export async function convert(direction: Direction, query: string): Promise<string> {
    console.log("> Direction is " + direction + ", query is " + query);

    return new Promise((resolve, reject) => {
        try {
            resolve("testVal");
        } catch (err) {
            console.log(err);
            reject("There was an error converting the text.");
        }
    });
}