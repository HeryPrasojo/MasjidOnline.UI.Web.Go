(function ()
{
    var id;
    var data;
    var errorMessageElement;

    grecaptcha.enterprise.ready(start);

    document.addEventListener("moLayoutChanged", onLayoutChanged);

    async function start()
    {
        errorMessageElement = mo.getElementById('viewMessage');

        const urlSearchParams = new URLSearchParams(window.location.search);
        const idString = urlSearchParams.get('i');
        id = parseInt(idString, 10);

        try
        {
            const json = await moFetch.fetchDonationView({
                Id: id,
            });

            if (json.ResultCode)
            {
                errorMessageElement.classList.toggle("loading");

                return showError(json.ResultMessage);
            }


            data = json.Data;
        }
        catch (e)
        {
            showError(e);
        }

        displayData();


        function showError(e)
        {
            errorMessageElement.textContent = e;
            errorMessageElement.style.color = 'red';
        }
    }

    function onLayoutChanged()
    {
        displayData();
    }

    function displayData()
    {
        const viewMessage = mo.getElementById('viewMessage');

        const donationIdElement = mo.getElementById('donationId');
        const dateTimeElement = mo.getElementById('dateTime');
        const munfiqNameElement = mo.getElementById('munfiqName');
        const paymentElement = mo.getElementById('payment');
        const amountElement = mo.getElementById('amount');
        const statusElement = mo.getElementById('status');
        const requestByRowElement = mo.getElementById('requestByRow');
        const requestByElement = mo.getElementById('requestBy');
        const requestDateTimeRowElement = mo.getElementById('requestDateTimeRow');
        const requestDateTimeElement = mo.getElementById('requestDateTime');

        const buttonRowElement = mo.getElementById('buttonRow');
        const successButtonElement = mo.getElementById('successButton');
        const failButtonElement = mo.getElementById('failButton');
        const approveButtonElement = mo.getElementById('approveButton');
        const rejectButtonElement = mo.getElementById('rejectButton');

        const failRejectDialogElement = mo.getElementById('failRejectDialog');
        const failRejectForm = mo.getElementById('failRejectForm');
        const descriptionInputElement = mo.getElementById('descriptionInput');
        const failRejectMessageElement = mo.getElementById('failRejectMessage');
        const fail2ButtonElement = mo.getElementById('fail2Button');
        const reject2ButtonElement = mo.getElementById('reject2Button');
        const failRejectCloseButton = mo.getElementById('failRejectCloseButton');

        const messageColor = viewMessage.style.color;

        donationIdElement.innerHTML = id;

        dateTimeElement.innerHTML = data.DateTime;
        munfiqNameElement.innerHTML = data.MunfiqName;
        paymentElement.innerHTML = data.PaymentTypeText;
        amountElement.innerHTML = data.Amount;
        statusElement.innerHTML = data.StatusText;
        requestByElement.innerHTML = data.RequestBy;
        requestDateTimeElement.innerHTML = data.RequestDateTime;

        errorMessageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';
        errorMessageElement.classList.toggle("loading");

        if (buttonRowElement) buttonRowElement.classList.remove("display-none");

        if (data.Status == 2)
        {
            if (successButtonElement) successButtonElement.classList.remove("display-none");

            if (failButtonElement)
            {
                failButtonElement.classList.remove("display-none")

                failButtonElement.addEventListener(
                    "click",
                    async function () 
                    {
                        fail2ButtonElement.classList.remove("display-none");
                        if (reject2ButtonElement) reject2ButtonElement.classList.add("display-none");

                        failRejectDialogElement.showModal();
                    }
                );
            };

            if (fail2ButtonElement)
            {
                fail2ButtonElement.addEventListener(
                    "click",
                    async function () 
                    {
                        if (!failRejectForm.reportValidity()) return;

                        fail2ButtonElement.disabled = true;

                        failRejectMessageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';

                        fail2ButtonElement.classList.toggle("loading");

                        try
                        {
                            const json = await moHub.sendDonationDonationRequestFail({
                                Description: descriptionInputElement.value,
                                Id: id,
                            });

                            if (json.ResultCode) return showFailRejectError(json.ResultMessage);

                            failRejectMessageElement.style.color = messageColor;
                            failRejectMessageElement.textContent = moLocale.get(['Success. Reloading ...']);
                            failRejectMessageElement.classList.toggle("loading");

                            location.reload();
                        }
                        catch (e)
                        {
                            showFailRejectError(e.message);
                        }
                    }
                );
            }
        }
        else if (data.Status == 4)
        {
            requestByRowElement.classList.remove("display-none");
            requestDateTimeRowElement.classList.remove("display-none");

            if (approveButtonElement) approveButtonElement.classList.remove("display-none");

            if (rejectButtonElement)
            {
                rejectButtonElement.classList.remove("display-none");

                rejectButtonElement.addEventListener(
                    "click",
                    async function () 
                    {
                        reject2ButtonElement.classList.remove("display-none");
                        if (fail2ButtonElement) fail2ButtonElement.classList.add("display-none");

                        failRejectDialogElement.showModal();
                    }
                );
            }

            if (reject2ButtonElement)
            {
                reject2ButtonElement.addEventListener(
                    "click",
                    async function () 
                    {
                        if (!failRejectForm.reportValidity()) return;

                        reject2ButtonElement.disabled = true;

                        failRejectMessageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';

                        reject2ButtonElement.classList.toggle("loading");

                        try
                        {
                            const json = await moHub.sendDonationDonationRejectFail({
                                Description: descriptionInputElement.value,
                                Id: id,
                            });

                            if (json.ResultCode) return showFailRejectError(json.ResultMessage);

                            failRejectMessageElement.style.color = messageColor;
                            failRejectMessageElement.textContent = moLocale.get(['Success. Reloading ...']);
                            failRejectMessageElement.classList.toggle("loading");

                            location.reload();
                        }
                        catch (e)
                        {
                            showFailRejectError(e.message);
                        }
                    }
                );
            }
        }


        failRejectCloseButton.addEventListener('click', () =>
        {
            failRejectDialog.close();
        });


        function showFailRejectError(e)
        {
            failRejectMessageElement.textContent = e;
            failRejectMessageElement.style.color = 'red';

            console.error(e);
        }
    }

})();
