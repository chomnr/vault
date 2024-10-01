import { NextResponse } from "next/server";

export const err_route = (status: number, error: string, code: string) => NextResponse.json({ status: status, error: error, code: code, timestamp: new Date().toISOString() }, { status });