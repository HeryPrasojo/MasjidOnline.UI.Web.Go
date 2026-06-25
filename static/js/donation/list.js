(() =>
{
    grecaptcha.enterprise.ready(start);

    document.addEventListener("moLayoutChanged", onLayoutChanged);

    var currentPage = 1;
    var totalPage = 0;

    async function start()
    {
        displayData();
    }

    function onLayoutChanged()
    {
        displayData();
    }

    function displayData()
    {
        const donationRowHolder = mo.getElementById('donationRowHolder');
        const donationPageCurrent = mo.getElementById('donationPageCurrent');
        const donationPageTotal = mo.getElementById('donationPageTotal');
        const donationErrorMessage = mo.getElementById('donationErrorMessage');
        const donationFirstButton = mo.getElementById('donationFirstButton');
        const donationPrevButton = mo.getElementById('donationPrevButton');
        const donationPageInput = mo.getElementById('donationPageInput');
        const donationGoButton = mo.getElementById('donationGoButton');
        const donationNextButton = mo.getElementById('donationNextButton');
        const donationLastButton = mo.getElementById('donationLastButton');

        const paymentElement = document.querySelector("#donationTable .payment");

        donationFirstButton.addEventListener('click', submitFirst);
        donationPrevButton.addEventListener('click', submitPrev);
        donationGoButton.addEventListener('click', submitNumber);
        donationNextButton.addEventListener('click', submitNext);
        donationLastButton.addEventListener('click', submitLast);

        submitForm(currentPage);


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
            const pageNumber = parseInt(donationPageInput.value, 10);

            if (isNaN(pageNumber) || pageNumber < 1)
            {
                const text = 'Invalid page number. Page number must be a positive integer.';

                donationErrorMessage.innerHTML = text;

                throw Error(text);
            }

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
            if (isNaN(pageNumber) || pageNumber < 1)
            {
                donationErrorMessage.innerHTML = 'Invalid page number. Page number must be a positive integer.';

                return;
            }

            donationRowHolder.innerHTML = '';
            donationErrorMessage.innerHTML = '';

            donationFirstButton.disabled = true;
            donationPrevButton.disabled = true;
            donationGoButton.disabled = true;
            donationNextButton.disabled = true;
            donationLastButton.disabled = true;

            try
            {
                const json = await moFetch.fetchDonationList({
                    Page: pageNumber
                });

                if (json.ResultCode) return showError(json.ResultMessage);


                const data = json.Data;
                currentPage = pageNumber;
                totalPage = data.PageCount;

                for (const record of data.Records)
                {
                    const idTextNode = document.createTextNode(record.Id);
                    const dateTimeTextNode = record.DateTime;
                    const munfiqName = record.MunfiqName;
                    const paymentType = record.PaymentType;
                    const amountTextNode = record.Amount;
                    const paymentStatusTextNode = record.Status;

                    const itemA = document.createElement('a');
                    itemA.href = 'view?i=' + record.Id;
                    itemA.append(idTextNode);

                    const idTd = document.createElement('td');
                    const dateTimeTd = document.createElement('td');
                    const munfiqNameTd = document.createElement('td');
                    const paymentTypeTd = document.createElement('td');
                    const amountTd = document.createElement('td');
                    const paymentStatusTd = document.createElement('td');

                    amountTd.className = 'textAlign-end';

                    idTd.append(itemA);
                    dateTimeTd.append(document.createTextNode(dateTimeTextNode));
                    munfiqNameTd.append(document.createTextNode(munfiqName));
                    paymentTypeTd.append(document.createTextNode(paymentType));
                    amountTd.append(document.createTextNode(amountTextNode));
                    paymentStatusTd.append(document.createTextNode(paymentStatusTextNode));

                    const tr = document.createElement('tr');

                    tr.append(idTd, dateTimeTd, munfiqNameTd);
                    if (paymentElement) tr.append(paymentTypeTd);
                    tr.append(amountTd, paymentStatusTd);

                    donationRowHolder.append(tr);
                }

                donationPageCurrent.innerText = currentPage;
                donationPageTotal.innerText = totalPage;

                if (currentPage > 1)
                {
                    donationFirstButton.disabled = false;
                    donationPrevButton.disabled = false;
                }

                donationPageInput.value = currentPage;
                donationGoButton.disabled = false;

                if (currentPage < data.PageCount)
                {
                    donationNextButton.disabled = false;
                    donationLastButton.disabled = false;
                }
            }
            catch (err)
            {
                console.error(err);

                showError(err.message);
            }

            function showError(e)
            {
                donationErrorMessage.textContent = e;
                donationErrorMessage.style.color = 'red';
            }
        }
    }

})();
