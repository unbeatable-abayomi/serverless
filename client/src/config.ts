// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '3li3m9pvrd'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/prod`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
 
  domain: 'dev-3eel7buh.us.auth0.com',            // Auth0 domain
  clientId: '3IKbWHI1yyJSnefwVbaXXnus1y2nhUdu',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
