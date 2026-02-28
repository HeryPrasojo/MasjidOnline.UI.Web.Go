(async () =>
{
    moAuthorization.authorizeAnonymous();

    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    function onDOMContentLoaded()
    {
        const loginFormElement = mo.getElementById('loginForm');
        const emailElement = mo.getElementById('emailInput');
        const passwordElement = mo.getElementById('passwordInput');
        const messageElement = mo.getElementById('loginMessage');
        const submitElement = mo.getElementById('submitButton');

        const messageColor = messageElement.style.color;

        submitElement.addEventListener('click', submitForm);

        async function submitForm()
        {
            if (!loginFormElement.reportValidity()) return;

            messageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';
            messageElement.style.color = messageColor;

            submitElement.disabled = true;
            submitElement.classList.toggle("loading");

            const email = emailElement.value;
            const password = passwordElement.value;

            try
            {
                const json = await moFetch.fetchLogin({
                    Client: 1, // Web
                    Contact: email,
                    ContactType: 1, // Email
                    LocationLatitude: moGeoLocation.latitude,
                    LocationLongitude: moGeoLocation.longitude,
                    LocationPrecision: moGeoLocation.precision,
                    LocationAltitude: moGeoLocation.altitude,
                    LocationAltitudePrecision: moGeoLocation.altitudePrecision,
                    Password: password,
                    UserAgent: navigator.userAgent,
                });

                if (json.ResultCode) return showError(json.ResultMessage);


                const data = json.Data;

                moCookie.setPermission(data.Permission);

                moCookie.setUserType(data.UserType);

                messageElement.textContent = 'Success, redirecting...';
                messageElement.classList.toggle("loading");

                const urlSearchParams = new URLSearchParams(location.search);

                location.href = urlSearchParams.get('r') ?? '/';
            }
            catch (err)
            {
                console.error(err);

                showError(err.message);
            }

            function showError(e)
            {
                submitElement.classList.toggle("loading");
                submitElement.disabled = false;

                messageElement.textContent = e;
                messageElement.style.color = 'red';
            }
        }
    }
})();
