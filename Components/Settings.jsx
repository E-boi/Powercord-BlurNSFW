const { React } = require('powercord/webpack');
const { Button } = require('powercord/components');
const { SwitchItem, SliderInput, Category } = require('powercord/components/settings');
const TextInputWithButton = require('./TextInputWithButton');
let blockedChannels = Array(),
	blurChannels = Array();

module.exports = class Blur extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { category0Opened: false, category1Opened: false };
	}
	handleBlockChannel() {
		return blockedChannels.concat('Enter a channel/user id');
	}
	handleBlockChannelChange = (idx, newvalue) => {
		const channels = blockedChannels.map((channel, sidx) => {
			if (idx !== sidx) return channel;
			return { ...channel, id: newvalue };
		});
		return channels;
	};
	handleRemoveBlockChannel = idx => {
		if (blockedChannels.length > 1) {
			const channels = blockedChannels.filter((obj, sidx) => sidx !== idx);
			return channels;
		}
	};
	handleBlurAddChannel() {
		return blurChannels.concat('Enter a channel/user id');
	}
	handleBlurChannelChange = (idx, newvalue) => {
		const channels = blurChannels.map((channel, sidx) => {
			if (idx !== sidx) return channel;
			return { ...channel, id: newvalue };
		});
		return channels;
	};
	handleRemoveBlurChannel = idx => {
		if (blurChannels.length > 1) {
			const channels = blurChannels.filter((obj, sidx) => sidx !== idx);
			return channels;
		}
	};
	render() {
		const { getSetting, toggleSetting, updateSetting } = this.props;
		(blockedChannels = getSetting('Blocked')), (blurChannels = getSetting('Blur'));
		if (blockedChannels === undefined || blockedChannels === null) blockedChannels = [{ id: 'Enter a channel/user id' }];
		if (blurChannels === undefined || blurChannels === null) blurChannels = [{ id: 'Enter a channel/user id' }];
		return (
			<>
				<SwitchItem note="Blur images in dms" value={getSetting('blurInDm', false)} onChange={() => toggleSetting('blurInDm')}>
					DM
				</SwitchItem>
				<SwitchItem note="Blur images in group chats" value={getSetting('blurInGroup', false)} onChange={() => toggleSetting('blurInGroup')}>
					Group Chat
				</SwitchItem>
				<SliderInput
					stickToMarkers
					minValue={1}
					maxValue={50}
					initialValue={getSetting('blurEffect', 10)}
					markers={[1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
					onValueChange={change => updateSetting('blurEffect', change)}
				>
					Blur Effect
				</SliderInput>
				<SliderInput
					stickToMarkers
					minValue={0.2}
					maxValue={10}
					initialValue={getSetting('blurTiming', 1)}
					markers={[0.2, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
					onValueChange={change => updateSetting('blurTiming', change)}
				>
					Blur Timing (in seconds)
				</SliderInput>
				<Category
					name="Block Channels"
					description="Block channels from getting effected."
					opened={this.state.category0Opened}
					onChange={() => this.setState({ category0Opened: !this.state.category0Opened })}
				>
					{blockedChannels.map((channel, idx) => (
						<div>
							<TextInputWithButton
								type="text"
								placeholder={'Enter a channel/user id'}
								defaultValue={channel.id}
								onChange={val => {
									updateSetting('Blocked', this.handleBlockChannelChange(idx, val));
								}}
								buttonOnClick={() => {
									updateSetting('Blocked', this.handleRemoveBlockChannel(idx));
								}}
								buttonText="Remove"
								buttonIcon="fal fa-minus"
							/>
						</div>
					))}
					<Button
						onClick={() => {
							updateSetting('Blocked', this.handleBlockChannel());
						}}
					>
						Add channel
					</Button>
				</Category>
				<Category
					name="Blur Channels"
					description="Blur channels that aren`t affected."
					opened={this.state.category1Opened}
					onChange={() => this.setState({ category1Opened: !this.state.category1Opened })}
				>
					{blurChannels.map((channel, idx) => (
						<div>
							<TextInputWithButton
								type="text"
								placeholder={'Enter a channel/user id'}
								defaultValue={channel.id}
								onChange={val => {
									updateSetting('Blur', this.handleBlurChannelChange(idx, val));
								}}
								buttonOnClick={() => {
									updateSetting('Blur', this.handleRemoveBlurChannel(idx));
								}}
								buttonText="Remove"
								buttonIcon="fal fa-minus"
							/>
						</div>
					))}
					<Button
						onClick={() => {
							updateSetting('Blur', this.handleBlurAddChannel());
						}}
					>
						Add channel
					</Button>
				</Category>
				<p style={{ color: '#b9bbbe' }}>(you will need to switch channel/dm for any changes to take effect)</p>
			</>
		);
	}
};
