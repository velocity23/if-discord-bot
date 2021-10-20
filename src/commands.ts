import {
    ApplicationCommand,
    ApplicationCommandOptionType,
} from '@glenstack/cf-workers-discord-bot';

export const atcCommand: ApplicationCommand = {
    name: 'atc',
    description: 'Get the ATC for a server',
    options: [
        {
            name: 'server',
            description: 'The server to get the ATC for',
            required: true,
            type: ApplicationCommandOptionType.STRING,
            choices: [
                {
                    name: 'Training Server',
                    value: '6a04ffe8-765a-4925-af26-d88029eeadba',
                },
                {
                    name: 'Expert Server',
                    value: '7e5dcd44-1fb5-49cc-bc2c-a9aab1f6a856',
                },
            ],
        },
    ],
};

export const userCommand: ApplicationCommand = {
    name: 'if-user',
    description: 'Get for a user basedon their IFC Username',
    options: [
        {
            name: 'user',
            description: 'The user to get stats for',
            required: true,
            type: ApplicationCommandOptionType.STRING,
        },
    ],
};

export const atisCommand: ApplicationCommand = {
    name: 'atis',
    description: 'Get the ATIS for an airport',
    options: [
        {
            name: 'icao',
            description: 'The airport ICAO to get ATIS for',
            required: true,
            type: ApplicationCommandOptionType.STRING,
        },
    ],
};

export const airportCommand: ApplicationCommand = {
    name: 'airport',
    description: 'Get ATIS and traffic information for an airport',
    options: [
        {
            name: 'icao',
            description: 'The airport ICAO to get information for',
            required: true,
            type: ApplicationCommandOptionType.STRING,
        },
    ],
};

export const statsCommand: ApplicationCommand = {
    name: 'if-stats',
    description: 'Get current server stats',
};

export const tracksCommand: ApplicationCommand = {
    name: 'oceanic-tracks',
    description: 'Get the current Oceanic Tracks',
};
