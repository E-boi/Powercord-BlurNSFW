const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getOwnerInstance, waitFor } = require('powercord/util');
const { resolve } = require('path');

module.exports = class BlurNSFW extends Plugin {
  async startPlugin() {
    this.loadStylesheet(resolve(__dirname, 'style.scss'));
    await waitFor('.channelTextArea-rNsIhG');
    const check = () => {
      if (!this.instance.props.channel.nsfw) return;
      else {
        var element = document.getElementsByClassName('scrollerInner-2YIMLh');
        element.item(0).classList.toggle('blur', true);
      };
    }
    const updateInstance = () => this.instance = getOwnerInstance(document.querySelector('.channelTextArea-rNsIhG'));
    updateInstance();
    check();
    inject('pog-blurnsfw', Object.getPrototypeOf(this.instance), 'addNSFWblur', () => {
      updateInstance();
      check();
    });
  }
  pluginWillUnload() {
    uninject('pog-blurnsfw');
  }
};
