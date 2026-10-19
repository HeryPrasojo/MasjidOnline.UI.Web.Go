const moDialog =
{
    show: async (parameter) =>
    {
        if (!parameter) parameter = {};

        if (typeof (parameter) === 'string')
        {
            parameter =
            {
                innerHtml: parameter,
            };
        }

        var dialogElement = mo.getElementById('moDialog');

        if (!dialogElement)
        {
            try
            {
                const dialogHtml = await moFetch.fetchText('/dialog');

                document.body.insertAdjacentHTML('beforeend', dialogHtml);
            }
            catch (e)
            {
                alert(e);

                alert(parameter.innerHtml);

                return;
            }

            dialogElement = mo.getElementById('moDialog');
        }


        const dialogMessageElement = mo.getElementById('moDialogMessage');

        if (parameter.innerHtml) dialogMessageElement.innerHTML = parameter.innerHtml;
        else
        {
            if (parameter.type == 'confirmation') dialogMessageElement.innerHTML = moLocale.get(['Are you sure?']);
        }


        if (parameter.type == 'confirmation')
        {
            const yesButtonElement = mo.getElementById('moDialogYes');
            const cancelButtonElement = mo.getElementById('moDialogCancel');

            yesButtonElement.classList.remove("display-none");
            cancelButtonElement.classList.remove("display-none");

            if (parameter.onYes) yesButtonElement.addEventListener('click', parameter.onYes, { once: true });
        }
        else
        {
            const closeButtonElement = mo.getElementById('moDialogClose');

            closeButtonElement.classList.remove("display-none");
        }


        dialogElement.showModal();

        if (parameter.onClose) dialogElement.addEventListener('close', parameter.onClose, { once: true });
    }
};
