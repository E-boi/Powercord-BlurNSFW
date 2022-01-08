const { Plugin } = require('powercord/entities');
const { getModule, FluxDispatcher } = require('powercord/webpack');
const settings = require('./Components/Settings');

const { getChannel } = getModule(['getChannel', 'getDMFromUserId'], false)

function handleChannel({ channelId }) {
	const channel = getChannel(channelId);
	const blockedChannels = this.settings.get('Blocked')?.filter(obj => obj.id === channel.id || obj.id === channel.recipients[0]);
	const blurChannels = this.settings.get('Blur')?.filter(obj => obj.id === channel.id || obj.id === channel.recipients[0]);
	if (blockedChannels?.[0]?.id?.includes(channelId) || blockedChannels?.[0]?.id?.includes(channel.recipients[0])) return;
	else if (
		channel.nsfw ||
		(this.settings.get('blurInDm') && channel.type === 1) ||
		(this.settings.get('blurInGroup') && channel.type === 3) ||
		blurChannels?.[0]?.id?.includes(channel.id) ||
    blurChannels?.[0]?.id?.includes(channel.recipients[0])
	)
		blurChannel();
	else document.body.classList.remove('blur');
}

function blurChannel() {
	console.log('nsfw channel!')
	const blur = this.settings.get('blurEffect', 10);
	const timing = this.settings.get('blurTiming', 1);
	document.body.style.setProperty('--blur-effect', `blur(${blur}px)`);
	document.body.style.setProperty('--blur-timing', `${timing}s`);
	document.body.classList.add('blur');
}

module.exports = class BlurNSFW extends Plugin {
	startPlugin() {
		this.loadStylesheet('style.css');
		powercord.api.settings.registerSettings(this.entityID, {
			category: this.entityID,
			label: 'Blur NSFW',
			render: settings,
		});
		handleChannel = handleChannel.bind(this);
		blurChannel = blurChannel.bind(this);
		FluxDispatcher.subscribe('CHANNEL_SELECT', handleChannel);
	}

	pluginWillUnload() {
		powercord.api.settings.unregisterSettings(this.entityID);
		FluxDispatcher.unsubscribe('CHANNEL_SELECT', handleChannel);
	}
};
