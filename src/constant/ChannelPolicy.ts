enum ChannelPolicy {
  //User can view message in channel
  READ = 0,

  //User can modify channel's name, description, setting, delete channel
  MANAGE_CHANNEL = 1,

  //User can modify role of channel
  MANAGE_ROLE = 2,

  //User can create invite
  CREATE_INVITE = 3,

  //User can send message
  CREATE_MESSAGE = 4,

  //User can modify their message
  MANAGE_MESSAGE = 5,
  VIEW_CHANNEL = 6,
}
export default ChannelPolicy;
