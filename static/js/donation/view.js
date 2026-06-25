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

            displayData();
        }
        catch (e)
        {
            showError(e);
        }

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
        const donationIdElement = mo.getElementById('donationId');
        const dateTimeElement = mo.getElementById('dateTime');
        const munfiqNameElement = mo.getElementById('munfiqName');
        const paymentElement = mo.getElementById('payment');
        const amountElement = mo.getElementById('amount');
        const statusElement = mo.getElementById('status');

        donationIdElement.innerHTML = id;

        dateTimeElement.innerHTML = data.DateTime;
        munfiqNameElement.innerHTML = data.MunfiqName;
        paymentElement.innerHTML = data.PaymentType;
        amountElement.innerHTML = data.Amount;
        statusElement.innerHTML = data.Status;

        errorMessageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';
        errorMessageElement.classList.toggle("loading");
    }

})();
