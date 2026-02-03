const moDialog = {
    showModal: async (innerHtml, onClose) =>
    {
        var dialogElement = mo.getElementById('moDialog');

        if (!dialogElement)
        {
            try
            {
                const dialogHtml = await moFetch.fetchText('/dialog');

                document.body.append(dialogHtml);
            }
            catch (e)
            {
                alert(e);

                alert(innerHtml);

                return;
            }

            dialogElement = mo.getElementById('moDialog');
        }

        var dialogMessageElement = mo.getElementById('moDialogMessage');

        dialogMessageElement.innerHTML = innerHtml;

        dialogElement.showModal();

        if (onClose) dialogElement.addEventListener('close', onClose, { once: true });
    }
};
