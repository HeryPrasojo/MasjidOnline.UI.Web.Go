const moHub = {};

(() =>
{
    if (!moStorage.getIsLoggedIn()) return;


    var lockResolver;

    if (navigator && navigator.locks && navigator.locks.request)
    {
        const promise = new Promise(
            (res) =>
            {
                lockResolver = res;
            }
        );

        navigator.locks.request(
            'moAntiSleepLock',
            { mode: "shared" },
            () =>
            {
                return promise;
            }
        );
    }


    const sessionId = moStorage.getSession();

    const connection = new signalR.HubConnectionBuilder()
        .withServerTimeout(64000)
        .withUrl(
            mo.hubUri,
            {
                accessTokenFactory: () => sessionId,
                withCredentials: false,
            })
        .configureLogging(signalR.LogLevel.Warning)
        .build();

    connection.onclose(async () =>
    {
        console.log('closed');
        if (moStorage.getIsLoggedIn()) startConnection();
    });

    connection.on('logout', () =>
    {
        moStorage.removeIsLoggedIn();

        moCookie.removeUserType();

        location.href = '/';
    });


    moHub.sendUserLogout = () =>
    {
        invoke("UserUserLogout");
    }


    moHub.sendUserInternalAdd = async (request) =>
    {
        await addRequestCaptchaToken(request, 'addInternalUser');

        return invoke("UserInternalAdd", request);
    }

    moHub.sendUserInternalApprove = (request) =>
    {
        return invoke("UserInternalApprove", request);
    }

    moHub.sendUserInternalCancel = (request) =>
    {
        return invoke("UserInternalCancel", request);
    }

    moHub.receiveUserInternalList = (request) =>
    {
        return invoke("UserInternalGetMany", request);
    }

    moHub.sendUserInternalReject = (request) =>
    {
        return invoke("UserInternalReject", request);
    }

    moHub.receiveUserInternalView = (request) =>
    {
        return invoke("UserInternalGetOne", request);
    }


    startConnection();


    // TODO move to captcha.js

    async function addRequestCaptchaToken(body, action)
    {
        if (body instanceof FormData)
        {
            if (!body.has('CaptchaToken'))
            {
                const captchaToken = await getCaptchaToken(action);

                body.append('CaptchaToken', captchaToken);
            }
        }
        else
        {
            if (!body.CaptchaToken)
            {
                const captchaToken = await getCaptchaToken(action);

                body.CaptchaToken = captchaToken;
            }
        }
    }

    async function getCaptchaToken(action)
    {
        return await grecaptcha.enterprise.execute(mo.recaptchaSiteKey, { action: mo.recaptchaActionPrefix + action });
    }

    function invoke(methodName, ...requests)
    {
        return connection.invoke(methodName, ...requests);
    }

    async function startConnection()
    {
        try
        {
            await connection.start();

            if (!moHub.isStarted)
            {
                moHub.isStarted = true;


                const onHubStartedEvent = new Event("hubStarted");

                document.dispatchEvent(onHubStartedEvent);
            }
        }
        catch (err)
        {
            if (!err.message == 'Failed to complete negotiation with the server: TypeError: Failed to fetch')
            {
                console.log(err.name + ': ' + err.message);
            }

            setTimeout(startConnection, (mo.environment == 'L') ? 512000 : 4000);
        }
    };

})();
