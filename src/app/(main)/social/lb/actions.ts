"use server";
import { handleAuthError } from "@/lib/api";
import { db } from "@/lib/db";
import { hasPermission, PERMISSIONS } from "@/lib/perms";
import { getUserDetailsFromToken } from "@/lib/utils";
import { cookies } from "next/headers";

export async function getLeaderboard() {
    const userData = await getUserDetailsFromToken(cookies().get("internal_token")?.value || "");
    if (!userData) {
        return handleAuthError();
    }
    const userId = userData.uid;
    const currentUser = await db.user.findFirst({
        where: {
            internalId: userData.internalId
        }
    });
    if (!currentUser) {
        return handleAuthError();
    }
    if (!hasPermission(currentUser.permissions, PERMISSIONS.VERIFIED)) {
        return;
    }
    const leaderboard = await db.user.findMany({
        select: {
            name: true,
            average: true,
            delays: true,
            absencesHours: true,
            hasAcceptedSocialTerms: true,
            id: true
        }
    }).then(users => users.filter(user => user.average !== null && user.hasAcceptedSocialTerms && user.name !== null));
    return leaderboard.map(user => ({
        isRequestingUser: user.id === userId,
        name: user.name,
        average: user.average,
        delaysNumber: user.delays,
        absenceHours: user.absencesHours
    }));
}