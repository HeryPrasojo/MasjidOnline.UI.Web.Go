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
        const internalUserPermissionMessage = mo.getElementById('internalUserPermissionMessage');
        const accountancyExpenditureAddElement = mo.getElementById('accountancyExpenditureAddInput');
        const accountancyExpenditureApproveElement = mo.getElementById('accountancyExpenditureApproveInput');
        const infaqStatusRequestElement = mo.getElementById('infaqStatusRequestInput');
        const infaqStatusApproveElement = mo.getElementById('infaqStatusApproveInput');
        const internalUserAddElement = mo.getElementById('internalUserAddInput');
        const internalUserApproveElement = mo.getElementById('internalUserApproveInput');
        const internalUserPermissionUpdateElement = mo.getElementById('internalUserPermissionUpdateInput');
        const updateElement = mo.getElementById('updateButton');

        const messageColor = internalUserPermissionMessage.style.color;


        if (moHub.isStarted) receiveUserInternalPermissionView();

        else document.addEventListener('hub.started', receiveUserInternalPermissionView);


        updateElement.addEventListener('click', update);

        async function receiveUserInternalPermissionView()
        {
            internalUserPermissionMessage.textContent = '\u00A0\u00A0\u00A0\u00A0';
            internalUserPermissionMessage.classList.add("loading");

            const body = {
                UserId: internalUserId,
            };

            const json = await moHub.receiveUserInternalPermissionView(body);

            if (json.ResultCode) return showError(json.ResultMessage);


            const data = json.Data;

            accountancyExpenditureAddElement.checked = data.AccountancyExpenditureAdd;
            accountancyExpenditureApproveElement.checked = data.AccountancyExpenditureApprove;
            infaqStatusRequestElement.checked = data.InfaqStatusRequest;
            infaqStatusApproveElement.checked = data.InfaqStatusApprove;
            internalUserAddElement.checked = data.UserInternalAdd;
            internalUserApproveElement.checked = data.UserInternalApprove;
            internalUserPermissionUpdateElement.checked = data.UserInternalPermissionUpdate;

            internalUserPermissionMessage.classList.remove("loading");
            internalUserPermissionMessage.style.color = messageColor;
            internalUserPermissionMessage.textContent = '\u00A0\u00A0\u00A0\u00A0';
        }

        function showError(e)
        {
            internalUserPermissionMessage.classList.remove("loading");
            internalUserPermissionMessage.classList.add("color-error");
            internalUserPermissionMessage.textContent = e;

            updateElement.disabled = false;
            updateElement.classList.remove("loading");
        }

        async function update()
        {
            updateElement.disabled = true;
            updateElement.classList.add("loading");

            internalUserPermissionMessage.textContent = '\u00A0\u00A0\u00A0\u00A0';
            internalUserPermissionMessage.classList.add("loading");

            const body = {
                UserId: internalUserId,
                AccountancyExpenditureAdd: accountancyExpenditureAddElement.checked,
                AccountancyExpenditureApprove: accountancyExpenditureApproveElement.checked,
                InfaqStatusRequest: infaqStatusRequestElement.checked,
                InfaqStatusApprove: infaqStatusApproveElement.checked,
                UserInternalAdd: internalUserAddElement.checked,
                UserInternalApprove: internalUserApproveElement.checked,
                UserInternalPermissionUpdate: internalUserPermissionUpdateElement.checked
            };

            const json = await moHub.sendUserInternalPermissionUpdate(body);

            if (json.ResultCode) return showError(json.ResultMessage);


            internalUserPermissionMessage.classList.remove("loading");
            internalUserPermissionMessage.style.color = messageColor;
            internalUserPermissionMessage.textContent = moLocale.get(['Success']);

            updateElement.disabled = false;
            updateElement.classList.remove("loading");
        }
    }

})();
