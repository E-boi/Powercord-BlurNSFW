const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule, React } = require('powercord/webpack');
const settings = require('./Components/Settings');

module.exports = class BlurNSFW extends Plugin {
	startPlugin() {
		this.loadStylesheet('style.css');
		powercord.api.settings.registerSettings(this.entityID, {
			category: this.entityID,
			label: 'Blur NSFW',
			render: settings,
		});
		this.injectBlur();
	}

	pluginWillUnload() {
		powercord.api.settings.unregisterSettings(this.entityID);
		uninject('pog-blurnsfw');
	}

	blurChannel() {
		const blur = this.settings.get('blurEffect', 10);
		const timing = this.settings.get('blurTiming', 1);
		var element = document.querySelector('.scrollerInner-2YIMLh');
		if (element === null) return;
		element.style.setProperty('--blur-effect', `blur(${blur}px)`);
		element.style.setProperty('--blur-timing', `${timing}s`);
		element.classList.add('blur');
	}

	async injectBlur() {
		const channelTextArea = await getModule(m => m.type && m.type.render && m.type.render.displayName === 'ChannelTextAreaContainer', false);
		inject('pog-blurnsfw', channelTextArea.type, 'render', (args, res) => {
			const channel = args[0].channel;
			const blockedChannels =
				this.settings.get('Blocked') !== undefined
					? this.settings.get('Blocked').filter((obj, idx) => obj.id === channel.id || obj.id === channel.recipients[0])
					: '';
			const blurChannels =
				this.settings.get('Blur') !== undefined
					? this.settings.get('Blur').filter((obj, idx) => obj.id === channel.id || obj.id === channel.recipients[0])
					: '';
			if (blockedChannels.length !== 0) return res;
			else if (blurChannels.length !== 0) this.blurChannel();
			else if ((this.settings.get('blurInDm') && channel.type === 1) || (this.settings.get('blurInGroup') && channel.type === 3)) this.blurChannel();
			else if (channel.nsfw && channel.type === 0) this.blurChannel();
			return res;
		});
		channelTextArea.type.render.displayName = 'ChannelTextAreaContainer';
	}
};
