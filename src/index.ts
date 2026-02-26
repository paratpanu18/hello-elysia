import { Elysia, status } from "elysia";

export function mult10(x: number) {
  if (typeof x !== 'number') {
    throw status(400, "Input must be a number");
  }
  return x * 10;
}

const CODE = "Hello, CE";
export function getcode() {
  return CODE;
}

const app = new Elysia()
                .get("/", () => "Hello Elysia")
                .get("/mul10/:num", ({ params }) => mult10(Number(params.num)))
                .get("/getcode", () => getcode())
                .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
