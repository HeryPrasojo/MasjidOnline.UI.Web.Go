(() =>
{
    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    function onDOMContentLoaded()
    {
        const internalUserAddButton = mo.getElementById('internalUserAddButton');

        const internalUserRowHolder = mo.getElementById('internalUserRowHolder');
        const internalUserPageForm = mo.getElementById('formInternalUserPage');
        const internalUserPageCurrent = mo.getElementById('internalUserPageCurrent');
        const internalUserPageTotal = mo.getElementById('internalUserPageTotal');
        const internalUserErrorMessage = mo.getElementById('internalUserErrorMessage');
        const internalUserFirstButton = mo.getElementById('internalUserFirstButton');
        const internalUserPrevButton = mo.getElementById('internalUserPrevButton');
        const internalUserPageInput = mo.getElementById('internalUserPageInput');
        const internalUserGoButton = mo.getElementById('internalUserGoButton');
        const internalUserNextButton = mo.getElementById('internalUserNextButton');
        const internalUserLastButton = mo.getElementById('internalUserLastButton');


        const messageColor = internalUserErrorMessage.style.color;

        var currentPage = 1;
        var totalPage = 0;

        internalUserAddButton.addEventListener('click', () => location.href = '/user/internal/add');

        internalUserFirstButton.addEventListener('click', submitFirst);
        internalUserPrevButton.addEventListener('click', submitPrev);
        internalUserGoButton.addEventListener('click', submitNumber);
        internalUserNextButton.addEventListener('click', submitNext);
        internalUserLastButton.addEventListener('click', submitLast);


        if (!moCookie.getIsLoggedIn() || moHub.isStarted) submitFirst();

        else document.addEventListener('hub.started', submitFirst);


        async function submitFirst()
        {
            await submitForm(1);
        }

        async function submitPrev()
        {
            await submitForm(currentPage - 1);
        }

        async function submitNumber()
        {
            if (!internalUserPageForm.reportValidity()) return;


            const pageNumber = parseInt(internalUserPageInput.value, 10);

            await submitForm(pageNumber);
        }

        async function submitNext()
        {
            await submitForm(currentPage + 1);
        }

        async function submitLast()
        {
            await submitForm(totalPage);
        }

        async function submitForm(pageNumber)
        {
            internalUserRowHolder.innerHTML = '';
            internalUserErrorMessage.textContent = 'Loading ...';
            internalUserErrorMessage.style.color = messageColor;
            internalUserErrorMessage.classList.toggle("loading");

            internalUserFirstButton.disabled = true;
            internalUserPrevButton.disabled = true;
            internalUserGoButton.disabled = true;
            internalUserNextButton.disabled = true;
            internalUserLastButton.disabled = true;

            const body = {
                Page: pageNumber,
            };

            const json = await moHub.receiveUserInternalList(body);

            if (json.ResultCode)
            {
                internalUserErrorMessage.classList.toggle("loading");

                enableButton();

                return showError(json.ResultMessage);
            }


            const data = json.Data;
            currentPage = pageNumber;
            totalPage = data.PageCount;

            for (const record of data.Records)
            {
                const idTextNode = document.createTextNode(record.Id);
                const dateTimeTextNode = record.DateTime;
                const name = record.PersonName ?? '';
                const statusTextNode = record.Status;
                const addName = record.AddPersonName ?? '';

                const itemA = document.createElement('a');
                itemA.href = 'view?i=' + record.Id;
                itemA.append(idTextNode);

                const idTd = document.createElement('td');
                const dateTimeTd = document.createElement('td');
                const nameTd = document.createElement('td');
                const statusTd = document.createElement('td');
                const addNameTd = document.createElement('td');

                idTd.append(itemA);
                dateTimeTd.append(document.createTextNode(dateTimeTextNode));
                nameTd.append(document.createTextNode(name));
                statusTd.append(document.createTextNode(statusTextNode));
                addNameTd.append(document.createTextNode(addName));

                const tr = document.createElement('tr');

                tr.append(idTd, dateTimeTd, nameTd, statusTd, addNameTd);

                internalUserRowHolder.append(tr);
            }

            internalUserErrorMessage.textContent = '\u00A0\u00A0\u00A0\u00A0';
            internalUserErrorMessage.classList.toggle("loading");

            internalUserPageCurrent.innerText = currentPage;
            internalUserPageTotal.innerText = totalPage;

            internalUserPageInput.value = currentPage;
            internalUserGoButton.disabled = false;

            enableButton();


            function enableButton()
            {
                if (currentPage > 1)
                {
                    internalUserFirstButton.disabled = false;
                    internalUserPrevButton.disabled = false;
                }

                if (currentPage < totalPage)
                {
                    internalUserNextButton.disabled = false;
                    internalUserLastButton.disabled = false;
                }
            }

            function showError(e)
            {
                internalUserErrorMessage.textContent = e;
                internalUserErrorMessage.style.color = 'red';
            }
        }
    }

})();
