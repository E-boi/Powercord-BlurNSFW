const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule } = require('powercord/webpack')
const { getOwnerInstance, waitFor } = require('powercord/util');
const { resolve } = require('path');

module.exports = class BlurNSFW extends Plugin {
  async startPlugin() {
    this.loadStylesheet(resolve(__dirname, 'style.scss'));
    this.getChannel();
  }

  async pluginWillUnload() {
    uninject('pog-blurnsfw')
  }

  async getChannel() {
    const chatClass = getModule(['chat'], false).channelTextArea;
    await waitFor(`.${chatClass}`)
    const chat = document.querySelector(`.${chatClass}`);
    this.blurImages(chat)
  }

  async blurImages(chat) {
    const Channel = getOwnerInstance(chat);
    inject('pog-blurnsfw', Channel.constructor.prototype, 'render', (_, res) => {

      if (res.props.channel.nsfw) {
        var element = document.getElementsByClassName('scrollerInner-2YIMLh');
        element.item(0).classList.toggle('blur', true);
      }

      return res;
    });
  }
}