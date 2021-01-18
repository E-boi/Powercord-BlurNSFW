const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule, React } = require('powercord/webpack')
const { getOwnerInstance, waitFor } = require('powercord/util');
const { resolve } = require('path');
const settings = require('./Components/Settings')

module.exports = class BlurNSFW extends Plugin {
  async startPlugin() {
    this.loadStylesheet(resolve(__dirname, 'style.scss'));
    powercord.api.settings.registerSettings(this.entityID, {
      category: this.entityID,
      label: 'Blur NSFW',
      render: (props) => React.createElement(settings, {
        main: this,
        ...props
      })
    });
    this.getChannel();
  }

  pluginWillUnload() {
    powercord.api.settings.unregisterSettings(this.entityID);
    uninject('pog-blurnsfw')
  }

  async getChannel() {
    const chatClass = getModule(['chat'], false).channelTextArea;
    await waitFor(`.${chatClass}`)
    const chat = document.querySelector(`.${chatClass}`);
    this.blurImages(chat);
  }

  blurChannel() {
    const blur = this.settings.get('blurEffect', 10);
    const timing = this.settings.get('blurTiming', 1);
    var element = document.getElementsByClassName('scrollerInner-2YIMLh');
    element.item(0).style.setProperty('--blur-effect', `blur(${blur}px)`);
    element.item(0).style.setProperty('--blur-timing', `${timing}s`)
    element.item(0).classList.toggle('blur', true);
  }

  async blurImages(chat) {
    const Channel = getOwnerInstance(chat);
    inject('pog-blurnsfw', Channel.constructor.prototype, 'render', (_, res) => {
      const dm = this.settings.get('blurInDm', false);
      const group = this.settings.get('blurInGroup', false);
      const Blockedchannels = this.settings.get('Blocked'), blurChannels = this.settings.get('Blur')
      const channel = Blockedchannels !== undefined ? Blockedchannels.filter((obj, idx) => obj.id === res.props.channel.id || obj.id === res.props.channel.recipients[0]) : ''
      const Channel = blurChannels !== undefined ? blurChannels.filter((obj, idx) => obj.id === res.props.channel.id || obj.id === res.props.channel.recipients[0]) : ''
      if (channel.length !== 0) return res;
      else if (Channel.length !== 0) this.blurChannel()
      else if (dm && res.props.channel.type === 1 || group && res.props.channel.type === 3) this.blurChannel()
      else if (res.props.channel.nsfw && res.props.channel.type === 0) this.blurChannel()

      return res;
    });
  }
}