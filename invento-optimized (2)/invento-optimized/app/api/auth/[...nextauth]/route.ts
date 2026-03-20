// app/api/auth/[...nextauth]/route.ts
// DO NOT rename or restructure this file — Auth.js requires this exact path.
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
