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

  async pluginWillUnload() {
    uninject('pog-blurnsfw')
  }

  async getChannel() {
    const chatClass = getModule(['chat'], false).channelTextArea;
    await waitFor(`.${chatClass}`)
    const chat = document.querySelector(`.${chatClass}`);
    this.blurImages(chat);
  }

  async blurImages(chat) {
    const Channel = getOwnerInstance(chat);
    inject('pog-blurnsfw', Channel.constructor.prototype, 'render', (_, res) => {
      const dm = this.settings.get('blurInDm', false);
      const group = this.settings.get('blurInGroup', false);
      if (dm === true && res.props.channel.type === 1) {
        var element = document.getElementsByClassName('scrollerInner-2YIMLh');
        element.item(0).classList.toggle('blur', true);
      }
      if (group === true && res.props.channel.type === 3) {
        var element = document.getElementsByClassName('scrollerInner-2YIMLh');
        element.item(0).classList.toggle('blur', true);
      }
      if (res.props.channel.nsfw && res.props.channel.type === 0) {
        var element = document.getElementsByClassName('scrollerInner-2YIMLh');
        element.item(0).classList.toggle('blur', true);
      }

      return res;
    });
  }
}