Package.describe({
  summary: "Login service for UOW accounts"
});

Package.on_use(function (api, where) {
  api.use('accounts-base', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);

  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('underscore', 'client');
  api.use('templating', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.add_files('uow.html', 'client');
  api.add_files('uow.css', 'client');
  api.add_files('uow_server.js', 'server');
  api.add_files('uow_client.js', 'client');
});
