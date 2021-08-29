import {
    UserGradeInfo,
    SessionInfo,
    FlightEntry,
    AtcEntry,
    UserStats,
    ApiResponse,
    ErrorCode,
    AirportStatus,
    OceanicTrack,
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
    const req = await fetch(
        `${URLBASE}/flights/${encodeURIComponent(sessionId)}`,
        {
            headers: {
                Authorization: `Bearer ${IF_API_KEY}`,
            },
        }
    );
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
    const req = await fetch(`${URLBASE}/atc/${encodeURIComponent(sessionId)}`, {
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
    const req = await fetch(
        `${URLBASE}/user/grade/${encodeURIComponent(userId)}`,
        {
            headers: {
                Authorization: `Bearer ${IF_API_KEY}`,
            },
        }
    );
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

export async function atis(
    airportIcao: string,
    sessionId: string = '7e5dcd44-1fb5-49cc-bc2c-a9aab1f6a856'
): Promise<string> {
    const req = await fetch(
        `${URLBASE}/atis/${encodeURIComponent(
            airportIcao
        )}/${encodeURIComponent(sessionId)}`,
        {
            headers: {
                Authorization: `Bearer ${IF_API_KEY}`,
            },
        }
    );
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

export async function airportStatus(
    icao: string,
    sessionId: string = '7e5dcd44-1fb5-49cc-bc2c-a9aab1f6a856'
): Promise<AirportStatus> {
    const req = await fetch(
        `${URLBASE}/airport/${encodeURIComponent(
            icao
        )}/status/${encodeURIComponent(sessionId)}`,
        {
            headers: {
                Authorization: `Bearer ${IF_API_KEY}`,
            },
        }
    );
    const response: ApiResponse<AirportStatus> = await req.json();
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

export async function oceanicTracks(): Promise<OceanicTrack[]> {
    const req = await fetch(`${URLBASE}/tracks`, {
        headers: {
            Authorization: `Bearer ${IF_API_KEY}`,
        },
    });
    const response: ApiResponse<OceanicTrack[]> = await req.json();
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
