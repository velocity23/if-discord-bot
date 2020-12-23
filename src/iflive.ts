// Libs
import axios from 'axios';
import * as dotenv from 'dotenv';
import { UserGradeInfo, SessionInfo, FlightPlanEntry, FlightEntry, AtcEntry, UserStats, ApiResponse, ErrorCode } from './types';
dotenv.config();

// Basic Variables
const APIKEY = process.env.IF_LIVE_KEY;
const URLBASE = "https://api.infiniteflight.com/public/v2";

export async function sessions(): Promise<SessionInfo[]> {
    const result = await axios.get<ApiResponse<SessionInfo[]>>(`${URLBASE}/sessions?apikey=${APIKEY}`);
    const response = result.data;
    if (response.errorCode != 0) {
        await Promise.reject(new Error("Invalid API Response Code. Expected 0, received " + response.errorCode));
    }

    return response.result;
}

export async function flights(sessionId: string): Promise<FlightEntry[]> {
    const result = await axios.get<ApiResponse<FlightEntry[]>>(`${URLBASE}/flights/${sessionId}?apikey=${APIKEY}`)
    const response = result.data;
    if (response.errorCode != 0) {
        await Promise.reject(new Error("Invalid API Response Code. Expected 0, received " + response.errorCode));
    }

    return response.result;
}

export async function flightPlans(sessionId: string): Promise<FlightPlanEntry[]> {
    const result = await axios.get<ApiResponse<FlightPlanEntry[]>>(`${URLBASE}/flightplans/${sessionId}?apikey=${APIKEY}`);
    const response = result.data;
    if (response.errorCode != 0) {
        await Promise.reject(new Error("Invalid API Response Code. Expected 0, received " + response.errorCode));
    }

    return response.result;
}

export async function atc(sessionId: string): Promise<AtcEntry[]> {
    const result = await axios.get<ApiResponse<AtcEntry[]>>(`${URLBASE}/atc/${sessionId}?apikey=${APIKEY}`);
    const response = result.data;
    if (response.errorCode != 0) {
        await Promise.reject(new Error("Invalid API Response Code. Expected 0, received " + response.errorCode));
    }

    return response.result;
}

export async function gradeTable(userId: string): Promise<UserGradeInfo> {
    const result = await axios.get<ApiResponse<UserGradeInfo>>(`${URLBASE}/user/grade/${userId}?apikey=${APIKEY}`);
    const response = result.data;
    if (response.errorCode != 0) {
        await Promise.reject(new Error("Invalid API Response Code. Expected 0, received " + response.errorCode));
    }

    return response.result;
}

export async function userStats(userIds: string[] = [], userHashes: string[] = [], discourseNames: string[] = []): Promise<UserStats[]> {
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
    const result = await axios.post<ApiResponse<UserStats[]>>(`${URLBASE}/user/stats?apikey=${APIKEY}`, rbody);
    const response = result.data;
    if (response.errorCode != ErrorCode.Ok) {
        await Promise.reject(new Error("Invalid API Response Code. Expected 0, received " + response.errorCode));
    }

    return response.result;
}

export async function getAtis(airportIcao: string, sessionId: string = '7e5dcd44-1fb5-49cc-bc2c-a9aab1f6a856'): Promise<string> {
    const result = await axios.get<ApiResponse<string>>(`${URLBASE}/airport/atis?airportIcao=${airportIcao}&sessionId=${sessionId}&apikey=${APIKEY}`);
    if (result.status == 204) {
        return '';
    }

    return result.data.result;
}