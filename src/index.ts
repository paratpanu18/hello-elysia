import { Elysia, status } from "elysia";

export function mult10(x: number) {
  if (typeof x !== 'number') {
    throw new Error("Input must be a number");
  }
  return x * 10;
}

const CODE = "Hello, CE";
export function getcode() {
  return CODE;
}

const app = new Elysia()
                .get("/", () => "Hello Elysia")
                .get("/mul10/:num", ({ params }) => {
                  try {
                    return mult10(Number(params.num));
                  } catch (error) {
                    return new Response("Input must be a number", { status: 400 });
                  }
                })
                .get("/getcode", () => getcode())
                .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
