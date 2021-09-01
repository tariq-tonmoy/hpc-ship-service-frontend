# ShipClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Build and Serve

Run `ng build --configuration=production` and `ng serve --configuration=production`  will connect with ship service deployed in the Docker. The default `build` environment is `production` and default `serve` environment is `development`  

## Known Issues

1. After logging in, the app redirects to ship-details page. but no data is loaded. This can be mitigated by reloading the page. The issue is left unresolved due to time constraints 
2. Initally there are two ships present. They are desynced from state model of the backend system. operating on them will not affect the view model. It would be better to create ships from scratch and test on them.
