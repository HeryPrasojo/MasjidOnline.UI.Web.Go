const moDialog =
{
    showModal: async (innerHtml, onClose) =>
    {
        const dialogElement = mo.getElementById('moDialog');

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

                alert(innerHtml);

                return;
            }

            dialogElement = mo.getElementById('moDialog');
        }

        const dialogMessageElement = mo.getElementById('moDialogMessage');

        dialogMessageElement.innerHTML = innerHtml;

        dialogElement.showModal();

        if (onClose) dialogElement.addEventListener('close', onClose, { once: true });
    }
};
