declare const APPLICATION_SECRET: string;
declare const APPLICATION_ID: string;
declare const PUBLIC_KEY: string;

import { createSlashCommandHandler } from '@glenstack/cf-workers-discord-bot';

const slashCommandHandler = createSlashCommandHandler({
    applicationID: APPLICATION_ID,
    applicationSecret: APPLICATION_SECRET,
    publicKey: PUBLIC_KEY,
    commands: [],
});

addEventListener('fetch', (event) => {
    event.respondWith(slashCommandHandler(event.request));
});
