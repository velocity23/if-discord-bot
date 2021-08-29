import {
    Interaction,
    InteractionResponse,
    InteractionResponseType,
} from '@glenstack/cf-workers-discord-bot';
import * as iflive from './lib/iflive';
import { AirportStatus, UserStats } from './lib/iflive/types';

const servers: { [key: string]: string } = {
    '6a04ffe8-765a-4925-af26-d88029eeadba': 'Training Server',
    '7e5dcd44-1fb5-49cc-bc2c-a9aab1f6a856': 'Expert Server',
};
const atcTypeNames = [
    'Ground',
    'Tower',
    'Unicom',
    'Clearance',
    'Approach',
    'Departure',
    'Center',
    'ATIS',
    'Aircraft',
    'Recorded',
    'Unknown',
    'Unused',
];

export async function atcHandler(
    interaction: Interaction
): Promise<InteractionResponse> {
    const server = interaction.data!.options![0].value! as string;
    const atc = await iflive.atc(server);

    let airports: { [key: string]: string[] } = {};
    for (const station of atc) {
        if (!airports[station.airportName]) {
            airports[station.airportName] = [];
        }

        airports[station.airportName].push(atcTypeNames[station.type]);
    }

    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: '',
            embeds: [
                {
                    title: `ATC Stations for ${servers[server]}`,
                    timestamp: new Date().toISOString(),
                    fields: Object.entries(airports).map(
                        ([airport, stations]) => ({
                            name: airport,
                            value: stations.join(', '),
                        })
                    ),
                },
            ],
        },
    };
}

export async function userHandler(
    interaction: Interaction
): Promise<InteractionResponse> {
    const user = interaction.data!.options![0].value as string;
    let userInfo: UserStats[];
    try {
        userInfo = await iflive.userStats([], [], [user]);
        if (userInfo.length == 0) {
            throw new Error('User not found');
        }
    } catch {
        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `Could not find user ${user}. Maybe they are flying anonymously?`,
            },
        };
    }

    const userStats = userInfo[0];
    const flightTime = `${Math.floor(userStats.flightTime / 60)}:${
        userStats.flightTime % 60
    }`;
    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: '',
            embeds: [
                {
                    title: `Stats for ${userStats.discourseUsername}`,
                    description: `Online Flights: ${userStats.onlineFlights}\nViolations: ${userStats.violations}\nXP: ${userStats.xp}\nLandings: ${userStats.landingCount}\nFlight Time: ${flightTime}\nGrade: Grade ${userStats.grade}\nVO: ${userStats.virtualOrganization}`,
                    timestamp: new Date().toISOString(),
                },
            ],
        },
    };
}

export async function atisHandler(
    interaction: Interaction
): Promise<InteractionResponse> {
    const icao = interaction.data!.options![0].value! as string;

    let atis: string;
    try {
        atis = await iflive.atis(icao);
        if (!atis) {
            throw new Error('No ATIS');
        }
    } catch {
        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `Could not find ATIS for ${icao}.`,
            },
        };
    }

    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: '',
            embeds: [
                {
                    title: `ATIS for ${icao.toUpperCase()}`,
                    description: atis,
                    timestamp: new Date().toISOString(),
                },
            ],
        },
    };
}

export async function airportHandler(
    interaction: Interaction
): Promise<InteractionResponse> {
    const icao = interaction.data!.options![0].value! as string;

    let atis: string;
    let status: AirportStatus;
    try {
        atis = await iflive.atis(icao);
        status = await iflive.airportStatus(icao);
        if (!atis || !status) {
            throw new Error();
        }
    } catch {
        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `Could not find ATIS or status for ${icao}.`,
            },
        };
    }

    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: '',
            embeds: [
                {
                    title: `Airport: ${icao.toUpperCase()}`,
                    footer: {
                        text: 'Currently only the Expert Server is supported',
                    },
                    timestamp: new Date().toISOString(),
                    fields: [
                        {
                            name: 'Departures',
                            value: status.outboundFlightsCount.toString(),
                        },
                        {
                            name: 'Arrivals',
                            value: status.inboundFlightsCount.toString(),
                        },
                        {
                            name: 'ATC',
                            value: status.atcFacilities
                                .map((f) => atcTypeNames[f.type])
                                .join(', '),
                        },
                        {
                            name: 'ATIS',
                            value: atis,
                        },
                    ],
                },
            ],
        },
    };
}

export async function statsHandler(): Promise<InteractionResponse> {
    const sessions = await iflive.sessions();
    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: '',
            embeds: [
                {
                    title: 'Server Stats',
                    fields: sessions.map((s) => ({
                        name: s.name,
                        value: `Users: ${s.userCount}\nLoad: ${Math.round(
                            (s.userCount / s.maxUsers) * 100
                        )}`,
                    })),
                },
            ],
        },
    };
}

export async function tracksHandler(): Promise<InteractionResponse> {
    const tracks = await iflive.oceanicTracks();
    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: '',
            embeds: [
                {
                    title: 'Current Oceanic Tracks',
                    fields: tracks
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((t) => ({
                            name: `Track ${t.name}`,
                            value:
                                t.eastLevels == null
                                    ? 'East to West'
                                    : 'West to East',
                        })),
                    timestamp: tracks[0]
                        ? new Date(tracks[0].lastSeen).toISOString()
                        : undefined,
                },
            ],
        },
    };
}
