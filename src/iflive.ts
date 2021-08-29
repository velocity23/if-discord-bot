import {
    UserGradeInfo,
    SessionInfo,
    FlightEntry,
    AtcEntry,
    UserStats,
    ApiResponse,
    ErrorCode,
} from './types';

declare const IF_API_KEY: string;
const URLBASE = 'https://api.infiniteflight.com/public/v2';

export async function sessions(): Promise<SessionInfo[]> {
    const req = await fetch(`${URLBASE}/sessions`, {
        headers: {
            Authorization: `Bearer ${IF_API_KEY}`,
        },
    });
    const response: ApiResponse<SessionInfo[]> = await req.json();
    if (response.errorCode != 0) {
        await Promise.reject(
            new Error(
                'Invalid API Response Code. Expected 0, received ' +
                    response.errorCode
            )
        );
    }

    return response.result;
}

export async function flights(sessionId: string): Promise<FlightEntry[]> {
    const req = await fetch(`${URLBASE}/flights/${sessionId}`, {
        headers: {
            Authorization: `Bearer ${IF_API_KEY}`,
        },
    });
    const response: ApiResponse<FlightEntry[]> = await req.json();
    if (response.errorCode != 0) {
        await Promise.reject(
            new Error(
                'Invalid API Response Code. Expected 0, received ' +
                    response.errorCode
            )
        );
    }

    return response.result;
}

export async function atc(sessionId: string): Promise<AtcEntry[]> {
    const req = await fetch(`${URLBASE}/atc/${sessionId}`, {
        headers: {
            Authorization: `Bearer ${IF_API_KEY}`,
        },
    });
    const response: ApiResponse<AtcEntry[]> = await req.json();
    if (response.errorCode != 0) {
        await Promise.reject(
            new Error(
                'Invalid API Response Code. Expected 0, received ' +
                    response.errorCode
            )
        );
    }

    return response.result;
}

export async function gradeTable(userId: string): Promise<UserGradeInfo> {
    const req = await fetch(`${URLBASE}/user/grade/${userId}`, {
        headers: {
            Authorization: `Bearer ${IF_API_KEY}`,
        },
    });
    const response: ApiResponse<UserGradeInfo> = await req.json();
    if (response.errorCode != 0) {
        await Promise.reject(
            new Error(
                'Invalid API Response Code. Expected 0, received ' +
                    response.errorCode
            )
        );
    }

    return response.result;
}

export async function userStats(
    userIds: string[] = [],
    userHashes: string[] = [],
    discourseNames: string[] = []
): Promise<UserStats[]> {
    let rbody: { [key: string]: string[] } = {};
    if (userIds.length > 0) {
        rbody.userIds = userIds;
    }
    if (userHashes.length > 0) {
        rbody.userHashes = userHashes;
    }
    if (discourseNames.length > 0) {
        rbody.discourseNames = discourseNames;
    }

    const req = await fetch(`${URLBASE}/user/stats`, {
        headers: {
            Authorization: `Bearer ${IF_API_KEY}`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(rbody),
    });
    const response: ApiResponse<UserStats[]> = await req.json();
    if (response.errorCode != ErrorCode.Ok) {
        await Promise.reject(
            new Error(
                'Invalid API Response Code. Expected 0, received ' +
                    response.errorCode
            )
        );
    }

    return response.result;
}

export async function getAtis(
    airportIcao: string,
    sessionId: string = '7e5dcd44-1fb5-49cc-bc2c-a9aab1f6a856'
): Promise<string> {
    const req = await fetch(`${URLBASE}/atis/${airportIcao}/${sessionId}`, {
        headers: {
            Authorization: `Bearer ${IF_API_KEY}`,
        },
    });
    const response: ApiResponse<string> = await req.json();
    if (response.errorCode != ErrorCode.Ok) {
        await Promise.reject(
            new Error(
                'Invalid API Response Code. Expected 0, received ' +
                    response.errorCode
            )
        );
    }

    return response.result;
}
