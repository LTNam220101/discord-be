enum ChannelPolicy {
  //User can view message in channel
  READ = 7,

  //User can modify channel's name, description, setting, delete channel
  MANAGE_CHANNEL = 8,

  //User can modify role of channel
  MANAGE_ROLE = 9,

  //User can create invite
  CREATE_INVITE = 10,

  //User can send message
  CREATE_MESSAGE = 11,

  //User can modify their message
  MANAGE_MESSAGE = 12,
  VIEW_CHANNEL = 13,
}
export default ChannelPolicy;
