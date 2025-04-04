"use server";

import { handleAuthError } from "@/lib/api";
import { getUserDetailsFromToken } from "@/lib/utils";
import { cookies } from "next/headers";

export async function getBacheca() {
    const userData = await getUserDetailsFromToken(cookies().get("internal_token")?.value || "");
    if (!userData) {
        return handleAuthError();
    }
    const formData = new FormData();
    formData.append("action", "get_comunicazioni");
    const res = await fetch(`https://web.spaggiari.eu/sif/app/default/bacheca_personale.php`, {
        method: "POST",
        headers: {
            "Cookie": `PHPSESSID=${cookies().get("token")?.value}; webidentity=${userData.uid};`,
        },
        body: formData
    });
    let data;
    try {
        data = await res.json();
    } catch {
        return handleAuthError();
    }
    return data;
}

export async function setReadBachecaItem(itemId: string) {
    const userData = await getUserDetailsFromToken(cookies().get("internal_token")?.value || "");
    if (!userData) {
        return handleAuthError();
    }
    const formData = new FormData();
    formData.append("action", "read_all");
    formData.append("id_relazioni", `[${itemId}]`);
    await fetch(`https://web.spaggiari.eu/sif/app/default/bacheca_personale.php`, {
        method: "POST",
        headers: {
            "Cookie": `PHPSESSID=${cookies().get("token")?.value}; webidentity=${userData.uid};`,
        },
        body: formData
    });
    return true;
}