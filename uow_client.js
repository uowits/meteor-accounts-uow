Accounts.oauth.registerService('uow');

var requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'uow'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }
  var credentialToken = Random.secret();

  var loginUrl =
        'https://api.uow.edu.au/oauth2/authorize' +
        '?client_id=' + config.clientId +
        '&response_type=code' +
        '&redirect_uri=' + Meteor.absoluteUrl('_oauth/uow?close') +
        '&state=' + credentialToken;

  OAuth.showPopup(
    loginUrl,
    _.bind(credentialRequestCompleteCallback, null, credentialToken),
    {width: 330, height: 250}
  );
};

Meteor.loginWithUow = function(options, callback) {
  // support a callback without options
  if (! callback && typeof options === "function") {
    callback = options;
    options = null;
  }

  var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
  requestCredential(options, credentialRequestCompleteCallback);
};

Template.configureLoginServiceDialogForUow.siteUrl = function () {
  return Meteor.absoluteUrl();
};

Template.configureLoginServiceDialogForUow.fields = function () {
  return [
    {property: 'clientId', label: 'Client ID'},
    {property: 'secret', label: 'Client Secret'}
  ];
};
