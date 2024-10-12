button = document.getElementById("OAuth_Button")

let oauth2CodeEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
let oauth2TokenEndpoint = 'https://oauth2.googleapis.com/token';
let redirect_uri = "https://localhost:8443/oauth/callback";
let scope = "https://www.googleapis.com/auth/drive";
let access_type = "offline";
let response_type = "code";


let client_id = "your-client-id";
let client_secret = "your-client-secret";

/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function oauthSignIn() {
    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('id', 'oauth2-form-get-code');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2CodeEndpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'response_type': response_type,
        'access_type': access_type,
        'scope': scope,
        'include_granted_scopes': 'true',
        'state': 'pass-through value',
        'prompt': 'consent'
    };

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


function getAccessToken(refresh = false) {
    form = document.createElement('form');
    form.setAttribute('id', 'oauth2-form-get-token');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', oauth2TokenEndpoint);
    form.setAttribute('content-type', 'application/x-www-form-urlencoded');

    var params = {
        'client_id': client_id,
        'client_secret': client_secret,
        'grant_type': refreshToken ? 'refresh_token' : 'authorization_code',
    };

    if (refresh) {
        params['refresh_token'] = refreshToken;
    } else {
        params['redirect_uri'] = redirect_uri;
        params['code'] = code;
    }
    console.log(params);

    fetch(oauth2TokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            accessToken = data.access_token;
            if (!refresh) {
                refreshToken = data.refresh_token;
            }
            hasToken = accessToken != null && refreshToken != null;
            handleOAuthCallback();
        })
        .catch(error => console.error('Error:', error));
}

function refreshAccessToken() {
    getAccessToken(true);
}

function revokeAccess(accessToken) {
    // Google's OAuth 2.0 endpoint for revoking access tokens.
    var revokeTokenEndpoint = 'https://oauth2.googleapis.com/revoke';

    // Create <form> element to use to POST data to the OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', revokeTokenEndpoint);

    // Add access token to the form so it is set as value of 'token' parameter.
    // This corresponds to the sample curl request, where the URL is:
    //      https://oauth2.googleapis.com/revoke?token={token}
    var tokenField = document.createElement('input');
    tokenField.setAttribute('type', 'hidden');
    tokenField.setAttribute('name', 'token');
    tokenField.setAttribute('value', accessToken);
    form.appendChild(tokenField);

    // Add form to page and submit it to actually revoke the token.
    document.body.appendChild(form);
    form.submit();
}

function handleOAuthCallback() {
    let pCode = document.getElementById("oauth-code-text");
    let pAccessToken = document.getElementById("oauth-access-token-text");
    let pRefreshToken = document.getElementById("oauth-refresh-token-text");
    let buttonLogout = document.getElementById("oauth-logout-button");
    let buttonRefresh = document.getElementById("oauth-refresh-token-button");
    pCode.textContent = "code: " + code;
    pAccessToken.textContent = "access token: " + accessToken;
    pRefreshToken.textContent = "refresh token: " + refreshToken;

    if (hasCode && hasToken) {
        console.log("User has authenticated.");
        buttonRefresh.disabled = false;
        buttonRefresh.addEventListener("click", () => refreshAccessToken());
    } else {
        let buttonCode = document.getElementById("oauth-code-button");
        let buttonToken = document.getElementById("oauth-token-button");
        buttonCode.disabled = hasCode;
        buttonToken.disabled = hasToken;
        buttonCode.addEventListener("click", () => oauthSignIn());
        buttonToken.addEventListener("click", () => getAccessToken(false));
        buttonRefresh.addEventListener("click", () => refreshAccessToken(true));
        buttonLogout.addEventListener("click", () => {
            code = null;
            accessToken = null;
            refreshToken = null;
            hasCode = false;
            hasToken = false;
            if (accessToken) revokeAccess(accessToken);
            handleOAuthCallback();
        });
    }
}

window.onload = handleOAuthCallback;