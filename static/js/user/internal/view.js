(async () =>
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

    async function layout()
    {
        const internalUserMessage = mo.getElementById('internalUserMessage');
        const viewForm = mo.getElementById('internalUserViewForm');
        const internalUserIdElement = mo.getElementById('internalUserIdField');
        const dateTimeElement = mo.getElementById('dateTimeField');
        const contactElement = mo.getElementById('contactField');
        const nameElement = mo.getElementById('nameField');
        const statusElement = mo.getElementById('statusField');
        const addNameElement = mo.getElementById('addNameField');
        const editNameElement = mo.getElementById('editNameField');
        const editDateTimeElement = mo.getElementById('editDateTimeField');
        const descriptionRowElement = mo.getElementById('descriptionRow');
        const descriptionElement = mo.getElementById('descriptionField');
        const descriptionInputElement = mo.getElementById('descriptionInput');
        const buttonRowElement = mo.getElementById('buttonRow');
        const cancelButton = mo.getElementById('cancelButton');
        const approveButton = mo.getElementById('approveButton');
        const rejectButton = mo.getElementById('rejectButton');

        const messageColor = internalUserMessage.style.color;

        internalUserIdElement.textContent = internalUserId;


        cancelButton.addEventListener('click', cancel);
        approveButton.addEventListener('click', approve);
        rejectButton.addEventListener('click', reject);


        if (moHub.isStarted) receiveUserInternalView();

        else document.addEventListener('hub.started', receiveUserInternalView);


        async function receiveUserInternalView()
        {
            const body = {
                Id: internalUserId,
            };

            const json = await moHub.receiveUserInternalView(body);

            if (json.ResultCode)
            {
                internalUserMessage.classList.toggle("loading");

                return showError(json.ResultMessage);
            }


            const data = json.Data;

            if (data.Status == 1)
            {
                moAuthorization.showInternalPermission({
                    UserInternalAdd: ['#descriptionRow', '#descriptionInputParent', '#cancelButton'],
                    UserInternalApprove: ['#descriptionRow', '#descriptionInputParent', '#approveButton', '#rejectButton'],
                });


                if (permission && (permission.UserInternalAdd || permission.UserInternalApprove))
                {
                    buttonRowElement.classList.remove('internalPermission');
                }
            }
            else
            {
                if (data.Status != 4) descriptionRowElement.classList.remove('internalPermission');

                document.querySelectorAll('.nonNew').forEach((element) =>
                {
                    element.classList.remove('nonNew');
                });
            }


            dateTimeElement.textContent = data.DateTime;
            descriptionElement.textContent = data.Description;
            nameElement.textContent = data.PersonName;
            contactElement.textContent = `${data.ContactType}: ${data.Contact}`;
            addNameElement.textContent += ` (${data.AddContactType}: ${data.AddContact})`;
            statusElement.textContent = data.StatusText;
            editDateTimeElement.textContent = data.EditDateTime;

            addNameElement.textContent = data.AddPersonName;
            editNameElement.textContent = data.EditPersonName ?? '';
            if (data.EditDateTime) editNameElement.textContent += ` (${data.EditContactType}: ${data.EditContact})`;


            internalUserMessage.textContent = '\u00A0\u00A0\u00A0\u00A0';
            internalUserMessage.classList.toggle("loading");
        }

        async function approve()
        {
            descriptionInputElement.required = false;

            if (!viewForm.reportValidity()) return;

            cancelButton.disabled = true;
            approveButton.disabled = true;
            rejectButton.disabled = true;

            internalUserMessage.textContent = '\u00A0\u00A0\u00A0\u00A0';

            approveButton.classList.toggle("loading");

            try
            {
                const json = await moHub.sendUserInternalApprove({
                    Description: descriptionInputElement.value,
                    Id: internalUserId,
                });

                if (json.ResultCode) return showError(json.ResultMessage);

                internalUserMessage.style.color = messageColor;
                internalUserMessage.textContent = 'Success. Reloading ...';
                internalUserMessage.classList.toggle("loading");

                location.reload();
            }
            catch (e)
            {
                showError(e.message);
            }
        }

        async function cancel()
        {
            descriptionInputElement.required = true;

            if (!viewForm.reportValidity()) return;

            cancelButton.disabled = true;
            approveButton.disabled = true;
            rejectButton.disabled = true;

            internalUserMessage.textContent = '\u00A0\u00A0\u00A0\u00A0';

            cancelButton.classList.toggle("loading");

            try
            {
                const json = await moHub.sendUserInternalCancel({
                    Description: descriptionInputElement.value,
                    Id: internalUserId,
                });

                if (json.ResultCode) return showError(json.ResultMessage);

                internalUserMessage.style.color = messageColor;
                internalUserMessage.textContent = 'Success. Reloading ...';
                internalUserMessage.classList.toggle("loading");

                location.reload();
            }
            catch (e)
            {
                showError(e.message);
            }
        }

        async function reject()
        {
            descriptionInputElement.required = true;

            if (!viewForm.reportValidity()) return;

            cancelButton.disabled = true;
            approveButton.disabled = true;
            rejectButton.disabled = true;

            internalUserMessage.textContent = '\u00A0\u00A0\u00A0\u00A0';

            rejectButton.classList.toggle("loading");

            try
            {
                const json = await moHub.sendUserInternalReject({
                    Description: descriptionInputElement.value,
                    Id: internalUserId,
                });

                if (json.ResultCode) return showError(json.ResultMessage);

                internalUserMessage.style.color = messageColor;
                internalUserMessage.textContent = 'Success. Reloading ...';
                internalUserMessage.classList.toggle("loading");

                location.reload();
            }
            catch (e)
            {
                showError(e.message);
            }
        }

        function showError(e)
        {
            internalUserMessage.textContent = e;
            internalUserMessage.style.color = 'red';
        }
    }
})();
