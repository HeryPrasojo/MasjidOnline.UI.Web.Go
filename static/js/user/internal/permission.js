(() =>
{
    const urlSearchParams = new URLSearchParams(window.location.search);

    const idParam = urlSearchParams.get('i');

    if (!idParam) location.href = '/';

    const internalUserId = parseInt(idParam);


    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", layout);
    else
        layout();

    document.addEventListener("moLayoutChanged", layout);

    function layout()
    {
        if (moHub.isStarted) receiveUserInternalView();

        else document.addEventListener('hub.started', receiveUserInternalView);
    }

    async function receiveUserInternalView()
    {
    }

})();
