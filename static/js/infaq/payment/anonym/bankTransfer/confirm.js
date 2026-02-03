(() =>
{
    moAuthorization.authorizeAnonymous();

    grecaptcha.enterprise.ready(() =>
    {
        if (document.readyState == 'loading')
            document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
        else
            onDOMContentLoaded();
    });

    async function onDOMContentLoaded()
    {
        const bankTransferRecommendationNoteElement = mo.getElementById('bankTransferRecommendationNote');
        const bankTransferFormElement = mo.getElementById('bankTransferForm');
        const bankTransferMunfiqNameElement = mo.getElementById('bankTransferMunfiqNameInput');
        const bankTransferAmountElement = mo.getElementById('bankTransferAmountInput');
        const bankTransferDateTimeElement = mo.getElementById('bankTransferDateTimeInput');
        const bankTransferNotesElement = mo.getElementById('bankTransferNotesInput');
        const bankTransferFilesElement = mo.getElementById('bankTransferFilesInput');
        const bankTransferMessageElement = mo.getElementById('bankTransferMessage');
        const bankTransferSubmitElement = mo.getElementById('bankTransferSubmitButton');


        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        const nowString = now.toISOString().split('Z')[0];

        bankTransferDateTimeElement.setAttribute("max", nowString);
        bankTransferDateTimeElement.setAttribute("value", nowString);

        var recommendationNote = mo.getRecommendationNote();
        if (!recommendationNote)
        {
            const json = await mo.fetchApiJson(
                'payment/manual/getRecommendationNote',
                {
                    body:
                    {
                        captchaToken: await grecaptcha.enterprise.execute(mo.recaptchaSiteKey, { action: 'recommendationNotes' + mo.recaptchaActionAffix }),
                    },
                });

            if (json.ResultCode) return mo.showDialog('Error: ' + json.ResultMessage);

            recommendationNote = json.Data;

            mo.setRecommendationNote(recommendationNote);
        }
        bankTransferRecommendationNoteElement.textContent = 'MO Infaq ' + recommendationNote;
        bankTransferNotesElement.value = bankTransferRecommendationNoteElement.textContent;

        const messageColor = bankTransferMessageElement.style.color;

        bankTransferFilesElement.addEventListener('change', () => mo.setFileCustomValidity(bankTransferFilesElement, 2, 524288));
        bankTransferSubmitElement.addEventListener('click', submitForm);

        async function submitForm()
        {
            if (!bankTransferFormElement.reportValidity()) return;

            bankTransferMessageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';
            bankTransferMessageElement.style.color = messageColor;

            bankTransferSubmitElement.disabled = true;
            bankTransferSubmitElement.classList.toggle("loading");

            const date = new Date(bankTransferDateTimeElement.value);

            try
            {
                const formData = new FormData();

                formData.append('munfiqName', bankTransferMunfiqNameElement.value.trim());
                formData.append('amount', bankTransferAmountElement.value);
                formData.append('manualDateTime', date.toISOString());
                formData.append('manualNotes', bankTransferNotesElement.value.trim());
                formData.append('paymentType', 22);

                for (const file of bankTransferFilesElement.files)
                    formData.append('files[]', file);

                const json = await mo.fetchAnonymInfaqBankTransfer(formData);

                if (json.ResultCode) return showError(json.ResultMessage);


                mo.removeRecommendationNote();


                bankTransferSubmitElement.classList.toggle("loading");

                mo.showDialog('Confirmation submitted. Thank you!', () => location.href = '/infaq/list');
            }
            catch (err)
            {
                console.error(err);

                showError(err.message);
            }

            function showError(e)
            {
                bankTransferSubmitElement.classList.toggle("loading");
                bankTransferSubmitElement.disabled = false;

                bankTransferMessageElement.textContent = e;
                bankTransferMessageElement.style.color = 'red';
            }
        }
    }
})();
