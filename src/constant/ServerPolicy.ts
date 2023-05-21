enum ServerPolicy {
  // Only owner can delete server
  OWNER = 0,
  // can modify description, kick user, change typeofserver, change name of server
  MANAGE_SERVER = 1,
  // allow default members see channel(not private channel)
  READ_CHANNEL = 5,
  // allow members CRUD channel
  MANAGE_CHANNEL = 6,
  // create role group, add policy
  MANAGE_ROLE = 2,
  MANAGE_INVITE = 3,
  // user can create channel
  CREATE_CHANNEL = 4,
}

export default ServerPolicy;
