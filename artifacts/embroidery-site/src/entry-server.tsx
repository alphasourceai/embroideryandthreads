import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import App from "./App";
import "./index.css";

const RENDER_TIMEOUT_MS = 15_000;

export function render(pathname: string) {
  return new Promise<string>((resolve, reject) => {
    const output = new PassThrough();
    const chunks: Buffer[] = [];
    let settled = false;
    let timeout: NodeJS.Timeout;

    output.on("data", (chunk: Buffer | string) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    output.on("end", () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    output.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(error);
    });

    const stream = renderToPipeableStream(<App ssrPath={pathname} />, {
      onAllReady() {
        stream.pipe(output);
      },
      onShellError(error) {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        reject(error);
      },
      onError(error) {
        console.error(`Prerender error for ${pathname}:`, error);
      },
    });

    timeout = setTimeout(() => {
      stream.abort();
      if (settled) return;
      settled = true;
      reject(new Error(`Prerender timed out for ${pathname}.`));
    }, RENDER_TIMEOUT_MS);
  });
}
