button = document.getElementById("OAuth_Button")

redirect_uri = "https://localhost:8080/oauth"
client_id = "604421121209-40j3h23i02eulnvn12lgakd2jtdb0t9p.apps.googleusercontent.com"
scope = "https://www.googleapis.com/auth/drive"
access_type = "offline"
response_type = "token"

/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function oauthSignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {'client_id': client_id,
        'redirect_uri': redirect_uri,
        'response_type': response_type,
        'scope': scope,
        'include_granted_scopes': 'true',
        'state': 'pass-through value'};

    // Add form parameters as hidden input values.
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}

function handleOAuthCallback() {
    // if no parameters, check if we are already authenticated
    if(window.location.hash.length === 0) {
        if(isAuthenticated) {
            console.log("Already authenticated");
            return;
        }else{
            console.log("Not authenticated, signing in");
            oauthSignIn();
        }
    }else{
        // if there are parameters, parse the access token
        const urlParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = urlParams.get('access_token');

        if(accessToken) {
            console.log("Access token: ", accessToken);
            isAuthenticated = true;
        } else {
            console.log("No access token found");
            isAuthenticated = false;
        }
    }
}

window.onload = handleOAuthCallback;