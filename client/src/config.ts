// Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '7mcxhnp4e9'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-or8nt85f.us.auth0.com',            // Auth0 domain
  clientId: 'CySq7VXztSBlLoeOTtgIMclBSlASnOY2',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
