const { React } = require('powercord/webpack');
const { SwitchItem, SliderInput } = require('powercord/components/settings');

module.exports = class Blur extends React.PureComponent {
  render() {
    const { getSetting, toggleSetting, updateSetting } = this.props
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
      <SliderInput
        stickToMarkers
        minValue={1}
        maxValue={50}
        initialValue={getSetting('blurEffect', 10)}
        markers={[1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
        onValueChange={(change) => updateSetting('blurEffect', change)}
      >Blur Effect</SliderInput>
      <SliderInput
        stickToMarkers
        minValue={0.2}
        maxValue={10}
        initialValue={getSetting('blurTiming', 1)}
        markers={[0.2, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        onValueChange={(change) => updateSetting('blurTiming', change)}
      >Blur Timing (in seconds)</SliderInput>
      <p style={{ color: "#b9bbbe" }}>(you will need to switch channel/dm for any changes to take effect)</p>
    </>
  }
}