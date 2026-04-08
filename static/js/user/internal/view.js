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
        const relatedGroupElement = mo.getElementById('relatedGroup');
        const permissionLinkElement = mo.getElementById('permissionLink');
        const internalUserMessage = mo.getElementById('internalUserMessage');
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
        const buttonRowElement = mo.getElementById('buttonRow');
        const approveMessageElement = mo.getElementById('approveMessage');
        const cancelButton = mo.getElementById('cancelButton');
        const approveButton = mo.getElementById('approveButton');
        const rejectButton = mo.getElementById('rejectButton');
        const cancelRejectDialog = mo.getElementById('cancelRejectDialog');
        const cancelRejectForm = mo.getElementById('cancelRejectForm');
        const descriptionInputElement = mo.getElementById('descriptionInput');
        const cancelRejectMessageElement = mo.getElementById('cancelRejectMessage');
        const cancel2Button = mo.getElementById('cancel2Button');
        const reject2Button = mo.getElementById('reject2Button');
        const cancelRejectCloseButton = mo.getElementById('cancelRejectCloseButton');

        const messageColor = internalUserMessage.style.color;

        internalUserIdElement.textContent = internalUserId;


        cancelButton.addEventListener('click', cancel);
        approveButton.addEventListener('click', approve);
        rejectButton.addEventListener('click', reject);
        cancel2Button.addEventListener('click', cancel2);
        reject2Button.addEventListener('click', reject2);
        cancelRejectCloseButton.addEventListener('click', () =>
        {
            cancelRejectDialog.close();
        });


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

            if (moStorage.getUserId() == data.UserId) relatedGroupElement.classList.add('display-none');
            else if (data.Status == 4) relatedGroupElement.classList.remove('display-none');
            else relatedGroupElement.classList.add('display-none');

            permissionLinkElement.setAttribute('href', `/user/internal/permission?i=${data.UserId}`);

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

            // new
            if (data.Status == 1)
            {
                buttonRowElement.classList.remove('display-none');
            }
            else
            {
                document.querySelectorAll('.nonNew').forEach((element) =>
                {
                    element.classList.remove('nonNew');
                });

                // not approve
                if (data.Status != 4) descriptionRowElement.classList.remove('display-none');
            }


            internalUserMessage.textContent = '\u00A0\u00A0\u00A0\u00A0';
            internalUserMessage.style.color = messageColor;
            internalUserMessage.classList.toggle("loading");
        }

        async function approve()
        {
            cancelButton.disabled = true;
            approveButton.disabled = true;
            rejectButton.disabled = true;

            approveMessageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';

            approveButton.classList.toggle("loading");

            try
            {
                const json = await moHub.sendUserInternalApprove({
                    Description: descriptionInputElement.value,
                    Id: internalUserId,
                });

                if (json.ResultCode) return showError(json.ResultMessage);

                approveMessageElement.style.color = messageColor;
                approveMessageElement.textContent = 'Success. Reloading ...';
                approveMessageElement.classList.toggle("loading");

                location.reload();
            }
            catch (e)
            {
                showApproveError(e.message);
            }
        }

        function cancel()
        {
            cancel2Button.classList.remove('display-none');

            reject2Button.classList.add('display-none');

            cancelRejectDialog.showModal();
        }

        async function cancel2()
        {
            if (!cancelRejectForm.reportValidity()) return;

            cancel2Button.disabled = true;

            cancelRejectMessageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';

            cancel2Button.classList.toggle("loading");

            try
            {
                const json = await moHub.sendUserInternalCancel({
                    Description: descriptionInputElement.value,
                    Id: internalUserId,
                });

                if (json.ResultCode) return showCancelRejectError(json.ResultMessage);

                cancelRejectMessageElement.style.color = messageColor;
                cancelRejectMessageElement.textContent = 'Success. Reloading ...';
                cancelRejectMessageElement.classList.toggle("loading");

                location.reload();
            }
            catch (e)
            {
                showCancelRejectError(e.message);
            }
        }

        function reject()
        {
            cancel2Button.classList.add('display-none');

            reject2Button.classList.remove('display-none');

            cancelRejectDialog.showModal();
        }

        async function reject2()
        {
            if (!cancelRejectForm.reportValidity()) return;

            cancelButton.disabled = true;
            approveButton.disabled = true;
            rejectButton.disabled = true;

            cancelRejectMessageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';

            rejectButton.classList.toggle("loading");

            try
            {
                const json = await moHub.sendUserInternalReject({
                    Description: descriptionInputElement.value,
                    Id: internalUserId,
                });

                if (json.ResultCode) return showCancelRejectError(json.ResultMessage);

                cancelRejectMessageElement.style.color = messageColor;
                cancelRejectMessageElement.textContent = 'Success. Reloading ...';
                cancelRejectMessageElement.classList.toggle("loading");

                location.reload();
            }
            catch (e)
            {
                showCancelRejectError(e.message);
            }
        }

        function showError(e)
        {
            internalUserMessage.textContent = e;
            internalUserMessage.style.color = 'red';
        }

        function showApproveError(e)
        {
            approveMessageElement.textContent = e;
            approveMessageElement.style.color = 'red';
        }

        function showCancelRejectError(e)
        {
            cancelRejectMessageElement.textContent = e;
            cancelRejectMessageElement.style.color = 'red';
        }
    }
})();
