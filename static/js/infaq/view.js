(function ()
{
    var id;
    var data;

    grecaptcha.enterprise.ready(start);

    document.addEventListener("moLayoutChanged", onLayoutChanged);

    async function start()
    {
        const errorMessageElement = mo.getElementById('errorMessage');

        const urlSearchParams = new URLSearchParams(window.location.search);
        const idString = urlSearchParams.get('i');
        id = parseInt(idString, 10);

        try
        {
            const json = await moFetch.fetchInfaqView({
                Id: id,
            });

            if (json.ResultCode) return showError(json.ResultMessage);


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
        const infaqIdElement = mo.getElementById('infaqId');
        const dateTimeElement = mo.getElementById('dateTime');
        const munfiqNameElement = mo.getElementById('munfiqName');
        const paymentElement = mo.getElementById('payment');
        const amountElement = mo.getElementById('amount');
        const statusElement = mo.getElementById('status');

        infaqIdElement.innerHTML = id;

        dateTimeElement.innerHTML = data.DateTime;
        munfiqNameElement.innerHTML = data.MunfiqName;
        paymentElement.innerHTML = data.PaymentType;
        amountElement.innerHTML = data.Amount;
        statusElement.innerHTML = data.Status;
    }

})();
