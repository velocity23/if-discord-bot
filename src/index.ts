import * as dotenv from 'dotenv';
dotenv.config();
import * as iflive from './iflive';
import * as discord from 'discord.js';
import { AtcEntry, FrequencyType } from './types';
const client = new discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
    client.user?.setActivity('&help', { type: 'WATCHING' });
});

client.on('message', async msg => {
    const content = msg.content.toLowerCase().replace(/ ?\& ?/, '&');
    
    if (content.startsWith('&atc')) {
        let serverName = content.split(' ', 2)[1]?.toLowerCase().replace('server', '').trim();
        console.log(serverName);
        if (!serverName) {
            msg.reply('please include a server');
            return;
        }
        let serverInfo = (await iflive.sessions()).filter(s => s.name.toLowerCase().includes(serverName))[0];
        if (typeof serverInfo === 'undefined') {
            await msg.reply('that doesn\'t look like a valid server');
            return;
        }

        let response: { [key: string]: AtcEntry[] } = {};
        const stations = await iflive.atc(serverInfo.id);
        for (let s of stations) {
            if (s.airportName == null) {
                let actualApt = stations.filter(sf => sf.latitude == s.latitude && sf.longitude == s.longitude)[0];
                if (typeof actualApt == 'undefined') continue;

                s.airportName = actualApt.airportName;
            }
            if (!response[s.airportName]) {
                response[s.airportName] = [];
            }
            response[s.airportName].push(s);
        }

        const embed = new discord.MessageEmbed();
        embed.setTitle(`ATC Stations for ${serverInfo.name}`);
        for (const [icao, stations] of Object.entries(response)) {
            embed.addField(icao, stations.map(s => FrequencyType[s.type]).join(', '));
        }

        await msg.channel.send(embed);
        return;
    }

    if (content.startsWith('&user')) {
        let userName = content.split(' ', 2)[1]?.toLowerCase().trim();
        if (!userName) {
            msg.reply('please include a username');
            return;
        }

        const stats = (await iflive.userStats([], [], [ userName ]))[0];
        if (typeof stats === 'undefined') {
            msg.reply('stats not found, maybe the user is flying anonymously?');
            return;
        }

        const embed = new discord.MessageEmbed();
        embed.setTitle(`Stats for ${stats.discourseUsername}`);
        
        let description = '';
        description += `Online Flights: ${stats.onlineFlights}\n`;
        description += `Violations: ${stats.violations}\n`;
        description += `XP: ${stats.xp}\n`;
        description += `Landings: ${stats.landingCount}\n`;
        let ftHrs = Math.floor(stats.flightTime / 60);
        let ftMins = stats.flightTime - ftHrs * 60;
        description += `Flight Time: ${ftHrs}:${ftMins < 10 ? `0${ftMins}` : ftMins}\n`;
        description += `Grade: Grade ${stats.grade}\n`;
        description += `VO: ${stats.virtualOrganization}\n`;
        embed.setDescription(description);
        
        await msg.channel.send(embed);
        return;
    }

    if (content.startsWith('&atis')) {
        let airportIcao = content.split(' ', 2)[1]?.toUpperCase().trim().replace(/(?!([a-z]|-|[0-9]))./ig, '');
        if (!airportIcao) {
            msg.reply('please include an airport ICAO');
            return;
        }
        const atis = await iflive.getAtis(airportIcao);
        if (atis == '') {
            msg.channel.send(new discord.MessageEmbed().setTitle(`ATIS for ${airportIcao}`).setDescription('No ATIS Found'));
            return;
        }

        msg.channel.send(new discord.MessageEmbed().setTitle(`ATIS for ${airportIcao}`).setDescription(atis));
        return;
    }

    if (content.startsWith('&airport')) {
        let airportIcao = content.split(' ', 2)[1]?.toUpperCase().trim().replace(/(?!([a-z]|-|[0-9]))./ig, '');
        if (!airportIcao) {
            msg.reply('please include an airport ICAO');
            return;
        }

        const flightPlans = await iflive.flightPlans('7e5dcd44-1fb5-49cc-bc2c-a9aab1f6a856');
        const deps = flightPlans.filter(p => p.waypoints[0] == airportIcao);
        const arrs = flightPlans.filter(p => p.waypoints[p.waypoints.length - 1] == airportIcao);
        const atis = await iflive.getAtis(airportIcao);
        const atc = (await iflive.atc('7e5dcd44-1fb5-49cc-bc2c-a9aab1f6a856')).filter(a => a.airportName == airportIcao);

        const embed = new discord.MessageEmbed();
        embed.setTitle(`Airport: ${airportIcao}`);
        embed.setFooter('Currently only the Expert Server is supported');
        embed.addField('Departures', deps.length);
        embed.addField('Arrivals', arrs.length);
        embed.addField('ATC', atc.length > 0 ? atc.map(a => FrequencyType[a.type]).join(', ') : 'No ATC');
        embed.addField('ATIS', atis != '' ? atis : 'N/A');
        await msg.channel.send(embed);
        return;
    }

    if (content.startsWith('&stats')) {
        const sessions = await iflive.sessions();
        const embed = new discord.MessageEmbed();
        embed.setTitle('Server Stats');
        for (const s of sessions) {
            let data = `Users: ${s.userCount}\nLoad: ${Math.round(s.maxUsers / s.userCount)}%\n`;
            embed.addField(s.name, data);
        }

        await msg.channel.send(embed);
        return;
    }

    if (content.startsWith('&feedback')) {
        const message = content.split(' ', 2)[1].trim();
        const embed = new discord.MessageEmbed()
            .setAuthor(msg.author.tag)
            .setTitle('Feedback')
            .setDescription(`${message}\n\n**Server:** ${msg.guild?.name}`);
        let avatar = msg.member?.user.avatarURL();
        if (avatar) {
            embed.setThumbnail(avatar!);
        }
        await ((await client.channels.fetch("763599053354172456")) as discord.TextChannel).send(embed);

        await msg.reply('Your Feedback was Sent');
        return;
    }

    if (content.startsWith('&help')) {
        const embed = new discord.MessageEmbed();
        embed.setTitle('Infinite Flight Bot - Help');
        embed.addField('&atc \`server\`', 'Get Open ATC Stations for a Server, eg. \`&atc expert\`');
        embed.addField('&user \`ifc\`', 'Get stats for a user based on their IFC, if possible. Eg. \`&user Laura\`');
        embed.addField('&atis \`icao\`', 'Get the ATIS for an airport if available, eg. \`&atis YMML\`');
        embed.addField('&airport \`icao\`', 'Get ATIS and Traffic information for an airport, eg. \`&airport YMAY\`');
        embed.addField('&stats', 'Get current server stats');
        embed.addField('&stats \`message\`', 'Send feedback on this bot');
        await msg.channel.send(embed);
        return;
    }
});

client.login(process.env.BOT_TOKEN);