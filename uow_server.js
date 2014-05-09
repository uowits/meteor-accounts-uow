Accounts.oauth.registerService('uow');

Accounts.addAutopublishFields({
  forLoggedInUser: ['services.uow'],
  forOtherUsers: [
    'services.uow.username',
  ]
});

OAuth.registerService('uow', 2, null, function(query) {
  var accessToken = getAccessToken(query);
  var identity = getIdentity(accessToken);

  return {
    serviceData: {
      accessToken: OAuth.sealSecret(accessToken),
      username: identity.username,
      id: identity.username,
      groups: identity.groups,
    },
    options: {profile: {name: identity.username}, }
  };
});

var userAgent = "Meteor";
if (Meteor.release)
  userAgent += "/" + Meteor.release;

var getAccessToken = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'uow'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    response = HTTP.post(
      "https://api.uow.edu.au/oauth2/access_token", {
        headers: {
          Accept: 'application/json',
          "User-Agent": userAgent
        },
        params: {
          code: query.code,
          grant_type: 'authorization_code',
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret),
          redirect_uri: Meteor.absoluteUrl("_oauth/uow?close"),
          state: query.state
        }
      });
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with UOW API. " + err.message),
                   {response: err.response});
  }
  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with UOW API. " + response.data.error);
  } else {
    return response.data.access_token;
  }
};

var getIdentity = function (accessToken) {
  try {
    return HTTP.get(
      "https://api.uow.edu.au/user/", {
        headers: {"User-Agent": userAgent,
          "Authorization": "Bearer "+accessToken},
      }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from UOW API. " + err.message),
                   {response: err.response});
  }
};

