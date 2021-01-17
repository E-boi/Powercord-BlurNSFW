const { React } = require('powercord/webpack');
const { SwitchItem } = require('powercord/components/settings');

module.exports = class Blur extends React.PureComponent {
  render() {
    const { getSetting, toggleSetting } = this.props;
    return <>
      <SwitchItem
        note="Blur images in dms"
        value={getSetting('blurInDm', false)}
        onChange={() => toggleSetting('blurInDm')}
      >DM</SwitchItem>
      <SwitchItem
        note="Blur images in group chats"
        value={getSetting('blurInGroup', false)}
        onChange={() => toggleSetting('blurInGroup')}
      >Group Chat</SwitchItem>
    </>;
  }
}