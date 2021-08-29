import { createSlashCommandHandler } from '@glenstack/cf-workers-discord-bot';
import {
    airportCommand,
    atcCommand,
    atisCommand,
    statsCommand,
    tracksCommand,
    userCommand,
} from './commands';
import {
    airportHandler,
    atcHandler,
    atisHandler,
    statsHandler,
    tracksHandler,
    userHandler,
} from './handlers';
declare const APPLICATION_SECRET: string;
declare const APPLICATION_ID: string;
declare const PUBLIC_KEY: string;

const slashCommandHandler = createSlashCommandHandler({
    applicationID: APPLICATION_ID,
    applicationSecret: APPLICATION_SECRET,
    publicKey: PUBLIC_KEY,
    commands: [
        [atcCommand, atcHandler],
        [userCommand, userHandler],
        [atisCommand, atisHandler],
        [airportCommand, airportHandler],
        [statsCommand, statsHandler],
        [tracksCommand, tracksHandler],
    ],
});

addEventListener('fetch', (event) => {
    event.respondWith(slashCommandHandler(event.request));
});
