import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const err_route = (status: number, error: string, code: string) => NextResponse.json({ status: status, error: error, code: code, timestamp: new Date().toISOString() }, { status })
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))