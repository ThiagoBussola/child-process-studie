import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import split from "split";

console.log("initializing", process.pid);
// once just to get the firtst message and then die
process.once("message", async (msg) => {
  try {
    await pipeline(createReadStream(msg), split(), async function* (source) {
      let counter = 0;
      for await (const chunk of source) {
        //ignore empty lines
        if (!chunk.length) continue;

        // simulate an error to see the error handling
        // if (++counter <= 20) {
        //   throw new Error(`Found some problem in item\n${chunk.toString()}`);
        // }
        const item = JSON.parse(chunk);
        if (!item.email.includes("gmail")) continue;

        process.send({
          status: "success",
          message: item,
        });
      }
    });
  } catch (error) {
    process.send({
      status: "error",
      message: error.message,
    });
  }
});
