import { Elysia, status } from "elysia";

export function mult10(x: number): number {
  if (typeof x !== 'number' || isNaN(x)) {
    throw Error("Input must be a number");
  }
  return x * 10;
}

const CODE = "Hello, Softdev!";
export function getcode() {
  return CODE;
}

const app = new Elysia()
                .get("/", () => "Hello Elysia")

                .get("/mul10/:num", ({ params }) => {
                  try {
                    return mult10(Number(params.num));
                  } catch (error) {
                    return status(400);
                  }
                })

                .get("/getcode", () => getcode())
                .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
