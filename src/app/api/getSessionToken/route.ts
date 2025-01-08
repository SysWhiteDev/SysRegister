export const dynamic = "force-dynamic";
//TODO: Fix types
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import puppeteer, { Page } from "puppeteer";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username") || "";
        const password = searchParams.get("password") || "";

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        await page.goto("https://web.spaggiari.eu/home/app/default/login.php", { waitUntil: "domcontentloaded" });

        await page.type('input[name=login]', username, { delay: 10 });
        await page.type('input[name=password]', password, { delay: 10 });
        await page.click('button[type=submit]');

        const token = await getToken(page);
        await browser.close();

        if (!token) {
            return NextResponse.json({ error: "Nome utente o password errati, oppure il tuo account e' in timeout" }, { status: 401 });
        }

        return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
        console.error("Error scraping:", error);
        return NextResponse.json({ error: "il registro non risponde correttamente... riprova tra 1 ora." }, { status: 600 });
    }
}

async function getToken(page: Page): Promise<string | undefined> {
    return new Promise((resolve) => {
        const responseHandler = (response: any) => {
            if (response.url().includes("https://web.spaggiari.eu/auth-p7/app/default/AuthApi4.php?a=aLoginPwd")) {
                const cookieHeader = response.headers()["set-cookie"]?.split('\n')[1];
                if (cookieHeader) {
                    const tokenMatch = cookieHeader.match(/PHPSESSID=([^;]+);/);
                    if (tokenMatch) {
                        const token = tokenMatch[1];
                        page.off("response", responseHandler);
                        resolve(token);
                    }
                }
            }
        };

        page.on("response", responseHandler);
        setTimeout(() => {
            page.off("response", responseHandler);
            resolve(undefined);
        }, 7000);
    });
}
